type BishopDashboardProps = {
  selectedBranch: string;
  setPage: (page: string) => void;
  setBishopUsername: (value: string) => void;
  setBishopPassword: (value: string) => void;

  setChatUserName: (name: string) => void;
  setChatSenderType: (type: string) => void;
  setChatDepartment: (department: string) => void;
  setChatBackPage: (page: string) => void;
};

function BishopDashboard({
  selectedBranch,
  setPage,
  setBishopUsername,
  setBishopPassword,
  setChatUserName,
  setChatSenderType,
  setChatDepartment,
  setChatBackPage,
}: BishopDashboardProps) {
  return (
    <div
  style={{
    minHeight: "100vh",
    background: "linear-gradient(180deg,#4b0082,#7e22ce)",
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "25px",
          }}
        >
          <h1 style={{ margin: 0 }}>
            👨‍⚖️ Bishop Dashboard
          </h1>

          <h2
            style={{
              margin: 0,
              color: "#ffffff",
              fontWeight: "normal",
            }}
          >
            {selectedBranch} Branch
          </h2>
        </div>

        <button
          onClick={() => {
            setBishopUsername("");
            setBishopPassword("");
            setPage("branch-dashboard");
          }}
          style={{
            background: "#dc2626",
            color: "white",
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

      {/* DASHBOARD CONTENT */}
      <div
        style={{
          padding: "25px",
        }}
      >
        {/* DASHBOARD CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5,1fr)",
            gap: "18px",
          }}
        >
          {/* LEADERS */}
          <div
            onClick={() => setPage("leaders-management")}
            style={{
              background: "linear-gradient(180deg,#1565c0,#0d47a1)",
              borderRadius: "18px",
              padding: "20px",
              color: "white",
              height: "250px",
              cursor: "pointer",
              boxShadow: "0 6px 15px rgba(0,0,0,.35)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontSize: 55, textAlign: "center" }}>👥</div>

            <h3 style={{ textAlign: "center", margin: 0 }}>
              LEADERS
              <br />
              MANAGEMENT
            </h3>

            <p style={{ textAlign: "center", fontSize: 14 }}>
              Add, update and manage church leaders and their roles.
            </p>

            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "rgba(255,255,255,.25)",
                margin: "0 auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 20,
              }}
            >
              →
            </div>
          </div>

          {/* DEPARTMENTS */}
          <div
            onClick={() => setPage("department-dashboard")}
            style={{
              background: "linear-gradient(180deg,#43a047,#2e7d32)",
              borderRadius: "18px",
              padding: "20px",
              color: "white",
              height: "250px",
              cursor: "pointer",
              boxShadow: "0 6px 15px rgba(0,0,0,.35)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontSize: 55, textAlign: "center" }}>🏛</div>

            <h3 style={{ textAlign: "center", margin: 0 }}>
              DEPARTMENTS
              <br />
              MANAGEMENT
            </h3>

            <p style={{ textAlign: "center", fontSize: 14 }}>
              Create departments and assign ministry leaders.
            </p>

            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "rgba(255,255,255,.25)",
                margin: "0 auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 20,
              }}
            >
              →
            </div>
          </div>
{/* MEMBERS */}
<div
  onClick={() => setPage("members-dashboard")}
  style={{
    background: "linear-gradient(180deg,#8e24aa,#6a1b9a)",
    borderRadius: "18px",
    padding: "20px",
    color: "white",
    height: "250px",
    cursor: "pointer",
    boxShadow: "0 6px 15px rgba(0,0,0,.35)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  }}
>
  <div style={{ fontSize: 55, textAlign: "center" }}>👨‍👩‍👧</div>

  <h3 style={{ textAlign: "center", margin: 0 }}>
    MEMBERS
    <br />
    MANAGEMENT
  </h3>

  <p style={{ textAlign: "center", fontSize: 14 }}>
    Register and manage all church members.
  </p>

  <div
    style={{
      width: 38,
      height: 38,
      borderRadius: "50%",
      background: "rgba(255,255,255,.25)",
      margin: "0 auto",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: 20,
    }}
  >
    →
  </div>
</div>

          {/* CHURCH OVERSIGHT */}
          <div
  onClick={() => setPage("church-oversight")}
            style={{
              background: "linear-gradient(180deg,#fb8c00,#ef6c00)",
              borderRadius: "18px",
              padding: "20px",
              color: "white",
              height: "250px",
              cursor: "pointer",
              boxShadow: "0 6px 15px rgba(0,0,0,.35)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontSize: 55, textAlign: "center" }}>📢</div>

            <h3 style={{ textAlign: "center", margin: 0 }}>
              CHURCH
              <br />
              OVERSIGHT &
              <br />
              ANNOUNCEMENTS
            </h3>

            <p style={{ textAlign: "center", fontSize: 14 }}>
              Monitor church activities and publish announcements.
            </p>

            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "rgba(255,255,255,.25)",
                margin: "0 auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 20,
              }}
            >
              →
            </div>
          </div>

         <div
  onClick={() => {
  setChatUserName("Bishop");
  setChatSenderType("Bishop");
  setChatDepartment("Bishop");
  setChatBackPage("bishop-dashboard");
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

            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "rgba(255,255,255,.25)",
                margin: "0 auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 20,
              }}
            >
              →
            </div>
          </div>
        </div>

        {/* DASHBOARD IMAGE */}
        <div
          style={{
            marginTop: "5px",
          }}
        >
   <img
  src="/bishop-dashboard.jpg"
            alt="Church"
            style={{
              width: "100%",
              height: "800px",
              objectFit: "contain",
              borderRadius: "20px",
              display: "block",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default BishopDashboard;
