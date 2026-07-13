import type { Leader } from "../types";

type SecretaryDashboardProps = {
  selectedBranch: string;
  setPage: (page: string) => void;
  loggedInLeader: Leader | null;
  setChatUserName: (name: string) => void;
  setChatSenderType: (type: string) => void;
  setChatDepartment: (department: string) => void;
  setChatBackPage: (page: string) => void;
  setAnnouncementDepartment: (department: string) => void;
  setAnnouncementBackPage: (page: string) => void;
};

function SecretaryDashboard({
  selectedBranch,
  setPage,
  loggedInLeader,
  setChatUserName,
  setChatSenderType,
  setChatDepartment,
  setChatBackPage,
   setAnnouncementDepartment,
  setAnnouncementBackPage,
}: SecretaryDashboardProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#14532d",
        padding: "30px",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "30px",
        }}
      >
        <h1>
          Secretary Dashboard - {selectedBranch}
        </h1>

        <button
          onClick={() => setPage("leader-login")}
          style={{
            background: "#dc2626",
            color: "white",
            border: "none",
            padding: "12px 25px",
            cursor: "pointer",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: "25px",
        }}
      >
        <div
  onClick={() => {
  setChatUserName(loggedInLeader?.full_name || "Secretary");
  setChatSenderType("Secretary");
  setChatDepartment("Administration");
  setChatBackPage("secretary-dashboard");
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

  <h2 style={{ marginTop: "10px" }}>
    Church Group Chat
  </h2>

  <p>
    Join the church-wide discussion, read announcements and communicate with members.
  </p>
        </div>

        <div
 onClick={() => {
 setAnnouncementDepartment("Administration");
  setAnnouncementBackPage("secretary-dashboard");
  setPage("manage-announcements");
}}
  style={{
    background: "#0d47a1",
    color: "white",
    padding: "30px",
    borderRadius: "12px",
    cursor: "pointer",
    textAlign: "center",
    fontWeight: "bold",
  }}
>
  📢
  <br />
  Manage Announcements
</div>
      </div>
    </div>
  );
}

export default SecretaryDashboard;
