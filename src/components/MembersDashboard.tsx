import { API_BASE_URL } from "../config/api";
import { useEffect, useMemo, useState } from "react";

type MembersDashboardProps = {
  selectedBranch: string;
  setPage: (page: string) => void;
};

type Member = {
  id: number;
  full_name: string;
  gender: string;
  cell_group: string;
  phone: string;
  department: string;
  username: string;
  password: string;
  branch_id: number;
};

const emptyMember = {
  id: 0,
  full_name: "",
  gender: "",
  cell_group: "",
  phone: "",
  department: "",
  username: "",
  password: "",
  branch_id: 0,
};

const cellGroups = ["Cana", "Bethel", "Samaria", "Shalom"];
const departments = ["Administration", "Cell Group", "Media", "Pastoral", "Youth"];

export default function MembersDashboard({
  selectedBranch,
  setPage,
}: MembersDashboardProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [formMember, setFormMember] = useState<Member>(emptyMember);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof Member>("full_name");

  const loadMembers = async () => {
    const response = await fetch(
      `${API_BASE_URL}/branch-members/${selectedBranch}`
    );
    const data = await response.json();
    setMembers(data);
  };

  useEffect(() => {
    if (selectedBranch) {
      loadMembers();
    }
  }, [selectedBranch]);

  const displayedMembers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return members
      .filter((member) =>
        [
          member.full_name,
          member.phone,
          member.gender,
          member.cell_group,
          member.department,
          member.username,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term)
      )
      .sort((first, second) =>
        String(first[sortBy] || "").localeCompare(String(second[sortBy] || ""))
      );
  }, [members, search, sortBy]);

  const selectMember = (member: Member) => {
    setSelectedMember(member);
    setFormMember(member);
  };

  const updateForm = (field: keyof Member, value: string) => {
    setFormMember((member) => ({
      ...member,
      [field]: value,
    }));
  };

  const updateMember = async () => {
    if (!selectedMember) {
      alert("Select a member first");
      return;
    }

    const response = await fetch(
      `${API_BASE_URL}/members/${selectedMember.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: formMember.full_name,
          gender: formMember.gender,
          cell_group: formMember.cell_group,
          phone: formMember.phone,
          department: formMember.department,
          username: formMember.username,
          password: formMember.password,
        }),
      }
    );

    const data = await response.json();
    alert(data.message || "Member updated");
    await loadMembers();
  };

  const deleteMember = async () => {
    if (!selectedMember) {
      alert("Select a member first");
      return;
    }

    const confirmDelete = window.confirm(
      `Delete ${selectedMember.full_name} from members?`
    );

    if (!confirmDelete) return;

    const response = await fetch(
      `${API_BASE_URL}/members/${selectedMember.id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();
    alert(data.message || "Member deleted");
    setSelectedMember(null);
    setFormMember(emptyMember);
    await loadMembers();
  };

  const uploadBranchGallery = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const formData = new FormData();
    formData.append("branch", selectedBranch);

    Array.from(event.target.files).forEach((file) => {
      formData.append("files", file);
    });

    const response = await fetch(`${API_BASE_URL}/upload-branch-images`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    event.target.value = "";
    alert(data.message);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#14532d",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "#6a1b9a",
          padding: "20px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Members Management</h1>
          <p style={{ margin: "5px 0 0" }}>{selectedBranch} Branch</p>
        </div>

        <button
          onClick={() => setPage("bishop-dashboard")}
          style={{
            background: "#dc2626",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Back
        </button>
      </div>

      <div style={{ padding: "20px" }}>
        <div
          style={{
            display: "flex",
            gap: "15px",
            marginBottom: "15px",
            alignItems: "center",
          }}
        >
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as keyof Member)}
            style={{ padding: "10px", width: "190px" }}
          >
            <option value="full_name">Sort by Name</option>
            <option value="cell_group">Sort by Cell Group</option>
            <option value="department">Sort by Department</option>
            <option value="gender">Sort by Gender</option>
          </select>

          <input
            placeholder="Search member..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ width: "320px", padding: "10px" }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "390px 1fr",
            gap: "0",
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              background: "#eefbe9",
              color: "#111827",
              padding: "20px",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Member Information</h3>

            <label style={labelStyle}>Name</label>
            <input
              value={formMember.full_name}
              onChange={(event) => updateForm("full_name", event.target.value)}
              style={inputStyle}
            />

            <label style={labelStyle}>Phone Number</label>
            <input
              value={formMember.phone}
              onChange={(event) => updateForm("phone", event.target.value)}
              style={inputStyle}
            />

            <label style={labelStyle}>Gender</label>
            <select
              value={formMember.gender}
              onChange={(event) => updateForm("gender", event.target.value)}
              style={inputStyle}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <label style={labelStyle}>Cell Group</label>
            <select
              value={formMember.cell_group}
              onChange={(event) => updateForm("cell_group", event.target.value)}
              style={inputStyle}
            >
              <option value="">Select Cell Group</option>
              {cellGroups.map((cellGroup) => (
                <option key={cellGroup} value={cellGroup}>
                  {cellGroup}
                </option>
              ))}
            </select>

            <label style={labelStyle}>Department</label>
            <select
              value={formMember.department}
              onChange={(event) => updateForm("department", event.target.value)}
              style={inputStyle}
            >
              <option value="">Select Department</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>

            <label style={labelStyle}>Username</label>
            <input
              value={formMember.username}
              onChange={(event) => updateForm("username", event.target.value)}
              style={inputStyle}
            />

            <label style={labelStyle}>Password</label>
            <input
              value={formMember.password}
              onChange={(event) => updateForm("password", event.target.value)}
              style={inputStyle}
            />

            <button
              onClick={updateMember}
              style={{
                width: "100%",
                background: "#003b8e",
                color: "white",
                border: "none",
                height: "52px",
                marginTop: "18px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Update Selected Member
            </button>
          </div>

          <div
            style={{
              background: "#f5f5f5",
              color: "#111827",
              padding: "12px",
              overflowX: "auto",
            }}
          >
            <h3 style={{ textAlign: "center", margin: "4px 0 14px" }}>
              REGISTERED MEMBERS
            </h3>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "white",
                color: "black",
              }}
            >
              <thead style={{ background: "#003b8e", color: "white" }}>
                <tr>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Phone</th>
                  <th style={thStyle}>Gender</th>
                  <th style={thStyle}>Cell Group</th>
                  <th style={thStyle}>Department</th>
                  <th style={thStyle}>Username</th>
                  <th style={thStyle}>Password</th>
                </tr>
              </thead>

              <tbody>
                {displayedMembers.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: "18px", textAlign: "center" }}>
                      No registered members found.
                    </td>
                  </tr>
                ) : (
                  displayedMembers.map((member) => (
                    <tr
                      key={member.id}
                      onClick={() => selectMember(member)}
                      style={{
                        cursor: "pointer",
                        textAlign: "center",
                        background:
                          selectedMember?.id === member.id ? "#dbeafe" : "white",
                      }}
                    >
                      <td style={tdStyle}>{member.id}</td>
                      <td style={tdStyle}>{member.full_name}</td>
                      <td style={tdStyle}>{member.phone}</td>
                      <td style={tdStyle}>{member.gender}</td>
                      <td style={tdStyle}>{member.cell_group}</td>
                      <td style={tdStyle}>{member.department}</td>
                      <td style={tdStyle}>{member.username}</td>
                      <td style={tdStyle}>{member.password}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                gap: "12px",
                marginTop: "16px",
                flexWrap: "wrap",
              }}
            >
              <input
                type="file"
                id="galleryUpload"
                multiple
                accept="image/*"
                style={{ display: "none" }}
                onChange={uploadBranchGallery}
              />

              <button
                onClick={() => document.getElementById("galleryUpload")?.click()}
                style={actionButtonStyle("#003b8e")}
              >
                Upload Branch Gallery
              </button>

              <button
                onClick={() => setPage("manage-branch-gallery")}
                style={actionButtonStyle("#7b1fa2")}
              >
                Manage Branch Gallery
              </button>

              <button onClick={deleteMember} style={actionButtonStyle("#dc2626")}>
                Delete Selected Member
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginTop: "12px",
  marginBottom: "5px",
  fontWeight: 700,
};

const inputStyle = {
  width: "100%",
  height: "44px",
  boxSizing: "border-box" as const,
  padding: "8px 10px",
};

const thStyle = {
  padding: "10px",
  border: "1px solid #ccc",
  whiteSpace: "nowrap" as const,
};

const tdStyle = {
  padding: "10px",
  border: "1px solid #ddd",
  whiteSpace: "nowrap" as const,
};

const actionButtonStyle = (background: string) => ({
  background,
  color: "white",
  border: "none",
  padding: "12px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
});
