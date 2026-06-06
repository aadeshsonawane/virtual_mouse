import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

const WebcamView = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [gesture, setGesture] = useState("None");
  const [connected, setConnected] = useState(false);
  const clickCounter = useRef(0);
  const lastScrollTime = useRef(0);
  const CLICK_FRAMES = 5;
  const SCROLL_DELAY = 150;
  const screenW = window.screen.width;
  const screenH = window.screen.height;

  useEffect(() => {
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
  }, []);

  const fingersUp = (landmarks) => {
    const fingers = [];
    fingers.push(landmarks[4].x < landmarks[3].x ? 1 : 0);
    [8, 12, 16, 20].forEach((tip) => {
      fingers.push(landmarks[tip].y < landmarks[tip - 2].y ? 1 : 0);
    });
    return fingers;
  };

  const getDistance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

  const onResults = (results) => {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0)
      return;

    const landmarks = results.multiHandLandmarks[0];
    const fingers = fingersUp(landmarks);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    landmarks.forEach((lm) => {
      ctx.beginPath();
      ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "#00ff00";
      ctx.fill();
    });

    // ☝️ Index only = MOVE
    if (fingers[1] === 1 && fingers[2] === 0 && fingers[3] === 0) {
      
      const y = Math.round(landmarks[8].y * screenH);
      socket.emit("move-mouse", { x, y });
      setGesture("Moving 🖱️");
    }

    // 🤏 Thumb + Index pinch = LEFT CLICK
    const leftPinch = getDistance(landmarks[4], landmarks[8]);
    if (leftPinch < 0.05) {
      clickCounter.current += 1;
      setGesture(`Left Click soon... ${clickCounter.current}/${CLICK_FRAMES}`);
    } else {
      clickCounter.current = 0;
    }
    if (clickCounter.current === CLICK_FRAMES) {
      socket.emit("click-mouse");
      clickCounter.current = 0;
      setGesture("Left Clicked! 🖱️");
    }

    // 🤙 Thumb + Pinky = RIGHT CLICK
    const rightPinch = getDistance(landmarks[4], landmarks[20]);
    if (fingers[0] === 1 && fingers[4] === 1 &&
        fingers[1] === 0 && fingers[2] === 0 && fingers[3] === 0 &&
        rightPinch < 0.08) {
      socket.emit("right-click");
      setGesture("Right Clicked! 🖱️");
    }

    // ✌️ Index + Middle = SCROLL (throttled)
    if (fingers[1] === 1 && fingers[2] === 1 && fingers[3] === 0) {
      const now = Date.now();
      if (now - lastScrollTime.current > SCROLL_DELAY) {
        if (landmarks[8].y < 0.4) {
          socket.emit("scroll", { direction: "up" });
          setGesture("Scrolling Up ⬆️");
        } else if (landmarks[8].y > 0.6) {
          socket.emit("scroll", { direction: "down" });
          setGesture("Scrolling Down ⬇️");
        }
        lastScrollTime.current = now;
      }
    }
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 640, height: 480 } })
      .then((stream) => {
        videoRef.current.srcObject = stream;

        const hands = new window.Hands({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`,
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.85,
          minTrackingConfidence: 0.85,
        });

        hands.onResults(onResults);

        const camera = new window.Camera(videoRef.current, {
          onFrame: async () => {
            await hands.send({ image: videoRef.current });
          },
          width: 640,
          height: 480,
        });

        camera.start();
      })
      .catch((err) => alert("Webcam error: " + err.message));
  }, []);

  return (
    <div style={{ position: "relative", width: 640, height: 480 }}>
      <video
        ref={videoRef}
        style={{ width: 640, height: 480, transform: "scaleX(-1)" }}
        autoPlay
        muted
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
      <div style={{
        position: "absolute", bottom: 10, left: 10,
        background: "rgba(0,0,0,0.6)",
        color: connected ? "#00ff00" : "#ff0000",
        padding: "8px 16px", borderRadius: 8, fontSize: 18,
      }}>
        {connected ? "🟢 Connected" : "🔴 Disconnected"} | {gesture}
      </div>
    </div>
  );
};

export default WebcamView;