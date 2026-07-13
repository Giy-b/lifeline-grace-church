import { API_BASE_URL } from "../config/api";
import { useState } from "react";

type LiveStreamProps = {
  setPage: (page: string) => void;
  setIsLive: (live: boolean) => void;
  setLivePlatform: (platform: string) => void;
  setLiveLink: (link: string) => void;
  selectedBranch: string;
  loggedInLeader: any;
};
function LiveStream({
  setPage,
  setIsLive,
  setLivePlatform,
  setLiveLink,
  selectedBranch,
  loggedInLeader,
}: LiveStreamProps) {
  const [selectedPlatform, setSelectedPlatform] = useState("");
const [streamLink, setStreamLink] = useState("");
  const openPlatform = (platform: string) => {
    setSelectedPlatform(platform);

    if (platform === "YouTube") {
      window.open("https://studio.youtube.com", "_blank");
    } else {
      window.open("https://www.facebook.com/live", "_blank");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        padding: "40px",
      }}
    >
      <h1>📡 Live Stream</h1>

      <h3>Select Platform</h3>

      <div
        style={{
          display: "flex",
          gap: "25px",
          marginTop: "30px",
        }}
      >
        <div
          onClick={() => openPlatform("YouTube")}
          style={{
            flex: 1,
            background: "#ff0000",
            color: "white",
            padding: "40px",
            borderRadius: "12px",
            cursor: "pointer",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "60px" }}>▶</div>

          <h2>YouTube Live</h2>

          <p>Open YouTube Studio</p>
        </div>

        <div
          onClick={() => openPlatform("Facebook")}
          style={{
            flex: 1,
            background: "#1877f2",
            color: "white",
            padding: "40px",
            borderRadius: "12px",
            cursor: "pointer",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "60px" }}>📘</div>

          <h2>Facebook Live</h2>

          <p>Open Facebook Live</p>
        </div>
      </div>

      {selectedPlatform && (
        <div
          style={{
            marginTop: "50px",
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <h2>Did you start streaming on {selectedPlatform}?</h2>
   <input
  type="text"
  placeholder="Paste your live stream link here"
  value={streamLink}
  onChange={(e) => setStreamLink(e.target.value)}
  style={{
    width: "100%",
    padding: "12px",
    marginTop: "20px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  }}
/>
        <button
  onClick={async () => {
    if (!streamLink.trim()) {
      alert("Paste your live stream link first");
      return;
    }

    setIsLive(true);
    setLivePlatform(selectedPlatform);
    setLiveLink(streamLink);

    await fetch(`${API_BASE_URL}/media-library/live-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        branch: selectedBranch,
        platform: selectedPlatform,
        link: streamLink,
        uploaded_by: loggedInLeader?.full_name || "Media Leader",
      }),
    });

    alert("Church is now LIVE and the link has been saved for members!");
  }}
  style={{
    background: "green",
    color: "white",
    border: "none",
    padding: "15px 35px",
    fontSize: "18px",
    borderRadius: "8px",
    cursor: "pointer",
    marginRight: "15px",
  }}
>
  🟢 WE ARE LIVE
</button>

    <button
  onClick={() => {
    setIsLive(false);
    setLivePlatform("");
    setLiveLink("");
    setSelectedPlatform("");
  }}
  style={{
    background: "red",
    color: "white",
    border: "none",
    padding: "15px 35px",
    fontSize: "18px",
    borderRadius: "8px",
    cursor: "pointer",
  }}
>
  🔴 CANCEL
</button>
        </div>
      )}

      <button
        onClick={() => setPage("media-dashboard")}
        style={{
          marginTop: "40px",
          padding: "12px 25px",
        }}
      >
        ← Back
      </button>
    </div>
  );
}

export default LiveStream;
