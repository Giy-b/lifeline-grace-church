import { API_BASE_URL } from "../config/api";
import { useEffect, useState } from "react";

type MediaItem = {
  id: number;
  title: string;
  media_type: string;
  file_name?: string;
  file_path?: string;
  media_url?: string;
  uploaded_by?: string;
  created_at: string;
};

type MediaLibraryProps = {
  selectedBranch: string;
  setPage: (page: string) => void;
  backPage: string;
  mode: "admin" | "member";
  loggedInLeader?: any;
};

const API_URL = API_BASE_URL;

function MediaLibrary({
  selectedBranch,
  setPage,
  backPage,
  mode,
  loggedInLeader,
}: MediaLibraryProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const loadMedia = async () => {
    const response = await fetch(`${API_URL}/media-library/${selectedBranch}`);
    const data = await response.json();

    setMediaItems(data);
  };

  useEffect(() => {
    if (selectedBranch) {
      loadMedia();
    }
  }, [selectedBranch]);

  const uploadMedia = async () => {
    if (!title.trim()) {
      alert("Enter media title");
      return;
    }

    if (!files || files.length === 0) {
      alert("Select images or videos");
      return;
    }

    const formData = new FormData();
    formData.append("branch", selectedBranch);
    formData.append("title", title);
    formData.append("uploaded_by", loggedInLeader?.full_name || "Media Leader");

    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/media-library/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      alert(data.message);
      setTitle("");
      setFiles(null);
      await loadMedia();
    } finally {
      setLoading(false);
    }
  };

  const deleteMedia = async (mediaId: number) => {
    await fetch(`${API_URL}/media-library/${mediaId}`, {
      method: "DELETE",
    });

    await loadMedia();
  };

  const fileUrl = (item: MediaItem) =>
    item.file_path ? `${API_URL}/uploads/${item.file_path}` : item.media_url || "";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        color: "#111827",
        padding: "30px",
      }}
    >
      <button
        onClick={() => setPage(backPage)}
        style={{
          background: "#003b8e",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "20px",
          fontWeight: "bold",
        }}
      >
        ← Back
      </button>

      <h1 style={{ marginTop: 0 }}>
        {mode === "admin" ? "Media Uploads" : "Media, Images & Videos"}
      </h1>

      {mode === "admin" && (
        <div
          style={{
            background: "white",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "25px",
            boxShadow: "0 4px 12px rgba(0,0,0,.08)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Upload Images or Videos</h2>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Media title"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginBottom: "12px",
              boxSizing: "border-box",
            }}
          />

          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={(e) => setFiles(e.target.files)}
            style={{ marginBottom: "15px" }}
          />

          <br />

          <button
            onClick={uploadMedia}
            disabled={loading}
            style={{
              background: "#16a34a",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {loading ? "Uploading..." : "Upload Media"}
          </button>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: "18px",
        }}
      >
        {mediaItems.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "8px",
              padding: "25px",
              color: "#4b5563",
            }}
          >
            No media has been uploaded yet.
          </div>
        ) : (
          mediaItems.map((item) => {
            const url = fileUrl(item);

            return (
              <div
                key={item.id}
                style={{
                  background: "white",
                  borderRadius: "8px",
                  padding: "16px",
                  boxShadow: "0 4px 12px rgba(0,0,0,.08)",
                }}
              >
                {item.media_type === "image" && (
                  <img
                    src={url}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                )}

                {item.media_type === "video" && (
                  <video
                    src={url}
                    controls
                    style={{
                      width: "100%",
                      height: "180px",
                      background: "black",
                      borderRadius: "8px",
                    }}
                  />
                )}

                {item.media_type === "live" && (
                  <div
                    style={{
                      height: "180px",
                      borderRadius: "8px",
                      background: "#fee2e2",
                      color: "#991b1b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "20px",
                    }}
                  >
                    Live Stream Link
                  </div>
                )}

                <h2 style={{ marginBottom: "8px" }}>{item.title}</h2>

                <p style={{ color: "#4b5563", marginTop: 0 }}>
                  Uploaded by {item.uploaded_by || "Media Department"}
                </p>

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: "#003b8e",
                      color: "white",
                      textDecoration: "none",
                      padding: "9px 14px",
                      borderRadius: "8px",
                      fontWeight: "bold",
                    }}
                  >
                    Watch / View
                  </a>

                  {item.media_type !== "live" && (
                    <a
                      href={url}
                      download={item.file_name}
                      style={{
                        background: "#16a34a",
                        color: "white",
                        textDecoration: "none",
                        padding: "9px 14px",
                        borderRadius: "8px",
                        fontWeight: "bold",
                      }}
                    >
                      Download
                    </a>
                  )}

                  {mode === "admin" && (
                    <button
                      onClick={() => deleteMedia(item.id)}
                      style={{
                        background: "#dc2626",
                        color: "white",
                        border: "none",
                        padding: "9px 14px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default MediaLibrary;
