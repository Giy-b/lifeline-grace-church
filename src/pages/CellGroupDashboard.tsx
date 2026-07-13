

import type { Leader } from "../types";

type CellGroupDashboardProps = {
  setPage: (page: string) => void;
  loggedInLeader: Leader | null;
  setLoggedInLeader: (leader: Leader | null) => void;
  setChatUserName: (name: string) => void;
  setChatSenderType: (type: string) => void;
  setChatDepartment: (department: string) => void;
  setChatBackPage: (page: string) => void;
};

function CellGroupDashboard({
  setPage,
  loggedInLeader,
  setLoggedInLeader,
  setChatUserName,
  setChatSenderType,
  setChatDepartment,
  setChatBackPage,
}: CellGroupDashboardProps) {
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
        Cell Group Department
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
          Cell Group Department
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
          }}
        >
          {/* CANA */}
<div
  onClick={() => setPage("cana-dashboard")}
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
    🏠
  </div>

  <h2
    style={{
      textAlign: "center",
      margin: 0,
    }}
  >
    CANA
  </h2>

  <p
    style={{
      textAlign: "center",
    }}
  >
    Manage Cana Cell Group activities.
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
      fontWeight: "bold",
    }}
  >
    →
  </button>
</div>

           

          {/* BETHEL */}
          <div
            onClick={() => setPage("bethel-dashboard")}
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
              ✝️
            </div>

            <h2
              style={{
                textAlign: "center",
                margin: 0,
              }}
            >
              BETHEL
            </h2>

            <p
              style={{
                textAlign: "center",
              }}
            >
              Manage Bethel Cell Group activities.
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

          {/* SAMARIA */}
          <div
            onClick={() => setPage("samaria-dashboard")}
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
              🌍
            </div>

            <h2
              style={{
                textAlign: "center",
                margin: 0,
              }}
            >
              SAMARIA
            </h2>

            <p
              style={{
                textAlign: "center",
              }}
            >
              Manage Samaria Cell Group activities.
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

          {/* SHALOM */}
          <div
            onClick={() => setPage("shalom-dashboard")}
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
              🤝
            </div>

            <h2
              style={{
                textAlign: "center",
                margin: 0,
              }}
            >
              SHALOM
            </h2>

            <p
              style={{
                textAlign: "center",
              }}
            >
              Manage Shalom Cell Group activities.
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
              setChatUserName(loggedInLeader?.full_name || "Cell Group Leader");
              setChatSenderType("Leader");
              setChatDepartment("Cell Group");
              setChatBackPage("cell-group-dashboard");
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

            <p>Coordinate cell group work with this department group.</p>

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

export default CellGroupDashboard;
