import argparse
import asyncio
import json
import logging
import os
import ssl
import time
import av
from ultralytics import YOLO
import cv2

from gpiozero import MotionSensor

from aiohttp import web
from aiortc import RTCPeerConnection, RTCSessionDescription
from aiortc.contrib.media import MediaStreamTrack

from picamera2 import Picamera2
from fractions import Fraction

ROOT = os.path.dirname(__file__)

pir = MotionSensor(14)

model = YOLO('yolov8n.pt')

cam = Picamera2()
#mode = cam.sensor_modes[0]
#config = cam.create_video_configuration(sensor={'output_size': mode['size'], 'bit_depth': mode['bit_depth']}, main={"size": (640,480)})
cam.configure(cam.create_video_configuration(main={"size": (640, 480)}))
#print(cam.sensor_modes)
#cam.configure(config)

# sensor = {'output_size': (1640, 1232), 'bit_depth': 8}
# raw = {'format': 'SBGGR8'}  # this is an unpacked format
#config = camera.create_preview_configuration(sensor=sensor)  # this would fail
# config = cam.create_preview_configuration(raw=raw, sensor=sensor)  # works
# cam.configure(config)

cam.start()

def detect_yolo(frame):
    img_rgb = cv2.cvtColor(frame, cv2.COLOR_RGBA2RGB)
    results = model(img_rgb, stream=True)
    for result in results:
        pred = result.probs
    
async def check_motion():
    while True:  # This creates a continuous loop
        if pir.motion_detected:
            print('Motion detected')
        else:
            print('No motion')
        await asyncio.sleep(1)

class PiCameraTrack(MediaStreamTrack):
    kind = "video"

    def __init__(self):
        super().__init__()
        self._frame_count = 0
        self._start_time = None

    async def recv(self):
        if self._start_time is None:
            self._start_time = time.time()
        img = cam.capture_array()

        # if(self._frame_count % 20 == 0):
        #     detect_yolo(img)
                    
        pts = time.time() * 1000000
        new_frame = av.VideoFrame.from_ndarray(img, format='rgba')
        new_frame.pts = int(pts)
        new_frame.time_base = Fraction(1,1000000)

        self._frame_count += 1
        elapsed_time = time.time() - self._start_time
        if elapsed_time > 2:
            fps = self._frame_count / elapsed_time
            print(f"Current FPS: {fps:.2f}")
            self._frame_count = 0
            self._start_time = time.time()

        return new_frame


async def offer(request):
    params = await request.json()
    offer = RTCSessionDescription(sdp=params["sdp"], type=params["type"])

    pc = RTCPeerConnection()
    pcs.add(pc)

    @pc.on("connectionstatechange")
    async def on_connectionstatechange():
        print("Connection state is %s" % pc.connectionState)
        if pc.connectionState == "failed":
            await pc.close()
            pcs.discard(pc)

    # open media source
    cam = PiCameraTrack()

    if cam:
        video_sender = pc.addTrack(cam)

    await pc.setRemoteDescription(offer)

    answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)

    return web.Response(
        content_type="application/json",
        headers={
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        text=json.dumps(
            {"sdp": pc.localDescription.sdp, "type": pc.localDescription.type}
        ),
    )

async def options(request):
    return web.Response(
        status=200,
        headers={
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    )


pcs = set()


async def on_shutdown(app):
    # close peer connections
    coros = [pc.close() for pc in pcs]
    await asyncio.gather(*coros)
    pcs.clear()

async def start_background_tasks(app):
    app['check_motion'] = asyncio.create_task(check_motion())

async def cleanup_background_tasks(app):
    app['check_motion'].cancel()
    await app['check motion']

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="WebRTC webcam demo")
    parser.add_argument("--cert-file", help="SSL certificate file (for HTTPS)")
    parser.add_argument("--key-file", help="SSL key file (for HTTPS)")
    parser.add_argument("--play-from", help="Read the media from a file and sent it.")
    parser.add_argument(
        "--play-without-decoding",
        help=(
            "Read the media without decoding it (experimental). "
            "For now it only works with an MPEGTS container with only H.264 video."
        ),
        action="store_true",
    )
    parser.add_argument(
        "--host", default="0.0.0.0", help="Host for HTTP server (default: 0.0.0.0)"
    )
    parser.add_argument(
        "--port", type=int, default=8080, help="Port for HTTP server (default: 8080)"
    )
    parser.add_argument("--verbose", "-v", action="count")
    parser.add_argument(
        "--audio-codec", help="Force a specific audio codec (e.g. audio/opus)"
    )
    parser.add_argument(
        "--video-codec", help="Force a specific video codec (e.g. video/H264)"
    )

    args = parser.parse_args()

    if args.verbose:
        logging.basicConfig(level=logging.DEBUG)
    else:
        logging.basicConfig(level=logging.INFO)

    if args.cert_file:
        ssl_context = ssl.SSLContext()
        ssl_context.load_cert_chain(args.cert_file, args.key_file)
    else:
        ssl_context = None

    app = web.Application()
    app.on_startup.append(start_background_tasks)
    app.on_cleanup.append(cleanup_background_tasks)
    app.on_shutdown.append(on_shutdown)
    # app.router.add_get("/", index)
    # app.router.add_get("/client.js", javascript)
    app.router.add_options("/offer", options)
    app.router.add_post("/offer", offer)
    web.run_app(app, host=args.host, port=args.port, ssl_context=ssl_context)
