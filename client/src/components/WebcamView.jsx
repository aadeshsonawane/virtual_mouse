import { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";

const WebcamView = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [gesture, setGesture] = useState("None");

  // Screen size
  const screenW = window.screen.width;
  const screenH = window.screen.height;

  // Click protection
  let clickCounter = useRef(0);
  const CLICK_FRAMES = 5;

  // ── Finger State Check ──────────────────────────
  const fingersUp = (landmarks) => {
    const fingers = [];

    // Thumb
    fingers.push(landmarks[4].x < landmarks[3].x ? 1 : 0);

    // 4 Fingers (index, middle, ring, pinky)
    [8, 12, 16, 20].forEach((tip) => {
      fingers.push(landmarks[tip].y < landmarks[tip - 2].y ? 1 : 0);
    });

    return fingers; // [thumb, index, middle, ring, pinky]
  };

  // ── Distance between 2 points ───────────────────
  const getDistance = (a, b) => {
    return Math.hypot(a.x - b.x, a.y - b.y);
  };

  // ── Main Hand Result Handler ─────────────────────
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

    // ☝️ Only Index up = MOVE
    if (fingers[1] === 1 && fingers[2] === 0) {
      const x = Math.round(landmarks[8].x * screenW);
      const y = Math.round(landmarks[8].y * screenH);
      window.electronAPI.moveMouse(x, y);
      setGesture("Moving 🖱️");
    }

    // 🤏 Pinch = LEFT CLICK
    const pinchDist = getDistance(landmarks[4], landmarks[8]);
    if (pinchDist < 0.05) {
      clickCounter.current += 1;
      setGesture(`Click soon... ${clickCounter.current}/${CLICK_FRAMES}`);
    } else {
      clickCounter.current = 0;
    }

    if (clickCounter.current === CLICK_FRAMES) {
      window.electronAPI.clickMouse();
      clickCounter.current = 0;
      setGesture("Clicked! 🖱️");
    }

    // ✌️ Index + Middle up = SCROL
    if (fingers[1] === 1 && fingers[2] === 1 && fingers[3] === 0) {
      if (landmarks[8].y < 0.4) {
        window.electronAPI.scroll("up");
        setGesture("Scrolling Up ⬆️");
      } else if (landmarks[8].y > 0.6) {
        window.electronAPI.scroll("down");
        setGesture("Scrolling Down ⬇️");
      }
    }
  };

  // ── Setup MediaPipe 
  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.85,
      minTrackingConfidence: 0.85,
    });

    hands.onResults(onResults);

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    camera.start();
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
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: "scaleX(-1)",
        }}
      />

    
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: 10,
          background: "rgba(0,0,0,0.6)",
          color: "#00ff00",
          padding: "8px 16px",
          borderRadius: 8,
          fontSize: 18,
        }}
      >
        Gesture: {gesture}
      </div>
    </div>
  );
};

export default WebcamView;