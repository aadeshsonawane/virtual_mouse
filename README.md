# 🖱️ AI Virtual Mouse Control System

An AI-powered, gesture-controlled virtual mouse system that tracks your hand movements via webcam using **MediaPipe Hands**, **React (Vite)**, **Socket.IO**, and **Node.js (RobotJS)** to control your computer's OS-level mouse cursor in real-time.

---

## ✨ Features

- ☝️ **Smooth Cursor Movement**: Move your index finger to float the cursor smoothly across the screen (equipped with active bounding box mapping and exponential smoothing).
- 🤏 **Left Click**: Pinch your Index finger and Thumb together.
- 🤙 **Right Click**: Extend your Thumb and Pinky finger.
- ✌️ **Mouse Scroll**: Raise your Index and Middle fingers together and move Up/Down to scroll pages.
- ⚡ **Low-Latency Communication**: Real-time Socket.IO WebSockets bridge between webcam gesture detection and system-level mouse actions.
- 🖥️ **Cross-Platform / Desktop Friendly**: Operates seamlessly in standard browsers and via **Electron** Desktop wrapper.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, MediaPipe Hands (`@mediapipe/hands`), Socket.IO-Client
- **Backend**: Node.js, Express, Socket.IO Server, `@jitsi/robotjs`
- **Desktop Window (Optional)**: Electron 42

---

## 📁 Project Structure

```text
virtual_mouse/
├── client/                   # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── WebcamView.jsx # MediaPipe Tracking & Gesture Detection logic
│   │   ├── App.jsx           # Main React component
│   │   └── main.jsx
│   ├── index.html            # MediaPipe CDN imports & DOM root
│   └── package.json
├── server/                   # Node.js + Express Backend
│   └── index.js              # Socket.IO event listeners & RobotJS mouse triggers
├── electron.js               # Desktop Electron Window configuration
├── preload.js                # Electron IPC bridge
└── package.json              # Root project dependencies & scripts
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- Working Webcam
- Linux / Windows / macOS OS

### 2. Installation

1. **Install Root & Server Dependencies**:
   ```bash
   npm install
   ```

2. **Install Client Dependencies**:
   ```bash
   cd client
   npm install
   cd ..
   ```

---

## 🎮 How to Run

### 🚀 Single Command Launch (Recommended)

Run everything (Backend Server, React Client, and Electron Desktop Window) simultaneously in **a single terminal command**:

```bash
npm start
```
> This automatically starts the backend server on `http://localhost:3001`, boots up the Vite dev server on `http://localhost:5173`, and launches the Electron desktop app seamlessly!

---

### 🛠️ Alternative: Manual Step-by-Step Launch

If you want to run services individually across multiple terminals:

#### Step 1: Start Backend Mouse Server (Terminal 1)
```bash
npm run server
```

#### Step 2: Start Client Dev Server (Terminal 2)
```bash
cd client
npm run dev
```

#### Step 3: Launch Electron Desktop Window (Terminal 3)
```bash
npm run electron
```

---

## 🖐️ Gesture Guide Reference

| Gesture | Action | Description |
| :--- | :--- | :--- |
| ☝️ **Index Finger Up** | **Cursor Move** | Tracks index finger tip and maps active bounds to full screen. |
| 🤏 **Index + Thumb Pinch** | **Left Click** | Hold pinch for 5 frames to trigger OS left click. |
| 🤙 **Thumb + Pinky Out** | **Right Click** | Triggers OS right click context menu. |
| ✌️ **Index + Middle Up** | **Scroll Up / Down** | Move hand up or down to scroll pages. |

---

## 🔧 Troubleshooting Tips

- **Cursor Stuck at Screen Edge**: Ensure `WebcamView.jsx` uses the active mapping bounding range (`normX` / `normY`) to map camera view to `screen.width` and `screen.height`.
- **Status Disconnected**: Ensure `node server/index.js` is running on port `3001`.
- **Browser Background Tab Throttling**: Modern browsers pause camera loops in background tabs. To keep mouse tracking active while switching tabs, **drag the Virtual Mouse tab out into its own separate window (`Move to New Window`)**.
