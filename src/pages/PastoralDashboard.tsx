
import type { Leader } from "../types";

type PastoralDashboardProps = {
  setPage: (page: string) => void;
  loggedInLeader: Leader | null;
  setLoggedInLeader: (leader: Leader | null) => void;
  setChatUserName: (name: string) => void;
  setChatBackPage: (page: string) => void;
  setChatSenderType: (type: string) => void;
  setChatDepartment: (department: string) => void;
};
function PastoralDashboard({
  setPage,
  loggedInLeader,
  setLoggedInLeader,
  setChatUserName,
  setChatBackPage,
  setChatSenderType,
  setChatDepartment,
}: PastoralDashboardProps) {
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
        Pastoral Department
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
          Pastoral Department
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
          }}
        >
          {/* MEMBER VISITATION */}
          <div
            onClick={() => setPage("member-visitation")}
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
              👨‍👩‍👧
            </div>

            <h2
              style={{
                textAlign: "center",
                margin: 0,
              }}
            >
              MEMBER
              <br />
              VISITATION
            </h2>

            <p
              style={{
                textAlign: "center",
              }}
            >
              Record and manage member visitation.
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

          {/* COUNSELLING */}
          <div
            onClick={() => setPage("counselling")}
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
              💬
            </div>

            <h2
              style={{
                textAlign: "center",
                margin: 0,
              }}
            >
              COUNSELLING
            </h2>

            <p
              style={{
                textAlign: "center",
              }}
            >
              Manage counselling sessions.
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

          {/* PRAYER REQUESTS */}
          <div
            onClick={() => setPage("prayer-requests")}
            style={{
              background: "linear-gradient(180deg,#8e24aa,#6a1b9a)",
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
              🙏
            </div>

            <h2
              style={{
                textAlign: "center",
                margin: 0,
              }}
            >
              PRAYER
              <br />
              REQUESTS
            </h2>

            <p
              style={{
                textAlign: "center",
              }}
            >
              Manage prayer requests.
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

          {/* DEDICATION REGISTER */}
          <div
            onClick={() => setPage("baptism-register")}
            style={{
              background: "linear-gradient(180deg,#fb8c00,#ef6c00)",
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
              ✝
            </div>

            <h2
              style={{
                textAlign: "center",
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                fontSize: 23,
                lineHeight: 1.05,
              }}
            >
              <span style={{color:'#0b6b2b',fontWeight:800,letterSpacing:1}}>DEDICATION</span>
              <span style={{color:'#8fd18a',fontWeight:800,letterSpacing:1}}>REGISTER</span>
            </h2>

            <p
              style={{
                textAlign: "center",
              }}
            >
              Register dedications and print certificates.
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

          {/* LEADERS MANAGEMENT */}
          <div
            onClick={() => setPage("leaders-management")}
            style={{
              background: "linear-gradient(180deg,#1565c0,#0d47a1)",
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
              👥
            </div>

            <h2
              style={{
                textAlign: "center",
                margin: 0,
              }}
            >
              LEADERS
              <br />
              MANAGEMENT
            </h2>

            <p
              style={{
                textAlign: "center",
              }}
            >
              Add, update and manage church leaders and their roles.
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
            onClick={() => setPage("members-dashboard")}
            style={{
              background: "linear-gradient(180deg,#8e24aa,#6a1b9a)",
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
            <div style={{ fontSize: "36px", textAlign: "center" }}>Members</div>
            <h2 style={{ textAlign: "center", margin: 0 }}>
              MEMBERS
              <br />
              MANAGEMENT
            </h2>
            <p style={{ textAlign: "center" }}>
              Manage members and the branch gallery.
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
              -&gt;
            </button>
          </div>

          <div
 onClick={() => {
  setChatUserName(loggedInLeader?.full_name || "Pastoral Leader");
  setChatSenderType("Leader");
  setChatDepartment("Pastoral");
  setChatBackPage("pastoral-dashboard");
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

export default PastoralDashboard;
