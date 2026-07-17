import type { Leader } from "../types";

type MediaDashboardProps = {
  setPage: (page: string) => void;
  loggedInLeader: Leader | null;
  setLoggedInLeader: (leader: Leader | null) => void;
  isBishopAccess: boolean;

  setChatUserName: (name: string) => void;
  setChatSenderType: (type: string) => void;
  setChatDepartment: (department: string) => void;
  setChatBackPage: (page: string) => void;
};

function MediaDashboard({
  setPage,
  loggedInLeader,
  setLoggedInLeader,
  setChatUserName,
  setChatSenderType,
  setChatDepartment,
  setChatBackPage,
}: MediaDashboardProps) {
  const cardStyle = (color: string) => ({
    background: color,
    borderRadius: "18px",
    padding: "25px",
    height: "270px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
    boxShadow: "0 8px 18px rgba(0,0,0,.35)",
  });

  const arrowButton = (
    <button
      style={{
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        border: "none",
        margin: "0 auto",
        fontSize: "20px",
      }}
    >
      →
    </button>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#14532d",
        padding: "30px",
        color: "white",
      }}
    >
      <h1
        style={{
          marginBottom: "25px",
          fontSize: "42px",
          fontWeight: "bold",
        }}
      >
        Media Department
      </h1>

      <div
        style={{
          background: "#003b8e",
          borderRadius: "22px",
          padding: "25px",
        }}
      >
        <h2
          style={{
            marginBottom: "25px",
            fontSize: "34px",
          }}
        >
          Media Department
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
          }}
        >
          {/* MEDIA UPLOADS */}
          <div
            onClick={() => setPage("media-library-admin")}
            style={cardStyle("linear-gradient(180deg,#8e24aa,#6a1b9a)")}
          >
            <div style={{ fontSize: "55px", textAlign: "center" }}>🎥</div>

            <h2 style={{ textAlign: "center", margin: 0 }}>
              MEDIA
              <br />
              UPLOADS
            </h2>

            <p style={{ textAlign: "center" }}>
              Upload images and videos for members.
            </p>

            {arrowButton}
          </div>

          {/* LIVE STREAM */}
          <div
            onClick={() => setPage("live-stream")}
            style={cardStyle("linear-gradient(180deg,#1565c0,#0d47a1)")}
          >
            <div style={{ fontSize: "55px", textAlign: "center" }}>📡</div>

            <h2 style={{ textAlign: "center", margin: 0 }}>
              LIVE STREAM
            </h2>

            <p style={{ textAlign: "center" }}>
              Manage live streaming.
            </p>

            {arrowButton}
          </div>

          {/* CHURCH GROUP CHAT */}
          <div
            onClick={() => {
              setChatUserName(loggedInLeader?.full_name || "Media Leader");
              setChatSenderType("Leader");
              setChatDepartment("Media");
              setChatBackPage("media-dashboard");
              setPage("group-chat");
            }}
            style={{
              background: "linear-gradient(135deg, #075e54, #128C7E)",
              color: "white",
              padding: "25px",
              borderRadius: "12px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,.3)",
              transition: "0.3s",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "42px" }}>💬</div>

            <h2 style={{ marginTop: "10px" }}>Church Group Chat</h2>

            <p>
              Join the church-wide discussion, read announcements and communicate
              with members.
            </p>

            {arrowButton}
          </div>
        </div>
      </div>

      {loggedInLeader ? (
        <button
          onClick={() => {
            setLoggedInLeader(null);
            setPage("branch-dashboard");
          }}
          style={{
            marginTop: "25px",
            background: "#dc2626",
            color: "white",
            border: "none",
            padding: "12px 28px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      ) : (
        <button
          onClick={() => setPage("department-dashboard")}
          style={{
            marginTop: "25px",
            background: "#dc2626",
            color: "white",
            border: "none",
            padding: "12px 28px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ← Back
        </button>
      )}
    </div>
  );
}

export default MediaDashboard;
