

import type { Leader } from "../types";

type AdministrationDashboardProps = {
  setPage: (page: string) => void;
  loggedInLeader: Leader | null;
  setLoggedInLeader: (leader: Leader | null) => void;
  setChatUserName: (name: string) => void;
  setChatSenderType: (type: string) => void;
  setChatDepartment: (department: string) => void;
  setChatBackPage: (page: string) => void;
};

function AdministrationDashboard({
  setPage,
  loggedInLeader,
  setLoggedInLeader,
  setChatUserName,
  setChatSenderType,
  setChatDepartment,
  setChatBackPage,
}: AdministrationDashboardProps) {
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
        Administration Department
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
          Administration Department
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
          }}
        >
          {/* FINANCE */}
          <div
  onClick={() => {
    setPage("finance-dashboard");
  }}
            style={{
              background: "linear-gradient(180deg,#43a047,#2e7d32)",
              borderRadius: "18px",
              padding: "25px",
              height: "270px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 8px 18px rgba(0,0,0,.35)",
            }}
          >
            <div
              style={{
                fontSize: "55px",
                textAlign: "center",
              }}
            >
              💰
            </div>

            <h2
              style={{
                textAlign: "center",
                margin: 0,
              }}
            >
              FINANCE
            </h2>

            <p
              style={{
                textAlign: "center",
              }}
            >
              Manage church finances and financial records.
            </p>

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
              →
            </button>
          </div>

          {/* SECRETARY */}
          <div
            onClick={() => setPage("secretary-dashboard")}
            style={{
              background: "linear-gradient(180deg,#2563eb,#1e40af)",
              borderRadius: "18px",
              padding: "25px",
              height: "270px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 8px 18px rgba(0,0,0,.35)",
            }}
          >
            <div
              style={{
                fontSize: "55px",
                textAlign: "center",
              }}
            >
              📝
            </div>

            <h2
              style={{
                textAlign: "center",
                margin: 0,
              }}
            >
              SECRETARY
            </h2>

            <p
              style={{
                textAlign: "center",
              }}
            >
              Manage church records, minutes and correspondence.
            </p>

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
              →
            </button>
          </div>

          <div
            onClick={() => {
              setChatUserName(loggedInLeader?.full_name || "Administration Leader");
              setChatSenderType("Leader");
              setChatDepartment("Administration");
              setChatBackPage("administration-dashboard");
              setPage("group-chat");
            }}
            style={{
              background: "linear-gradient(135deg, #075e54, #128C7E)",
              borderRadius: "18px",
              padding: "25px",
              height: "270px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 8px 18px rgba(0,0,0,.35)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "55px" }}>Chat</div>

            <h2 style={{ margin: 0 }}>GROUP CHAT</h2>

            <p>Discuss administration work with this department group.</p>

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

export default AdministrationDashboard;
