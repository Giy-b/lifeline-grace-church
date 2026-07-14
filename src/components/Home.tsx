import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../config/api";

type Announcement = {
  id: number;
  title: string;
  message: string;
  department: string;
  branch: string;
  posted_by: string;
  created_at: string;
};

type HomeProps = {
  branches: string[];
  homeSection: string;
  setHomeSection: (value: string) => void;
  setSelectedBranch: (value: string) => void;
  setPage: (value: string) => void;
  galleryImages: string[];
  currentImage: number;
  fade: boolean;

  isLive: boolean;
  livePlatform: string;
  liveLink: string;
};
function Home({
  branches,
  homeSection,
  setHomeSection,
  setSelectedBranch,
  setPage,
  galleryImages,
  currentImage,
  fade,
  isLive,
  livePlatform,
  liveLink,
}: HomeProps) {
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/announcements`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setAnnouncements(data);
        }
      } catch (error) {
        setAnnouncements([]);
      }
    };

    loadAnnouncements();
    const interval = setInterval(loadAnnouncements, 10000);

    return () => clearInterval(interval);
  }, []);

  const secretaryAnnouncements = useMemo(
    () =>
      announcements
        .filter(
          (announcement) =>
            String(announcement.department || "").toLowerCase() ===
            "administration"
        )
        .sort((first, second) => {
          const firstTime = new Date(first.created_at).getTime() || first.id;
          const secondTime = new Date(second.created_at).getTime() || second.id;

          return secondTime - firstTime;
        }),
    [announcements]
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
  "linear-gradient(135deg,#4c1d95,#673ab7,#8b5cf6)",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          background: "white",
          color: "black",
        }}
      >
        {/* LEFT SIDE - LOGO */}
        <div
          style={{
            width: "220px",
            background: "#f5f5f5",
            padding: "10px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="/logo.png"
            alt="Church Logo"
            style={{
              width: "120px",
              height: "120px",
              objectFit: "contain",
              display: "block",
              margin: "0 auto",
            }}
          />

          <h2
            style={{
              color: "#14532d",
              marginTop: "10px",
              fontWeight: "bold",
              fontSize: "20px",
              lineHeight: "1.2",
            }}
          >
            LIFELINE GRACE CHURCH
          </h2>
        </div>

        {/* RIGHT SIDE */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
                  {/* SELECT YOUR BRANCH */}
          <div
            style={{
              background: "#000",
              padding: "15px",
            }}
          >
            <div
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: "20px",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              SELECT YOUR BRANCH
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              {branches.map((branch) => (
                <button
                  key={branch}
                  onClick={() => {
                    setSelectedBranch(branch);
                    setPage("branch-dashboard");
                  }}
                  style={{
                    background: "#003b8e",
                    color: "white",
                    border: "none",
                    padding: "10px 18px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {branch.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* MENU */}
          <div
            style={{
              background: "#e5e5e5",
              padding: "18px",
              display: "flex",
              gap: "40px",
              alignItems: "center",
              fontWeight: "bold",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setHomeSection("home")}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              HOME
            </button>

            <button
              onClick={() => setHomeSection("about")}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ABOUT US
            </button>

            <button
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              CONTACT / LOCATION
            </button>

            <button
              onClick={() => setShowAnnouncements((current) => !current)}
              style={{
                background:
                  secretaryAnnouncements.length > 0 ? "#f59e0b" : "#9ca3af",
                color: "#111827",
                border: "none",
                padding: "9px 14px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                animation:
                  secretaryAnnouncements.length > 0
                    ? "blink 1s infinite"
                    : "none",
              }}
            >
              ANNOUNCEMENTS
              {secretaryAnnouncements.length > 0
                ? ` (${secretaryAnnouncements.length})`
                : ""}
            </button>
     {/* LIVE NOTIFICATION */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        {isLive ? (
          <button
  onClick={() => {
    if (!liveLink) {
      alert("No live stream link is available.");
      return;
    }

    window.open(liveLink, "_blank");
  }}
            style={{
  background: "green",
  color: "white",
  border: "none",
  padding: "12px 25px",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer",
  animation: "blink 1s infinite",
}}
          >
            🟢 WE ARE LIVE ON {livePlatform.toUpperCase()}
          </button>
        ) : (
          <button
            style={{
              background: "gray",
              color: "white",
              border: "none",
              padding: "12px 25px",
              borderRadius: "8px",
              fontWeight: "bold",
            }}
          >
            ⚫ OFFLINE
          </button>
        )}
      </div>

          </div>

          {showAnnouncements && (
            <div
              style={{
                background: "#fff7ed",
                color: "#111827",
                borderTop: "1px solid #fed7aa",
                padding: "18px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 12px",
                  color: "#9a3412",
                  fontSize: "18px",
                }}
              >
                Church Secretary Announcements
              </h3>

              {secretaryAnnouncements.length === 0 ? (
                <p style={{ margin: 0 }}>No announcements posted yet.</p>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gap: "12px",
                  }}
                >
                  {secretaryAnnouncements.map((announcement) => (
                    <div
                      key={announcement.id}
                      style={{
                        background: "white",
                        border: "1px solid #fed7aa",
                        borderRadius: "8px",
                        padding: "14px",
                        textAlign: "left",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "12px",
                          alignItems: "flex-start",
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            color: "#111827",
                            fontSize: "16px",
                          }}
                        >
                          {announcement.title}
                        </h4>

                        <span
                          style={{
                            color: "#6b7280",
                            fontSize: "12px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {announcement.branch}
                        </span>
                      </div>

                      <p
                        style={{
                          margin: "8px 0",
                          color: "#374151",
                          lineHeight: 1.45,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {announcement.message}
                      </p>

                      <div
                        style={{
                          color: "#6b7280",
                          fontSize: "12px",
                        }}
                      >
                        Posted by {announcement.posted_by}
                        {announcement.created_at
                          ? ` | ${new Date(
                              announcement.created_at
                            ).toLocaleString()}`
                          : ""}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      
      {/* ABOUT US PAGE */}
{homeSection === "about" && (
        <div
          style={{
            background: "white",
            color: "black",
            maxWidth: "1200px",
            margin: "20px auto",
            padding: "30px",
            borderRadius: "10px",
          }}
        >
          <h1>ABOUT LIFELINE GRACE CHURCH</h1>

          <p>
            WRITE OR PASTE YOUR CHURCH HISTORY HERE.
          </p>

          <p>
            WRITE OR PASTE YOUR CHURCH VISION HERE.
          </p>

          <p>
            WRITE OR PASTE YOUR CHURCH MISSION HERE.
          </p>

          <p>
            WRITE ANY OTHER INFORMATION ABOUT LIFELINE
            GRACE CHURCH HERE.
          </p>
        </div>
      )}

      {homeSection === "home" && (
  <>
          <h2
            style={{
              textAlign: "center",
              marginTop: "20px",
              background: "#003b8e",
              color: "white",
              padding: "15px",
            }}
          >
            Spiritual Integrity Through Excellence in Ministry.
          </h2>

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            {galleryImages.length > 0 ? (
              <img
                src={galleryImages[currentImage]}
                alt="Church Gallery"
                style={{
                  width: "100%",
                  maxWidth: "1200px",
                  height: "650px",
                  objectFit: "contain",
                  borderRadius: "15px",
                  opacity: fade ? 1 : 0,
                  transition: "opacity 1s ease-in-out",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  maxWidth: "1200px",
                  height: "360px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#e5e7eb",
                  color: "#374151",
                  borderRadius: "15px",
                }}
              >
                Church gallery images will appear here.
              </div>
            )}
          </div>          {/* MOTTO & QUOTE */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "20px",
            }}
          >
            <div
              style={{
                flex: 1,
                
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <h3>CHURCH MOTTO</h3>

              <p>
                Spiritual Integrity Through Excellence in Ministry.
              </p>
            </div>

            <div
              style={{
                flex: 1,
              
                padding: "20px",
                borderRadius: "10px",
                textAlign: "right",
              }}
            >
              <h3>EPHESIANS 22:</h3>

              <p>
                “…to equip his people for works of service, so that the body of
                Christ may be built up until we all reach unity in the faith and
                in the knowledge of the Son of God and become mature, attaining
                to the whole measure of the fullness of Christ. Then we will no
                longer be infants, tossed back and forth by the waves, and blown
                here and there by every wind of teaching… Instead, speaking the
                truth in love, we will grow to become in every respect the
                mature body of him who is the head, that is, Christ.”
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
