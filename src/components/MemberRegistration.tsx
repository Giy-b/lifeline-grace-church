import { API_BASE_URL } from "../config/api";
import { useState } from "react";

type MemberRegistrationProps = {
  selectedBranch: string;
  setPage: (page: string) => void;
};

export default function MemberRegistration({
  selectedBranch,
  setPage,
}: MemberRegistrationProps) {
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [cellGroup, setCellGroup] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function registerMember() {
    const cleanUsername = username.trim().toLowerCase();

    if (
      !fullName ||
      !gender ||
      !cellGroup ||
      !phone ||
      !department ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          gender: gender,
          cell_group: cellGroup,
          phone: phone,
          department: department,
          username: cleanUsername,
          password: password,
          branch_id: 1,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          `Registration Successful!\n\nYour username is: ${data.username}\n\nPlease keep it safe.`
        );

        setPage("member-login");
      } else {
        alert(data.detail || data.message || "Registration failed.");
      }
    } catch (error) {
      alert("Unable to connect to the server.");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#14532d",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "700px",
          background: "white",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 10px 25px rgba(0,0,0,.35)",
        }}
      >
        <div
          style={{
            background: "#003b8e",
            color: "white",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <h2 style={{ margin: 0 }}>📝 MEMBER REGISTRATION</h2>
          <p style={{ margin: "8px 0 0" }}>{selectedBranch} Branch</p>
        </div>

        <div style={{ padding: "30px" }}>
          <label>Full Name</label>
          <input
            value={fullName}
            onChange={(e) => {
              const name = e.target.value;
              setFullName(name);

              const firstName = name.trim().split(" ")[0].toLowerCase();
              setUsername(firstName);
            }}
            style={inputStyle}
          />

          <label>Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <label>Cell Group</label>
          <select
            value={cellGroup}
            onChange={(e) => setCellGroup(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select Cell Group</option>
            <option>Cana</option>
            <option>Bethel</option>
            <option>Shallom</option>
            <option>Samaria</option>
          </select>

          <label>Phone Number</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={inputStyle}
          />

          <label>Department</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            style={inputStyle}
          >
            <option value="">Select Department</option>
            <option>Choir</option>
            <option>Youth</option>
            <option>Women Fellowship</option>
            <option>Men Fellowship</option>
            <option>Sunday School</option>
            <option>Media</option>
            <option>Ushers</option>
            <option>Evangelism</option>
          </select>

          <label>Username</label>
          <input value={username} readOnly style={inputStyle} />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={inputStyle}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "30px",
            }}
          >
            <button
              onClick={() => setPage("member-login")}
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
              Back to Login
            </button>

            <button
              onClick={registerMember}
              style={{
                background: "#2e7d32",
                color: "white",
                border: "none",
                padding: "12px 30px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  marginBottom: "18px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  boxSizing: "border-box" as const,
};
