import { API_BASE_URL } from "../config/api";
import { useState } from "react";

type MemberLoginProps = {
  selectedBranch: string;
  setPage: (page: string) => void;
  setMemberName: (name: string) => void;
  setLoggedInMember: (member: any) => void;
  isModal?: boolean;
  onCancel?: () => void;
};

export default function MemberLogin({
  selectedBranch,
  setPage,
  setMemberName,
  setLoggedInMember,
  isModal = false,
  onCancel,
}: MemberLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function loginMember() {
    const cleanUsername = username.trim();

    if (!cleanUsername || !password) {
      alert("Please enter your username and password.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/member-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: cleanUsername,
            password,
          }),
        }
      );

      const data = await response.json();

      if (data.message === "Login successful") {
        // Save the complete logged in member
        setLoggedInMember(data);

        // Save member name
        setMemberName(data.full_name);

        // Open member portal
        setPage("members-portal-dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Unable to connect to the server.");
    }
  }

  return (
    <div
      style={{
        minHeight: isModal ? "auto" : "100vh",
        background: isModal ? "transparent" : "#14532d",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "450px",
          background: "white",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 10px 25px rgba(0,0,0,.35)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#0d47a1",
            color: "white",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <h2 style={{ margin: 0 }}>👥 MEMBER LOGIN</h2>

          <p style={{ marginTop: 8 }}>
            {selectedBranch} Branch
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: "30px" }}>
          <label>Username</label>

          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
          />

          <label>Password</label>

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...inputStyle, paddingRight: "70px" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", color: "#0d47a1", cursor: "pointer", fontWeight: "bold" }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            onClick={loginMember}
            style={{
              width: "100%",
              padding: "14px",
              background: "#0d47a1",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
              marginTop: "10px",
            }}
          >
            LOGIN
          </button>

          <div
            style={{
              textAlign: "center",
              marginTop: "18px",
            }}
          >
            <a href="#">Forgot Password?</a>
          </div>

          <hr style={{ margin: "30px 0" }} />

          <div style={{ textAlign: "center" }}>
            <p>New Member?</p>

            <button
              onClick={() => setPage("member-registration")}
              style={{
                background: "#2e7d32",
                color: "white",
                border: "none",
                padding: "12px 25px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              CREATE ACCOUNT
            </button>
          </div>

          <div
            style={{
              marginTop: "25px",
              textAlign: "center",
            }}
          >
            <button
              onClick={() => {
                if (onCancel) {
                  onCancel();
                  return;
                }

                setPage("branch-dashboard");
              }}
              style={{
                background: "#dc2626",
                color: "white",
                border: "none",
                padding: "10px 25px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {isModal ? "CANCEL" : "BACK"}
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
  marginBottom: "20px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  boxSizing: "border-box" as const,
};
