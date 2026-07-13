import { API_BASE_URL } from "../config/api";
import { useEffect, useState } from "react";

type CellGroupPageProps = {
  setPage: (page: string) => void;
  memberName: string;
  branch: string;
  cellGroup: string;
};

function CellGroupPage({
  setPage,
  memberName,
  branch,
  cellGroup,
}: CellGroupPageProps) {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [visitQueue, setVisitQueue] = useState<any[]>([]);
  const normalizedBranch = branch.trim().toLowerCase();
  const normalizedCellGroup = cellGroup.trim().toLowerCase();
  const cellGroupAnnouncements = announcements.filter(
    (announcement) =>
      String(announcement.branch || "").trim().toLowerCase() ===
        normalizedBranch &&
      String(announcement.department || "").trim().toLowerCase() ===
        normalizedCellGroup
  );

  useEffect(() => {
    loadAnnouncements();
    loadMembers();
    loadVisitQueue();
  }, [branch, cellGroup]);

 const loadAnnouncements = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/announcements`
    );

    const data = await response.json();

    setAnnouncements(data);
  } catch (err) {
    console.error(err);
  }
};

  const loadMembers = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/members/${branch}/${cellGroup}`
      );

      const data = await response.json();
      setMembers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadVisitQueue = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/house-visit-queue/${branch}/${cellGroup.toUpperCase()}`
      );

      const data = await response.json();
      setVisitQueue(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#eef2ff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: "linear-gradient(90deg,#5b21b6,#7c3aed)",
          color: "white",
          padding: "18px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,.2)",
        }}
      >
        <button
          onClick={() => setPage("members-portal-dashboard")}
          style={{
            background: "white",
            color: "#5b21b6",
            border: "none",
            padding: "10px 22px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: 15,
          }}
        >
          ← Back
        </button>

        <h1
          style={{
            margin: 0,
            fontSize: 30,
          }}
        >
          Cell Group Dashboard
        </h1>

        <div style={{ width: 100 }}></div>
      </div>

      {/* CONTENT */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "30px auto",
          padding: "0 20px",
        }}
      >
        {/* WELCOME CARD */}
        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: 30,
            marginBottom: 30,
            boxShadow: "0 5px 15px rgba(0,0,0,.12)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: "#5b21b6",
              }}
            >
              Welcome, {memberName}
            </h2>

            <p
              style={{
                marginTop: 10,
                color: "#444",
                fontSize: 16,
              }}
            >
              View announcements, members and house visit schedules.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 15,
            }}
          >
            <div
              style={{
                background: "#ede9fe",
                padding: "12px 20px",
                borderRadius: 12,
                textAlign: "center",
                minWidth: 140,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: "#666",
                }}
              >
                Branch
              </div>

              <div
                style={{
                  fontWeight: "bold",
                  color: "#5b21b6",
                  marginTop: 5,
                }}
              >
                {branch}
              </div>
            </div>

            <div
              style={{
                background: "#ede9fe",
                padding: "12px 20px",
                borderRadius: 12,
                textAlign: "center",
                minWidth: 140,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: "#666",
                }}
              >
                Cell Group
              </div>

              <div
                style={{
                  fontWeight: "bold",
                  color: "#5b21b6",
                  marginTop: 5,
                }}
              >
                {cellGroup}
              </div>
            </div>
          </div>
        </div>

        {/* DASHBOARD CONTENT */}
        <div
          style={{
            display: "grid",
            gap: 30,
          }}
        >
          {/* SUMMARY CARDS */}
<div
  style={{
    display: "grid",
   gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 20,
  }}
>
  <div
    style={{
      background: "white",
      borderRadius: 15,
      padding: 25,
      boxShadow: "0 5px 15px rgba(0,0,0,.12)",
      textAlign: "center",
    }}
  >
    <div style={{ fontSize: 35 }}>📢</div>
    <h2 style={{ margin: "10px 0", color: "#5b21b6" }}>
      {cellGroupAnnouncements.length}
    </h2>
    <div style={{ color: "#666" }}>Announcements</div>
  </div>

  <div
    style={{
      background: "white",
      borderRadius: 15,
      padding: 25,
      boxShadow: "0 5px 15px rgba(0,0,0,.12)",
      textAlign: "center",
    }}
  >
    <div style={{ fontSize: 35 }}>👨‍👩‍👧</div>
    <h2 style={{ margin: "10px 0", color: "#5b21b6" }}>
      {members.length}
    </h2>
    <div style={{ color: "#666" }}>Members</div>
  </div>

  <div
    style={{
      background: "white",
      borderRadius: 15,
      padding: 20,
      boxShadow: "0 5px 15px rgba(0,0,0,.12)",
      textAlign: "center",
    }}
  >
    <div style={{ fontSize: 35 }}>🏠</div>
    <h2 style={{ margin: "10px 0", color: "#5b21b6" }}>
      {visitQueue.length}
    </h2>
    <div style={{ color: "#666" }}>House Visits</div>
  </div>

  <div
    style={{
      background: "white",
      borderRadius: 15,
      padding: 20,
      boxShadow: "0 5px 15px rgba(0,0,0,.12)",
      textAlign: "center",
    }}
  >
    <div style={{ fontSize: 35 }}>🔄</div>
    <h2 style={{ margin: "10px 0", color: "#5b21b6" }}>
      {visitQueue[0]?.round_no || 1}
    </h2>
    <div style={{ color: "#666" }}>Current Round</div>
  </div>
</div>
<div
  style={{
    display: "grid",
   gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
    gap: 20,
    alignItems: "start",
  }}
>
                  
          {/* HOUSE VISIT QUEUE */}

<div
  style={{
    background: "white",
    borderRadius: 15,
    overflow: "hidden",
    boxShadow: "0 5px 15px rgba(0,0,0,.12)",
    display: "flex",
    flexDirection: "column",
    minHeight: 500,
  }}
>
  <div
    style={{
      background: "#6d28d9",
      color: "white",
      padding: "15px 20px",
      fontSize: 20,
      fontWeight: "bold",
    }}
  >
    🏠 House Visit Queue (Round {visitQueue[0]?.round_no || 1})
  </div>

  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
    }}
  >
    <thead>
      <tr
        style={{
          background: "#ede9fe",
        }}
      >
        <th style={{ padding: 14 }}>Visit No.</th>
        <th>Member Name</th>
        <th>Status</th>
      </tr>
    </thead>

    <tbody>
      {visitQueue.length === 0 ? (
        <tr>
          <td
            colSpan={3}
            style={{
              textAlign: "center",
              padding: 25,
              color: "#777",
            }}
          >
            No house visit schedule available.
          </td>
        </tr>
      ) : (
        visitQueue.map((visit) => (
          <tr
            key={visit.id}
            style={{
              borderBottom: "1px solid #eee",
            }}
          >
            <td
              style={{
                textAlign: "center",
                padding: 14,
                fontWeight: "bold",
              }}
            >
              {visit.visit_order}
            </td>

            <td>{visit.full_name}</td>

            <td>
              <span
                style={{
                  background:
                    visit.status === "Visited"
                      ? "#22c55e"
                      : "#facc15",
                  color:
                    visit.status === "Visited"
                      ? "white"
                      : "black",
                  padding: "6px 14px",
                  borderRadius: 20,
                  fontWeight: "bold",
                  fontSize: 13,
                  display: "inline-block",
                  minWidth: 90,
                  textAlign: "center",
                }}
              >
                {visit.status}
              </span>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

{/* MEMBERS TABLE */}
{/* MEMBERS */}

<div
  style={{
    background: "white",
    borderRadius: 15,
    overflow: "hidden",
    boxShadow: "0 5px 15px rgba(0,0,0,.12)",
    display: "flex",
    flexDirection: "column",
    minHeight: 500,
  }}
>
  <div
    style={{
      background: "#6d28d9",
      color: "white",
      padding: "15px 20px",
      fontSize: 20,
      fontWeight: "bold",
    }}
  >
    👨‍👩‍👧 Cell Group Members
  </div>

  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
    }}
  >
    <thead>
      <tr
        style={{
          background: "#ede9fe",
        }}
      >
        <th style={{ padding: 14 }}>#</th>
        <th>Full Name</th>
        <th>Phone</th>
        <th>Status</th>
      </tr>
    </thead>

    <tbody>
      {members.length === 0 ? (
        <tr>
          <td
            colSpan={4}
            style={{
              textAlign: "center",
              padding: 25,
              color: "#777",
            }}
          >
            No members found.
          </td>
        </tr>
      ) : (
        members.map((member, index) => (
          <tr
            key={member.id}
            style={{
              borderBottom: "1px solid #eee",
            }}
          >
            <td style={{ padding: 14 }}>{index + 1}</td>

            <td>{member.full_name}</td>

            <td>{member.phone}</td>

            <td>
              <span
                style={{
                  background: "#22c55e",
                  color: "white",
                  padding: "6px 14px",
                  borderRadius: 20,
                  fontWeight: "bold",
                  fontSize: 13,
                }}
              >
                Active
              </span>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

{/* ANNOUNCEMENTS */}

<div
  style={{
    background: "white",
    borderRadius: 15,
    overflow: "hidden",
    boxShadow: "0 5px 15px rgba(0,0,0,.12)",
  }}
>
  <div
    style={{
      background: "#6d28d9",
      color: "white",
      padding: "15px 20px",
      fontSize: 20,
      fontWeight: "bold",
    }}
  >
    📢 Cell Group Announcements
  </div>

  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
    }}
  >
    <thead>
      <tr
        style={{
          background: "#ede9fe",
        }}
      >
        <th style={{ padding: 14 }}>Title</th>
        <th>Message</th>
        <th>Posted By</th>
        <th>Date</th>
      </tr>
    </thead>

    <tbody>
      {cellGroupAnnouncements.length === 0 ? (
        <tr>
          <td
            colSpan={4}
            style={{
              textAlign: "center",
              padding: 25,
              color: "#777",
            }}
          >
            No announcements available.
          </td>
        </tr>
      ) : (
        cellGroupAnnouncements.map((item) => (
          <tr
            key={item.id}
            style={{
              borderBottom: "1px solid #eee",
            }}
          >
            <td style={{ padding: 14 }}>{item.title}</td>

            <td>{item.message}</td>

            <td>{item.posted_by}</td>

            <td>{new Date(item.created_at).toLocaleDateString()}</td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>
         </div>
        </div>
      </div>
    </div>
  );
}

export default CellGroupPage;
