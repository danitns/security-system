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

from dotenv import load_dotenv
from supabase import create_client, Client
import uuid

from aiortc.rtcrtpparameters import RTCRtpCodecCapability
from collections import OrderedDict

from gpiozero import MotionSensor, AngularServo
from gpiozero.pins.pigpio import PiGPIOFactory

from aiohttp import web
from aiortc import RTCPeerConnection, RTCSessionDescription
from aiortc.contrib.media import MediaStreamTrack, MediaPlayer, MediaRecorder, MediaRelay

from picamera2 import Picamera2
from fractions import Fraction

load_dotenv()
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
email = os.getenv("SUPABASE_EMAIL")
password = os.getenv("SUPABASE_PASSWORD")
supabase: Client = create_client(url, key)
data = supabase.auth.sign_in_with_password({"email": email, "password": password})
pir = MotionSensor(14)
model = YOLO('yolov8n.pt')
names = model.names

cam = Picamera2()
live_config = cam.create_video_configuration(main={"size": (640, 480)})
capture_config = cam.create_still_configuration(main={"size": (1640, 1232)})
cam.configure(capture_config)

cam.start()
isSomeoneWatching = 0

codec_parameters = OrderedDict(
    [
        ("packetization-mode", "1"),
        ("level-asymmetry-allowed", "1"),
        ("profile-level-id", "42001f"),
    ]
)
pi_capability = RTCRtpCodecCapability(
    mimeType="video/H264", clockRate=90000, channels=None, parameters=codec_parameters
)
preferences = [pi_capability]

factory = PiGPIOFactory()

servo = AngularServo(18, min_pulse_width=0.0006, max_pulse_width=0.0023, pin_factory=factory)

def notifyUser(img_path):
    global supabase
    print("send")
    
    bucket_name = 'imagesurl'
    image_name = f"{uuid.uuid4()}.jpg"
    
    with open(img_path, "rb") as image_file:
        image_data = image_file.read()
        
    response = supabase.storage.from_(bucket_name).upload(path=f'public/{image_name}', file=image_data)
    
    image_url = supabase.storage.from_(bucket_name).get_public_url(image_name)
    
    notification_data = {
            "id": str(uuid.uuid4()), 
            "title": "Someone is at your door",
            "description": "Please check the camera. Someone is at your door right now.",
            "isread": False,
            "imageurl": image_url
        }
    print(notification_data)
    data, count = supabase.table('notifications').insert(notification_data).execute()
    print(data)

async def detect_yolo(frame):
    shouldSend = False;
    img_rgb = cv2.cvtColor(frame, cv2.COLOR_RGBA2RGB)
    results = model(img_rgb, stream=True)
    for result in results:
        for c in result.boxes.cls:
            print(names[int(c)])
            detectedObject = names[int(c)]
            if detectedObject == 'person':
                shouldSend = True
                
    if shouldSend == True:
        current_folder = os.path.dirname(os.path.abspath(__file__))
        image_path = os.path.join(current_folder, f"{uuid.uuid4()}.jpg")
        cv2.imwrite(image_path, frame)
        notifyUser(image_path)
    return shouldSend

    
async def check_motion():
    while True:
        if isSomeoneWatching == 0:
            if pir.motion_detected:
                img = cam.capture_array();
                result = await detect_yolo(img)
                await asyncio.sleep(10)
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

def open_door(request):
    global servo
    servo.angle = 90
    return web.Response(
        content_type="application/json",
        headers={
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        text=json.dumps(
            {"success": True}
        ),
    )

def close_door(request):
    global servo
    servo.angle = -90
    return web.Response(
        content_type="application/json",
        headers={
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        text=json.dumps(
            {"success": True}
        ),
    )

async def offer(request):
    global cam
    global isSomeoneWatching
    params = await request.json()
    offer = RTCSessionDescription(sdp=params["sdp"], type=params["type"])

    pc = RTCPeerConnection()
    pcs.add(pc)

    @pc.on("connectionstatechange")
    async def on_connectionstatechange():
        global isSomeoneWatching
        print("Connection state is %s" % pc.connectionState)
        if pc.connectionState == 'connected':
            isSomeoneWatching += 1
        if pc.connectionState == 'closed':
            isSomeoneWatching -= 1
            if(isSomeoneWatching == 0):
                cam.switch_mode(capture_config)
        if pc.connectionState == "failed":
            await pc.close()
            pcs.discard(pc)

    cam.switch_mode(live_config)
    cam_track = PiCameraTrack()
    mic = MediaPlayer('hw:1,0', format='alsa', options={'channels': '1', 'sample_rate': '44000'})

    @pc.on("track")
    async def on_track(track):
        if track.kind == "audio":
            audio_play = MediaRecorder('hw:0,0', format='alsa', options={'channels': '1', 'sample_rate': '44000'})
            audio_play.addTrack(track)
            await audio_play.start()

    await pc.setRemoteDescription(offer)
    transceivers = pc.getTransceivers()
    for t in transceivers:
        if t.kind == "audio" and mic and mic.audio:
            pc.addTrack(mic.audio)
        if t.kind == "video" and cam_track:
            t.setCodecPreferences(preferences)
            pc.addTrack(cam_track)

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
    coros = [pc.close() for pc in pcs]
    await asyncio.gather(*coros)
    pcs.clear()

async def start_background_tasks(app):
    app['check_motion'] = asyncio.create_task(check_motion())

async def cleanup_background_tasks(app):
    app['check_motion'].cancel()
    await app['check_motion']

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

    app.router.add_options("/offer", options)
    app.router.add_options("/open-door", options)
    app.router.add_options("/close-door", options)
    app.router.add_post("/offer", offer)
    app.router.add_get("/open-door", open_door)
    app.router.add_get("/close-door", close_door)
    web.run_app(app, host=args.host, port=args.port, ssl_context=ssl_context)
