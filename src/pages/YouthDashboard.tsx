import type { Leader } from "../types";

type YouthDashboardProps = {
  setPage: (page: string) => void;
  loggedInLeader: Leader | null;
  setLoggedInLeader: (leader: Leader | null) => void;
  setChatUserName: (name: string) => void;
  setChatSenderType: (type: string) => void;
  setChatDepartment: (department: string) => void;
  setChatBackPage: (page: string) => void;
};

function YouthDashboard({
  setPage,
  loggedInLeader,
  setLoggedInLeader,
  setChatUserName,
  setChatSenderType,
  setChatDepartment,
  setChatBackPage,
}: YouthDashboardProps) {
  const openYouthChat = () => {
    setChatUserName(loggedInLeader?.full_name || "Youth Leader");
    setChatSenderType("Leader");
    setChatDepartment("Youth");
    setChatBackPage("youth-dashboard");
    setPage("group-chat");
  };

  const cardStyle = (background: string) => ({
    background,
    borderRadius: "18px",
    padding: "25px",
    height: "270px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
    boxShadow: "0 8px 18px rgba(0,0,0,.35)",
    textAlign: "center" as const,
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
        cursor: "pointer",
      }}
    >
      &gt;
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
      <h1 style={{ marginBottom: "25px", fontSize: "42px", fontWeight: "bold" }}>
        Youth Department
      </h1>

      <div style={{ background: "#003b8e", borderRadius: "22px", padding: "25px" }}>
        <h2 style={{ marginBottom: "25px", fontSize: "34px" }}>Youth Department</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
          }}
        >
          <div style={cardStyle("linear-gradient(180deg,#2563eb,#1e40af)")}>
            <div style={{ fontSize: "55px" }}>Events</div>
            <h2 style={{ margin: 0 }}>PROGRAMS</h2>
            <p>Plan youth meetings, fellowships and ministry activities.</p>
            {arrowButton}
          </div>

          <div style={cardStyle("linear-gradient(180deg,#43a047,#2e7d32)")}>
            <div style={{ fontSize: "55px" }}>Teams</div>
            <h2 style={{ margin: 0 }}>YOUTH TEAMS</h2>
            <p>Coordinate youth leaders, volunteers and service teams.</p>
            {arrowButton}
          </div>

          <div onClick={openYouthChat} style={cardStyle("linear-gradient(135deg,#075e54,#128C7E)")}>
            <div style={{ fontSize: "55px" }}>Chat</div>
            <h2 style={{ margin: 0 }}>GROUP CHAT</h2>
            <p>Discuss youth ministry work with this department group.</p>
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
          Back
        </button>
      )}
    </div>
  );
}

export default YouthDashboard;
