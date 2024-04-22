import { Button, Heading } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

const CameraPage = () => {
  const [pc, setPc] = useState<RTCPeerConnection | null>(null);
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
        pc.close();
      }
      pc.removeEventListener("track", addTrack);
    };
  }, [pc]);

  const negotiate = async () => {
    if (!pc) return;

    try {
      await pc.addTransceiver("video", { direction: "recvonly" });
      await pc.addTransceiver("audio", { direction: "recvonly" });

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

      const response = await fetch("http://192.168.1.150:8080/offer", {
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
      alert(error);
    }
  };

  const startStream = () => {
    const newPc = new RTCPeerConnection(config);
    setPc(newPc);
  };

  const stopStream = () => {
    if (pc) {
      pc.close();
    }
  };
  return (
    <div>
      <Heading>Media</Heading>
      <Button onClick={startStream}>Start</Button>
      <Button onClick={stopStream}>Stop</Button>

      <video ref={videoRef} autoPlay={true} playsInline={true}></video>
    </div>
  );
};

export default CameraPage;
