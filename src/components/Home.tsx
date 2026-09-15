import { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

// Update these details to change the Contact / Location poster on the home page.
const CONTACT_POSTER = {
  address: "We are located in Bungoma town",
  phone: "0726267863",
  email: "lifelgchurch@gmail.com",
  serviceTimes: " Sundays at 8:00 AM -12:00 AM ",
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
  const [aboutDocumentError, setAboutDocumentError] = useState(false);
  const aboutDocumentPages = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (homeSection !== "about" || !aboutDocumentPages.current) return;

    const pagesContainer = aboutDocumentPages.current;
    let cancelled = false;
    GlobalWorkerOptions.workerSrc = pdfWorker;
    pagesContainer.replaceChildren();
    setAboutDocumentError(false);

    const renderDocument = async () => {
      try {
        const document = await getDocument({
          url: "/lifeline-grace-church-about-us.pdf",
        }).promise;

        for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
          if (cancelled) break;

          const page = await document.getPage(pageNumber);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = window.document.createElement("canvas");
          const context = canvas.getContext("2d");

          if (!context) continue;

          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.setAttribute("aria-label", `About Lifeline Grace Church, page ${pageNumber}`);
          canvas.className = "about-document-page";
          pagesContainer.append(canvas);
          await page.render({ canvas, canvasContext: context, viewport }).promise;
        }
      } catch {
        if (!cancelled) setAboutDocumentError(true);
      }
    };

    renderDocument();

    return () => {
      cancelled = true;
      pagesContainer.replaceChildren();
    };
  }, [homeSection]);

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
              onClick={() => setHomeSection("contact")}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              CONTACT / LOCATION
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

        </div>
      </div>

      
      {/* ABOUT US PAGE */}
      {homeSection === "about" && (
        <div className="about-document-frame">
          <div ref={aboutDocumentPages} className="about-document-pages" />
          {aboutDocumentError && (
            <p className="about-document-error">
              We could not load the About Us document.
            </p>
          )}
        </div>
      )}

      {homeSection === "contact" && (
        <section
          style={{
            width: "min(92%, 760px)",
            margin: "36px auto",
            overflow: "hidden",
            borderRadius: "22px",
            background: "#ffffff",
            color: "#172554",
            boxShadow: "0 18px 45px rgba(0, 0, 0, 0.28)",
          }}
        >
          <div
            style={{
              padding: "34px 24px 30px",
              background: "linear-gradient(135deg, #0f766e, #14532d)",
              color: "white",
            }}
          >
            <p style={{ margin: 0, fontSize: "13px", fontWeight: "bold", letterSpacing: "2px" }}>
              YOU ARE WELCOME
            </p>
            <h1 style={{ margin: "10px 0 0", color: "white", fontSize: "clamp(30px, 5vw, 48px)" }}>
              CONTACT & LOCATION
            </h1>
            <p style={{ margin: "12px 0 0", fontSize: "18px" }}>Lifeline Grace Church</p>
          </div>

          <div style={{ padding: "30px 24px 34px", display: "grid", gap: "20px", textAlign: "left" }}>
            <div style={{ borderLeft: "5px solid #0f766e", paddingLeft: "16px" }}>
              <strong style={{ display: "block", color: "#0f766e", marginBottom: "5px" }}>OUR LOCATION</strong>
              <span>{CONTACT_POSTER.address}</span>
            </div>
            <div style={{ borderLeft: "5px solid #65a30d", paddingLeft: "16px" }}>
              <strong style={{ display: "block", color: "#4d7c0f", marginBottom: "5px" }}>CALL / WHATSAPP</strong>
              <span>{CONTACT_POSTER.phone}</span>
            </div>
            <div style={{ borderLeft: "5px solid #2563eb", paddingLeft: "16px" }}>
              <strong style={{ display: "block", color: "#1d4ed8", marginBottom: "5px" }}>EMAIL US</strong>
              <span>{CONTACT_POSTER.email}</span>
            </div>
            <div style={{ borderLeft: "5px solid #7c3aed", paddingLeft: "16px" }}>
              <strong style={{ display: "block", color: "#6d28d9", marginBottom: "5px" }}>SERVICE TIMES</strong>
              <span>{CONTACT_POSTER.serviceTimes}</span>
            </div>
          </div>
        </section>
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
              <h3>EPHESIANS 4:13-15</h3>

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
