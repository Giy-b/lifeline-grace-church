import type { LoggedInMember } from "../types";

type MembersPortalDashboardProps = {
  selectedBranch: string;
  memberName: string;
  loggedInMember: LoggedInMember | null;
  setPage: (page: string) => void;
  setChatUserName: (name: string) => void;
  setChatSenderType: (type: string) => void;
  setChatDepartment: (department: string) => void;
  setChatBackPage: (page: string) => void;
};

export default function MembersPortalDashboard({
  selectedBranch,
  memberName,
  loggedInMember,
  setPage,
  setChatUserName,
  setChatSenderType,
  setChatDepartment,
  setChatBackPage,
}: MembersPortalDashboardProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#5b21b6",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: "#003b8e",
          padding: "20px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,.3)",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>👤 Member Dashboard</h1>

          <h3
            style={{
              marginTop: "8px",
              fontWeight: "normal",
            }}
          >
            {selectedBranch} Branch
          </h3>
        </div>

        <button
          onClick={() => setPage("member-login")}
          style={{
            background: "#dc2626",
            color: "green",
            border: "none",
            padding: "12px 25px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>

      {/* WELCOME */}
      <div
        style={{
          padding: "25px",
        }}
      >
        <div
          style={{
            background: "white",
            color: "#003b8e",
            borderRadius: "15px",
            padding: "25px",
            marginBottom: "25px",
            boxShadow: "0 6px 15px rgba(0,0,0,.3)",
          }}
        >
          <h2 style={{ margin: 0 }}>
            Welcome, {memberName}
          </h2>

          <p style={{ marginTop: "10px" }}>
            Welcome to the Church Member Portal.
          </p>
        </div>

        {/* DASHBOARD CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "20px",
          }}
        >
          <Card
            icon="👤"
            title="My Profile"
            description="View and update your personal information."
          />

          <Card
            icon="🏛"
            title="Media, Images & Videos"
            description="Find and download church media."
            onClick={() => setPage("member-media-library")}
          />

      <Card
  icon="👨‍👩‍👧"
  title="Cell Group"
  description="View your cell group information."
  onClick={() => setPage("cell-group-page")}
/>

         


    <Card
  icon="💬"
  title="Church Group Chat"
  description="Chat with members and receive announcements from all departments."
  onClick={() => {
    setChatUserName(memberName);
    setChatSenderType("Member");
    setChatDepartment(loggedInMember?.department || "Member");
    setChatBackPage("members-portal-dashboard");
    setPage("group-chat");
  }}
/>
        </div>
      </div>
    </div>
  );
}

type CardProps = {
  icon: string;
  title: string;
  description: string;
  onClick?: () => void;
};

function Card({
  icon,
  title,
  description,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "linear-gradient(180deg, #23a034bd, #1eaf31)",
        color: "white",
        borderRadius: "18px",
        padding: "25px",
        textAlign: "center",
        boxShadow: "0 6px 15px rgba(0,0,0,.35)",
        cursor: "pointer",
        transition: "0.3s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.03)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <div
        style={{
          fontSize: "55px",
          marginBottom: "15px",
        }}
      >
        {icon}
      </div>

      <h2
        style={{
          margin: "10px 0",
        }}
      >
        {title}
      </h2>

      <p>{description}</p>
    </div>
  );
}
