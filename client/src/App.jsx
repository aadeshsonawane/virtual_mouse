import WebcamView from "./components/WebcamView";

function App() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      background: "#1a1a1a",
      minHeight: "100vh",
      padding: 20
    }}>
      <h1 style={{ color: "#00ff00", marginBottom: 20 }}>
        🖱️ Virtual Mouse
      </h1>

      <WebcamView />

      {/* Gesture Guide */}
      <div style={{
        marginTop: 20,
        background: "#2a2a2a",
        borderRadius: 12,
        padding: 16,
        color: "white",
        width: 640
      }}>
        <h3 style={{ color: "#00ff00" }}>Gesture Guide</h3>
        <p>☝️ Index finger up → Mouse Move</p>
        <p>🤏 Pinch (Thumb + Index) → Left Click</p>
        <p>✌️ Two fingers up → Scroll</p>
      </div>
    </div>
  );
}

export default App;