import { API_BASE_URL } from "../config/api";
import  { useState, useEffect } from "react";
type ShalomDashboardProps = {
  setPage: (page: string) => void;
  loggedInLeader: any;

  setChatUserName: (name: string) => void;
  setChatSenderType: (type: string) => void;
  setChatDepartment: (department: string) => void;
  setChatBackPage: (page: string) => void;
   setAnnouncementDepartment: (department: string) => void;
  setAnnouncementBackPage: (page: string) => void;
};

function ShalomDashboard({
  setPage,
  loggedInLeader,
  setChatUserName,
  setChatSenderType,
  setChatDepartment,
  setChatBackPage,
  setAnnouncementDepartment,
  setAnnouncementBackPage,
}: ShalomDashboardProps) {
  const [showNextRound, setShowNextRound] = useState(false);
  const [visitQueue, setVisitQueue] = useState<any[]>([]);
const [members, setMembers] = useState<any[]>([]);
const [reportDate, setReportDate] = useState("");
const [membersPresent, setMembersPresent] = useState("");
const [offering, setOffering] = useState("");
const [reportNote, setReportNote] = useState("");
const [roundMembers, setRoundMembers] = useState([
  {
    phone: "",
    full_name: "",
    member_id: null,
  },
]);
  const loadHouseVisitQueue = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/house-visit-queue/${loggedInLeader.branch}/SHALOM`
    );

    const data = await response.json();

    setVisitQueue(data);
  } catch (err) {
    console.error(err);
  }
};
useEffect(() => {
  if (loggedInLeader?.branch) {
    loadHouseVisitQueue();
    loadMembers();
  }
}, [loggedInLeader]);
const updateVisitStatus = async (
  id: number,
  currentStatus: string
) => {
  const newStatus =
    currentStatus === "Pending"
      ? "Visited"
      : "Pending";

  try {
    await fetch(
      `${API_BASE_URL}/house-visit-queue/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      }
    );

    loadHouseVisitQueue();

  } catch (error) {
    console.error(error);
  }
};
const loadMembers = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/members/${loggedInLeader.branch}/Shalom`
    );

    const data = await response.json();

    if (response.ok && Array.isArray(data)) {
      setMembers(data);
    } else {
      console.error("Expected an array but got:", data);
      setMembers([]);
    }
  } catch (err) {
    console.error(err);
    setMembers([]);
  }
};
const addRow = () => {
  setRoundMembers([
    ...roundMembers,
    {
      phone: "",
      full_name: "",
      member_id: null,
    },
  ]);
};

const clearRow = (index: number) => {
  const updated = [...roundMembers];

  updated[index] = {
    phone: "",
    full_name: "",
    member_id: null,
  };

  setRoundMembers(updated);
};
const handlePhoneChange = (
  index: number,
  phone: string
) => {

  const updated = [...roundMembers];

  updated[index].phone = phone;

  const found = members.find(
    (m) => m.phone === phone
  );

  if (found) {
    updated[index].full_name = found.full_name;
    updated[index].member_id = found.id;
  } else {
    updated[index].full_name = "";
    updated[index].member_id = null;
  }

  setRoundMembers(updated);
};
const createRound = async () => {
  try {

    const validMembers = roundMembers.filter(
      (member) => member.member_id !== null
    );

    if (validMembers.length === 0) {
      alert("Please enter at least one valid member.");
      return;
    }

    const nextRound =
      visitQueue.length > 0
        ? visitQueue[0].round_no + 1
        : 1;

    const response = await fetch(
      `${API_BASE_URL}/house-visit-queue/start-round`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          branch: loggedInLeader.branch,
          cell_group: "SHALOM",
          round_no: nextRound,
          members: validMembers.map((member, index) => ({
            member_id: member.member_id,
            visit_order: index + 1,
          })),
        }),
      }
    );

    if (!response.ok) {
      alert("Failed to create round.");
      return;
    }

    loadHouseVisitQueue();

    setRoundMembers([
      {
        phone: "",
        full_name: "",
        member_id: null,
      },
    ]);

    setShowNextRound(false);

  } catch (error) {
    console.error(error);
    alert("Error creating round.");
  }
};
const submitReport = async () => {
  const response = await fetch(
    `${API_BASE_URL}/home-visit-reports`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        branch: loggedInLeader.branch,
        cell_group: "SHALOM",
        report_date: reportDate,
        members_present: Number(membersPresent),
        offering: Number(offering),
        submitted_by: loggedInLeader.full_name,
        note: reportNote,
      }),
    }
  );

  if (response.ok) {
    alert("Report submitted successfully.");

    setReportDate("");
    setMembersPresent("");
    setOffering("");
    setReportNote("");
  } else {
    alert("Failed to submit report.");
  }
};
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        display: "flex",
        fontFamily: "Arial, sans-serif",
      }}
    >
    {showNextRound && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.45)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}
  >
    <div
      style={{
        background: "white",
        width: "900px",
        maxHeight: "85vh",
        overflowY: "auto",
        borderRadius: "12px",
        padding: "25px",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>
        Create Next House Visit Round
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr
            style={{
              background: "#f3f4f6",
            }}
          >
            <th
              style={{
                padding: "10px",
                border: "1px solid #ddd",
              }}
            >
              Order
            </th>

            <th
              style={{
                border: "1px solid #ddd",
              }}
            >
              Phone Number
            </th>

            <th
              style={{
                border: "1px solid #ddd",
              }}
            >
              Full Name
            </th>

            <th
              style={{
                border: "1px solid #ddd",
              }}
            >
              Action
            </th>
          </tr>
        </thead>

        <tbody>

          {roundMembers.map((member, index) => (
            <tr key={index}>

              <td
                style={{
                  textAlign: "center",
                  border: "1px solid #ddd",
                  padding: "8px",
                }}
              >
                {index + 1}
              </td>

              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                }}
              >
                <input
                  value={member.phone}
                  placeholder="Enter phone number"
                  onChange={(e) =>
                    handlePhoneChange(index, e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                  }}
                />
              </td>

              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                }}
              >
                {member.full_name || "-"}
              </td>

              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                <button
                  onClick={() => clearRow(index)}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    padding: "6px 14px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Clear
                </button>
              </td>

            </tr>
          ))}

        </tbody>
      </table>

      <button
        onClick={addRow}
        style={{
          marginTop: "15px",
          background: "#2563eb",
          color: "white",
          border: "none",
          padding: "10px 18px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        + Add Member
      </button>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
          marginTop: "25px",
        }}
      >
        <button
          onClick={() => setShowNextRound(false)}
          style={{
            padding: "10px 18px",
          }}
         >
          Cancel
        </button>

        <button
          onClick={createRound}
          style={{
            background: "#16a34a",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Create Round
        </button>
      </div>
    </div>
  </div>
)}
      {/* ================= SIDEBAR ================= */}

      <div
        style={{
          width: "230px",
          background: "#4c1d95",
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2
            style={{
              textAlign: "center",
              marginBottom: "30px",
            }}
          >
            SHALOM
          </h2>

          {[
            "Dashboard",
            "Home Visit Report",
            "Members",
            "Visit Schedule",
            "Announcements",
            "Reports",
            "Settings",
          ].map((item) => (
            <div
              key={item}
              style={{
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "8px",
                cursor: "pointer",
                background:
                  item === "Dashboard"
                    ? "#6d28d9"
                    : "transparent",
              }}
            >
              {item}
            </div>
          ))}
        </div>

        <div>
          

          <button
          onClick={() => setPage("branch-dashboard")}
            style={{
              width: "100%",
              background: "#dc2626",
              color: "white",
              border: "none",
              padding: "12px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
            </div>

     {/* ================= MAIN CONTENT ================= */}

<div
  style={{
    flex: 1,
    padding: "25px",
  }}
>
  {/* TOP SECTION */}

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      gap: "20px",
      alignItems: "start",
      marginBottom: "20px",
    }}
  >
    {/* LEFT SIDE */}

    <div>
      <h1
        style={{
          margin: 0,
          fontSize: "38px",
          color: "#222",
        }}
      >
        Dashboard
      </h1>

      <p
        style={{
          marginTop: "6px",
          marginBottom: "25px",
          color: "#555",
          fontSize: "20px",
        }}
      >
        Welcome back, {loggedInLeader?.full_name}
      </p>

      {/* ACTION CARDS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "18px",
        }}
      >
        {/* CHAT */}

        <div
          onClick={() => {
            setChatUserName(loggedInLeader?.full_name || "SHALOM Leader");
            setChatSenderType("Leader");
            setChatDepartment("SHALOM");
            setChatBackPage("shalom-dashboard");
            setPage("group-chat");
          }}
          style={{
            background: "linear-gradient(135deg,#075e54,#128C7E)",
            color: "white",
            borderRadius: "12px",
            padding: "20px",
            cursor: "pointer",
            minHeight: "180px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: "40px" }}>💬</div>

          <h2>Church Group Chat</h2>

          <p>
            Join church discussions and communicate with members.
          </p>
        </div>

        {/* ANNOUNCEMENTS */}

        <div
          onClick={() => {
            setAnnouncementDepartment("SHALOM");
            setAnnouncementBackPage("shalom-dashboard");
            setPage("manage-announcements");
          }}
          style={{
            background: "#0d47a1",
            color: "white",
            borderRadius: "12px",
            padding: "20px",
            cursor: "pointer",
            minHeight: "180px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: "40px" }}>📢</div>

          <h2>Manage Announcements</h2>

          <p>Create and publish announcements.</p>
        </div>
      </div>
    </div>

    {/* RIGHT SIDE - HOME VISIT REPORT */}

    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,.1)",
      }}
    >
     <h3>📋 Home Visit Report</h3>

<input
  type="date"
  value={reportDate}
  onChange={(e) => setReportDate(e.target.value)}
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
  }}
/>

<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginBottom: "12px",
  }}
>
  <input
    type="number"
    value={membersPresent}
    onChange={(e) => setMembersPresent(e.target.value)}
    placeholder="Members Present"
    style={{
      padding: "10px",
    }}
  />

  <input
    type="number"
    value={offering}
    onChange={(e) => setOffering(e.target.value)}
    placeholder="Offering Collected"
    style={{
      padding: "10px",
    }}
  />
</div>

<textarea
  value={reportNote}
  onChange={(e) => setReportNote(e.target.value)}
  placeholder="Description / note for administrator to investigate if there is a challenge"
  style={{
    width: "100%",
    minHeight: "85px",
    padding: "10px",
    marginBottom: "12px",
    resize: "vertical",
    boxSizing: "border-box",
  }}
/>

<div
  style={{
    display: "flex",
    gap: "10px",
  }}
>
  <button
    onClick={submitReport}
    style={{
      flex: 1,
      background: "#16a34a",
      color: "white",
      border: "none",
      padding: "12px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    ✔ Submit Report
  </button>

  <button
    onClick={() => {
      setReportDate("");
      setMembersPresent("");
      setOffering("");
      setReportNote("");
    }}
    style={{
      width: "120px",
      background: "#e5e7eb",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    Reset
  </button>
</div>
</div>
</div>

  {/* ================= TABLES ================= */}

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
    }}
  >
  {/* MEMBERS TABLE */}

  <div
    style={{
      background: "white",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,.1)",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        background: "#6d28d9",
        color: "white",
        padding: "12px",
        fontWeight: "bold",
      }}
    >
      Members in SHALOM Cell Group
    </div>

    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        color: "#222",
        fontSize: "13px",
      }}
    >
      <thead>
        <tr style={{ background: "#f3f4f6" }}>
          <th style={{ padding: "8px" }}>#</th>
          <th>Full Name</th>
          <th>Phone</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {members.map((member, index) => (
          <tr key={member.id}>
            <td style={{ padding: "8px" }}>{index + 1}</td>
            <td>{member.full_name}</td>
            <td>{member.phone}</td>
            <td style={{ color: "green" }}>Active</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* HOUSE VISIT QUEUE */}

  <div
    style={{
      background: "white",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,.1)",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        background: "#6d28d9",
        color: "white",
        padding: "12px 15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          fontSize: "20px",
        }}
      >
        House Visit Queue - Round {visitQueue[0]?.round_no || 1}
      </div>

      <button
        onClick={() => setShowNextRound(true)}
        style={{
          background: "#22c55e",
          color: "white",
          border: "none",
          padding: "10px 18px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        ➕ Start Next Round
      </button>
    </div>

    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr style={{ background: "#f3f4f6" }}>
          <th>#</th>
          <th>Member Name</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {visitQueue.map((member) => (
          <tr key={member.id}>
            <td
              style={{
                textAlign: "center",
                padding: "10px",
              }}
            >
              {member.visit_order}
            </td>

            <td>{member.full_name}</td>

            <td>
              <button
                onClick={() =>
                  updateVisitStatus(member.id, member.status)
                }
                style={{
                  background:
                    member.status === "Pending"
                      ? "#facc15"
                      : "#22c55e",
                  border: "none",
                  padding: "7px 14px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                {member.status}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

</div>

</div>
);
}

export default ShalomDashboard;
