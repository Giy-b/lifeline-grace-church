import { useMemo, useState } from "react";

type PastoralPageType =
  | "member-visitation"
  | "counselling"
  | "prayer-requests"
  | "baptism-register";

type PastoralRecord = {
  id: number;
  memberName: string;
  phone: string;
  date: string;
  status: string;
  notes: string;
  assignedTo: string;
};

type PastoralRecordsPageProps = {
  pageType: PastoralPageType;
  setPage: (page: string) => void;
  loggedInLeader: any;
};

const pageConfig = {
  "member-visitation": {
    title: "Member Visitation",
    subtitle: "Plan visits, record outcomes, and follow up with members.",
    nameLabel: "Member Name",
    phoneLabel: "Phone Number",
    dateLabel: "Visit Date",
    notesLabel: "Visit Notes",
    statusOptions: ["Pending", "Visited", "Follow Up"],
    assignedLabel: "Assigned Pastor",
    accent: "#2563eb",
    gradient: "linear-gradient(180deg,#2563eb,#1e40af)",
    emptyText: "No visitation records yet.",
  },
  counselling: {
    title: "Counselling",
    subtitle: "Manage counselling appointments and pastoral care notes.",
    nameLabel: "Member Name",
    phoneLabel: "Phone Number",
    dateLabel: "Session Date",
    notesLabel: "Counselling Notes",
    statusOptions: ["Pending", "Scheduled", "Completed"],
    assignedLabel: "Counsellor",
    accent: "#2e7d32",
    gradient: "linear-gradient(180deg,#43a047,#2e7d32)",
    emptyText: "No counselling sessions yet.",
  },
  "prayer-requests": {
    title: "Prayer Requests",
    subtitle: "Track prayer needs, care assignments, and answered requests.",
    nameLabel: "Requester Name",
    phoneLabel: "Phone Number",
    dateLabel: "Request Date",
    notesLabel: "Prayer Request",
    statusOptions: ["Pending", "Praying", "Answered"],
    assignedLabel: "Prayer Lead",
    accent: "#7e22ce",
    gradient: "linear-gradient(180deg,#8e24aa,#6a1b9a)",
    emptyText: "No prayer requests yet.",
  },
  "baptism-register": {
    title: "Baptism Register",
    subtitle: "Register baptism candidates and completion status.",
    nameLabel: "Candidate Name",
    phoneLabel: "Phone Number",
    dateLabel: "Baptism Date",
    notesLabel: "Baptism Notes",
    statusOptions: ["Pending", "Prepared", "Baptized"],
    assignedLabel: "Officiating Pastor",
    accent: "#ef6c00",
    gradient: "linear-gradient(180deg,#fb8c00,#ef6c00)",
    emptyText: "No baptism records yet.",
  },
};

const fieldStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  boxSizing: "border-box" as const,
};

function PastoralRecordsPage({
  pageType,
  setPage,
  loggedInLeader,
}: PastoralRecordsPageProps) {
  const config = pageConfig[pageType];
  const today = new Date().toISOString().split("T")[0];
  const leaderName = loggedInLeader?.full_name || "Pastoral Leader";

  const [records, setRecords] = useState<PastoralRecord[]>([]);
  const [memberName, setMemberName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState(today);
  const [status, setStatus] = useState(config.statusOptions[0]);
  const [assignedTo, setAssignedTo] = useState(leaderName);
  const [notes, setNotes] = useState("");
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredRecords = useMemo(() => {
    const search = searchText.toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        record.memberName.toLowerCase().includes(search) ||
        record.phone.toLowerCase().includes(search) ||
        record.assignedTo.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || record.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [records, searchText, statusFilter]);

  const pendingCount = records.filter((record) =>
    record.status.toLowerCase().includes("pending")
  ).length;

  const completedCount = records.length - pendingCount;

  const resetForm = () => {
    setMemberName("");
    setPhone("");
    setDate(today);
    setStatus(config.statusOptions[0]);
    setAssignedTo(leaderName);
    setNotes("");
  };

  const saveRecord = () => {
    if (!memberName.trim()) {
      alert(`Enter ${config.nameLabel.toLowerCase()}`);
      return;
    }

    setRecords((currentRecords) => [
      {
        id: Date.now(),
        memberName: memberName.trim(),
        phone: phone.trim(),
        date,
        status,
        assignedTo: assignedTo.trim() || leaderName,
        notes: notes.trim(),
      },
      ...currentRecords,
    ]);

    resetForm();
  };

  const removeRecord = (recordId: number) => {
    setRecords((currentRecords) =>
      currentRecords.filter((record) => record.id !== recordId)
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        color: "#111827",
      }}
    >
      <div
        style={{
          background: config.gradient,
          color: "white",
          padding: "28px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <button
            onClick={() => setPage("pastoral-dashboard")}
            style={{
              border: "1px solid rgba(255,255,255,.55)",
              background: "rgba(255,255,255,.16)",
              color: "white",
              padding: "9px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              marginBottom: "18px",
              fontWeight: "bold",
            }}
          >
            Back
          </button>

          <h1
            style={{
              margin: 0,
              fontSize: "38px",
              fontWeight: "bold",
            }}
          >
            {config.title}
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              fontSize: "16px",
              opacity: 0.9,
            }}
          >
            {config.subtitle}
          </p>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,.16)",
            borderRadius: "8px",
            padding: "16px 20px",
            minWidth: "190px",
          }}
        >
          <p style={{ margin: 0, opacity: 0.8 }}>Branch</p>
          <h2 style={{ margin: "5px 0 0", fontSize: "24px" }}>
            {loggedInLeader?.branch || "Church"}
          </h2>
        </div>
      </div>

      <div
        style={{
          padding: "28px 30px",
          display: "grid",
          gridTemplateColumns: "minmax(280px,380px) 1fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "8px",
            padding: "22px",
            boxShadow: "0 4px 12px rgba(0,0,0,.08)",
          }}
        >
          <h2
            style={{
              margin: "0 0 18px",
              color: config.accent,
            }}
          >
            Add Record
          </h2>

          <div style={{ display: "grid", gap: "13px" }}>
            <label>
              <strong>{config.nameLabel}</strong>
              <input
                value={memberName}
                onChange={(event) => setMemberName(event.target.value)}
                style={{ ...fieldStyle, marginTop: "6px" }}
              />
            </label>

            <label>
              <strong>{config.phoneLabel}</strong>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                style={{ ...fieldStyle, marginTop: "6px" }}
              />
            </label>

            <label>
              <strong>{config.dateLabel}</strong>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                style={{ ...fieldStyle, marginTop: "6px" }}
              />
            </label>

            <label>
              <strong>Status</strong>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                style={{ ...fieldStyle, marginTop: "6px" }}
              >
                {config.statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <strong>{config.assignedLabel}</strong>
              <input
                value={assignedTo}
                onChange={(event) => setAssignedTo(event.target.value)}
                style={{ ...fieldStyle, marginTop: "6px" }}
              />
            </label>

            <label>
              <strong>{config.notesLabel}</strong>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={5}
                style={{
                  ...fieldStyle,
                  marginTop: "6px",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
            </label>

            <button
              onClick={saveRecord}
              style={{
                background: config.accent,
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "14px",
                fontSize: "16px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Save Record
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gap: "18px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))",
              gap: "14px",
            }}
          >
            {[
              ["Total Records", records.length],
              ["Pending", pendingCount],
              ["Completed", completedCount],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  background: "white",
                  borderRadius: "8px",
                  padding: "18px",
                  boxShadow: "0 4px 12px rgba(0,0,0,.08)",
                  borderTop: `4px solid ${config.accent}`,
                }}
              >
                <p style={{ margin: 0, color: "#6b7280" }}>{label}</p>
                <h2 style={{ margin: "8px 0 0", fontSize: "30px" }}>
                  {value}
                </h2>
              </div>
            ))}
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0,0,0,.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginBottom: "16px",
                flexWrap: "wrap",
              }}
            >
              <input
                placeholder="Search records"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                style={{
                  ...fieldStyle,
                  width: "min(100%, 320px)",
                }}
              />

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                style={{
                  ...fieldStyle,
                  width: "190px",
                }}
              >
                <option value="All">All Statuses</option>
                {config.statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "760px",
                }}
              >
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    {[
                      "Name",
                      "Phone",
                      "Date",
                      "Status",
                      config.assignedLabel,
                      "Notes",
                      "Action",
                    ].map((heading) => (
                      <th
                        key={heading}
                        style={{
                          textAlign: "left",
                          padding: "12px",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        style={{
                          padding: "24px",
                          textAlign: "center",
                          color: "#6b7280",
                        }}
                      >
                        {config.emptyText}
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((record) => (
                      <tr key={record.id}>
                        <td style={{ padding: "12px" }}>
                          {record.memberName}
                        </td>
                        <td style={{ padding: "12px" }}>{record.phone}</td>
                        <td style={{ padding: "12px" }}>{record.date}</td>
                        <td style={{ padding: "12px" }}>
                          <span
                            style={{
                              background: "#eef2ff",
                              color: config.accent,
                              borderRadius: "999px",
                              padding: "6px 10px",
                              fontWeight: "bold",
                              fontSize: "13px",
                            }}
                          >
                            {record.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px" }}>
                          {record.assignedTo}
                        </td>
                        <td style={{ padding: "12px", maxWidth: "260px" }}>
                          {record.notes || "-"}
                        </td>
                        <td style={{ padding: "12px" }}>
                          <button
                            onClick={() => removeRecord(record.id)}
                            style={{
                              background: "#dc2626",
                              color: "white",
                              border: "none",
                              borderRadius: "8px",
                              padding: "8px 12px",
                              cursor: "pointer",
                              fontWeight: "bold",
                            }}
                          >
                            Delete
                          </button>
                        </td>
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

export default PastoralRecordsPage;
