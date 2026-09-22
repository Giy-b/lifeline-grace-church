import { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import "./Home.css";

// Update details to change the Contact / Location details on the home page.
const CONTACT_POSTER = {
  address: "Located in Bungoma Town, Kenya",
  phone: "0726267863",
  email: "lifelgchurch@gmail.com",
  serviceTimes: "Sundays at 8:00 AM - 12:00 PM",
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
          canvas.setAttribute(
            "aria-label",
            `About Lifeline Grace Church, page ${pageNumber}`
          );
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

  const handleLiveClick = () => {
    if (!isLive) return;
    if (!liveLink) {
      alert("No live stream link is currently available.");
      return;
    }
    window.open(liveLink, "_blank");
  };

  return (
    <div className="home-container">
      {/* HEADER: BRAND, BRANCH SELECTOR & NAVIGATION */}
      <header className="home-navbar">
        <div className="navbar-inner">
          <div
            className="brand-section"
            onClick={() => setHomeSection("home")}
          >
            <img
              src="/logo.png"
              alt="Lifeline Grace Church Logo"
              className="brand-logo"
            />
            <div>
              <h1 className="brand-text-title">LIFELINE GRACE CHURCH</h1>
              <div className="brand-text-subtitle">
                CHURCH MANAGEMENT SYSTEM
              </div>
            </div>
          </div>

          <div className="header-main-panel">
            <div className="branch-selector-bar">
              <div className="branch-label">SELECT YOUR BRANCH</div>
              <div className="branch-buttons-container">
                {branches.map((branch) => (
                  <button
                    key={branch}
                    onClick={() => {
                      setSelectedBranch(branch);
                      setPage("branch-dashboard");
                    }}
                    className="branch-pill-btn"
                  >
                    {branch.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <nav className="nav-links">
              <button
                onClick={() => setHomeSection("home")}
                className={`nav-tab-btn ${homeSection === "home" ? "active" : ""}`}
              >
                HOME
              </button>
              <button
                onClick={() => setHomeSection("about")}
                className={`nav-tab-btn ${homeSection === "about" ? "active" : ""}`}
              >
                ABOUT US
              </button>
              <button
                onClick={() => setHomeSection("contact")}
                className={`nav-tab-btn ${homeSection === "contact" ? "active" : ""}`}
              >
                CONTACT / LOCATION
              </button>

              {isLive ? (
                <button
                  onClick={handleLiveClick}
                  className="live-badge is-live"
                  title="Click to join live broadcast"
                >
                  <span className="live-indicator-dot" />
                  WE ARE LIVE ON {livePlatform.toUpperCase() || "AIR"}
                </button>
              ) : (
                <span className="live-badge is-offline">⚫ OFFLINE</span>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* ABOUT US SECTION */}
      {homeSection === "about" && (
        <div className="about-view-container">
          <div className="section-header-center">
            <div className="section-tag">WHO WE ARE</div>
            <h2 className="section-title">About Lifeline Grace Church</h2>
            <p className="section-subtitle">
              Learn about our vision, ministry structure, leadership, and calling.
            </p>
          </div>

          <div className="about-document-frame">
            <div ref={aboutDocumentPages} className="about-document-pages" />
            {aboutDocumentError && (
              <p className="about-document-error">
                ⚠️ Unable to load the About Us document. Please try again later.
              </p>
            )}
          </div>
        </div>
      )}

      {/* CONTACT / LOCATION SECTION */}
      {homeSection === "contact" && (
        <div className="contact-container">
          <div className="contact-header">
            <div className="contact-header-tag">YOU ARE WELCOME</div>
            <h1 className="contact-header-title">Contact & Location</h1>
            <p style={{ margin: 0, opacity: 0.9 }}>
              Lifeline Grace Church Cathedral & Ministry Headquarters
            </p>
          </div>

          <div className="contact-grid">
            <div className="contact-item-card">
              <div className="contact-item-label">📍 OUR LOCATION</div>
              <div className="contact-item-val">{CONTACT_POSTER.address}</div>
            </div>

            <div className="contact-item-card">
              <div className="contact-item-label">📞 CALL / WHATSAPP</div>
              <div className="contact-item-val">{CONTACT_POSTER.phone}</div>
            </div>

            <div className="contact-item-card">
              <div className="contact-item-label">✉️ EMAIL ADDRESS</div>
              <div className="contact-item-val">{CONTACT_POSTER.email}</div>
            </div>

            <div className="contact-item-card">
              <div className="contact-item-label">⏰ SUNDAY SERVICE TIMES</div>
              <div className="contact-item-val">{CONTACT_POSTER.serviceTimes}</div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN HOMEPAGE CONTENT */}
      {homeSection === "home" && (
        <>
          {/* HERO BANNER & GALLERY CAROUSEL */}
          <section className="hero-banner">
            <div className="hero-inner">
              <div className="hero-text-content">
                <div className="hero-pill-tag">
                  ✨ WELCOME TO LIFELINE GRACE CHURCH
                </div>

                <h1 className="hero-title">
                  Spiritual Integrity Through <span>Excellence in Ministry</span>
                </h1>

                <p className="hero-description">
                  Empowering believers, uniting fellowship branches across Kenya, and equipping the saints for divine service and spiritual maturity.
                </p>

              </div>

              {/* GALLERY PHOTO CAROUSEL */}
              <div className="church-location-map">
                <iframe
                  title="Lifeline Grace Church location"
                  src="https://www.google.com/maps?q=Lifeline+Grace+Church,+Cereal+Board,+West+Kenya+College,+Bungoma,+Kenya&z=16&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </section>

          {/* MAIN GALLERY */}
          <section className="main-gallery-section">
            <div className="main-gallery-card">
              {galleryImages.length > 0 ? (
                <>
                  <img
                    src={galleryImages[currentImage]}
                    alt="Church Gallery"
                    className="gallery-image-display"
                    style={{ opacity: fade ? 1 : 0.2 }}
                  />
                </>
              ) : (
                <div className="gallery-placeholder">
                  <div className="gallery-placeholder-icon">⛪</div>
                  <div style={{ fontWeight: 700, color: "#cbd5e1" }}>
                    Lifeline Grace Church Gallery
                  </div>
                  <div style={{ fontSize: "13px", marginTop: "4px" }}>
                    Spiritual Integrity & Fellowship in Action
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* SCRIPTURE & CORE PILLARS */}
          <section className="scripture-pillars-section">
            <div className="scripture-container">
              {/* SCRIPTURE CARD */}
              <div className="scripture-card">
                <div className="scripture-quote-mark">“</div>
                <div className="scripture-heading">SCRIPTURAL ANCHOR</div>
                <h3 className="scripture-reference">EPHESIANS 4:13-15</h3>
                <p className="scripture-text">
                  “…to equip his people for works of service, so that the body of
                  Christ may be built up until we all reach unity in the faith and
                  in the knowledge of the Son of God and become mature, attaining
                  to the whole measure of the fullness of Christ. Instead, speaking the
                  truth in love, we will grow to become in every respect the
                  mature body of him who is the head, that is, Christ.”
                </p>
              </div>

              {/* PILLARS GRID */}
              <div>
                <div style={{ marginBottom: "20px" }}>
                  <div className="section-tag">OUR CORE FOUNDATION</div>
                  <h2 className="section-title" style={{ fontSize: "28px" }}>
                    Church Mission & Pillars
                  </h2>
                </div>

                <div className="pillars-grid">
                  <div className="pillar-item">
                    <div className="pillar-icon">🛡️</div>
                    <h4 className="pillar-title">Spiritual Integrity</h4>
                    <p className="pillar-desc">
                      Upholding godliness, accountability, and truth in every area of ministry.
                    </p>
                  </div>

                  <div className="pillar-item">
                    <div className="pillar-icon">🤝</div>
                    <h4 className="pillar-title">Ministry Excellence</h4>
                    <p className="pillar-desc">
                      Serving the saints with high commitment, diligence, and divine order.
                    </p>
                  </div>

                  <div className="pillar-item">
                    <div className="pillar-icon">🌱</div>
                    <h4 className="pillar-title">Spiritual Growth</h4>
                    <p className="pillar-desc">
                      Equipping every believer to attain the full measure of Christ's maturity.
                    </p>
                  </div>

                  <div className="pillar-item">
                    <div className="pillar-icon">🌐</div>
                    <h4 className="pillar-title">Kingdom Unity</h4>
                    <p className="pillar-desc">
                      Fostering strong fellowship across all local branches and cell communities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SCHEDULE SECTION */}
          <section className="schedule-section">
            <div className="section-header-center">
              <div className="section-tag">WEEKLY GATHERINGS</div>
              <h2 className="section-title">Worship & Service Schedule</h2>
              <p className="section-subtitle">
                Join us for spirit-filled services across our branches and online broadcasts.
              </p>
            </div>

            <div className="schedule-grid">
              <div className="schedule-card highlight">
                <h3 className="schedule-title">Sunday Main Worship</h3>
                <div className="schedule-time">⏰ 8:00 AM – 12:00 PM</div>
                <div className="schedule-location">📍 All Branch Cathedrals & Online</div>
              </div>

              <div className="schedule-card">
                <h3 className="schedule-title">Wednesday Prayer Day</h3>
                <div className="schedule-time">⏰ 5:00 PM – 6:00 PM</div>
                <div className="schedule-location">📍 Midweek Prayer Service</div>
              </div>

            </div>
          </section>
        </>
      )}

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="footer-inner">
          <div>
            <h3 className="footer-brand-title">LIFELINE GRACE CHURCH</h3>
            <p className="footer-brand-desc">
              Spiritual Integrity Through Excellence in Ministry. Building mature disciples and serving communities through love, truth, and faith.
            </p>
          </div>

          <div>
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links-list">
              <li>
                <span className="footer-link-item" onClick={() => setHomeSection("home")}>
                  Home
                </span>
              </li>
              <li>
                <span className="footer-link-item" onClick={() => setHomeSection("about")}>
                  About Us
                </span>
              </li>
              <li>
                <span className="footer-link-item" onClick={() => setHomeSection("contact")}>
                  Contact & Location
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Branches</h4>
            <ul className="footer-links-list">
              {branches.map((b) => (
                <li key={b}>
                  <span
                    className="footer-link-item"
                    onClick={() => {
                      setSelectedBranch(b);
                      setPage("branch-dashboard");
                    }}
                  >
                    {b} Branch
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Contact Us</h4>
            <p className="footer-brand-desc" style={{ fontSize: "13px" }}>
              📍 {CONTACT_POSTER.address}<br />
              📞 {CONTACT_POSTER.phone}<br />
              ✉️ {CONTACT_POSTER.email}
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} Lifeline Grace Church. All rights reserved.
          </div>
          <div className="footer-developer-credit">
            Developed and maintained by <strong>GIY-B Company</strong> — Gideon Barasa, 0798017286
          </div>
          <div>
            Powered by <strong>Church Management System</strong>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
