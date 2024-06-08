import { Box, Button, Container, Heading, Icon } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { IoIosPlayCircle } from "react-icons/io";

const CameraPage = () => {
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [config, setConfig] = useState<RTCConfiguration>({
    sdpSemantics: "undefined-plan",
  } as RTCConfiguration);
  const videoRef = useRef<HTMLVideoElement>(null);

  const addTrack = (evt) => {
    if (evt.track.kind === "video") {
      if (videoRef.current) {
        videoRef.current.srcObject = evt.streams[0];
      }
    }
  };

  useEffect(() => {
    if (!pc) return;

    pc.addEventListener("track", addTrack);
    negotiate();

    return () => {
      if (pc) {
        pc.getSenders().forEach((sender) => {
          if (pc.signalingState !== "closed") {
            pc.removeTrack(sender);
          }
        });
        pc.close();
        pc.removeEventListener("track", addTrack);
      }
    };
  }, [pc]);

  const negotiate = async () => {
    if (!pc) return;

    try {
      await pc.addTransceiver("video", { direction: "recvonly" });
      await pc.addTransceiver("audio");

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      await new Promise((resolve: any) => {
        if (pc.iceGatheringState === "complete") {
          resolve();
        } else {
          const checkState = () => {
            if (pc.iceGatheringState === "complete") {
              pc.removeEventListener("icegatheringstatechange", checkState);
              resolve();
            }
          };
          pc.addEventListener("icegatheringstatechange", checkState);
        }
      });

      const response = await fetch("http://192.168.79.237:8080/offer", {
        body: JSON.stringify({
          sdp: pc.localDescription?.sdp,
          type: pc.localDescription?.type,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        mode: "cors",
      });

      const answer = await response.json();
      await pc.setRemoteDescription(answer);
    } catch (error) {
      stopStream();
      alert(error);
    }
  };

  const openDoor = async () => {
    const response = await fetch("http://192.168.79.237:8080/open-door", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
      mode: "cors",
    });
  };

  const closeDoor = async () => {
    const response = await fetch("http://192.168.79.237:8080/close-door", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
      mode: "cors",
    });
  };

  const startStream = async () => {
    let newPc = pc;
    if (!newPc) {
      newPc = new RTCPeerConnection(config);
      setPc(newPc);
    }
    setIsPlaying(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });
      stream.getTracks().forEach((track) => newPc.addTrack(track, stream));
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  };

  const stopStream = () => {
    if (pc) {
      pc.getSenders().forEach((sender) => {
        if (pc.signalingState !== "closed") {
          pc.removeTrack(sender);
        }
      });
      pc.getReceivers().forEach((receiver) => {
        receiver.track.stop();
      });
      pc.close();
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    setPc(null);
    setIsPlaying(false);
  };
  return (
    <Box>
      <Heading>Live camera</Heading>
      <Box
        maxW={"640px"}
        w={"100%"}
        maxH={"640px"}
        h={"100%"}
        position={"relative"}
      >
        {isPlaying ? (
          <Button onClick={stopStream}>Stop</Button>
        ) : (
          <div>
            <Icon
              zIndex={1000}
              onClick={startStream}
              className="buttonhover"
              position={"absolute"}
              as={IoIosPlayCircle}
              color={"white"}
              w={"80px"}
              height={"80px"}
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            ></Icon>
          </div>
        )}
        <video
          ref={videoRef}
          autoPlay={true}
          playsInline={true}
          className="live-video"
        ></video>
      </Box>
      <Button onClick={openDoor}>Open</Button>
      <Button onClick={closeDoor}>Close</Button>
    </Box>
  );
};

export default CameraPage;
