import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";
import type { Leader } from "../types";

type Props = {
  setPage: (page: string) => void;
  selectedBranch: string;
  isBishopAccess: boolean;
  loggedInLeader: Leader | null;
  setChatUserName: (name: string) => void;
  setChatSenderType: (type: string) => void;
  setChatDepartment: (department: string) => void;
  setChatBackPage: (page: string) => void;
  setAnnouncementDepartment: (department: string) => void;
  setAnnouncementBackPage: (page: string) => void;
};

type Member = { id: number; full_name: string; phone: string; department: string };
type Visit = { id: number; full_name: string; phone: string; visit_order: number; status: string; round_no: number };

const fellowship = "Fellowship";

export default function FellowshipDashboard({
  setPage, selectedBranch, isBishopAccess, loggedInLeader, setChatUserName, setChatSenderType,
  setChatDepartment, setChatBackPage, setAnnouncementDepartment,
  setAnnouncementBackPage,
}: Props) {
  // Leaders use their own assigned branch; bishop department access uses the
  // branch selected before opening the Department Dashboard.
  const branch = isBishopAccess ? selectedBranch : (loggedInLeader?.branch || selectedBranch);
  const [members, setMembers] = useState<Member[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [reportDate, setReportDate] = useState("");
  const [membersPresent, setMembersPresent] = useState("");
  const [offering, setOffering] = useState("");
  const [note, setNote] = useState("");
  const [showRound, setShowRound] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const loadData = async () => {
    if (!branch) return;
    try {
      const [membersResponse, visitsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/members/${encodeURIComponent(branch)}/${fellowship}`),
        fetch(`${API_BASE_URL}/house-visit-queue/${encodeURIComponent(branch)}/${fellowship}`),
      ]);
      const membersData = await membersResponse.json();
      const visitsData = await visitsResponse.json();
      setMembers(membersResponse.ok && Array.isArray(membersData) ? membersData : []);
      setVisits(visitsResponse.ok && Array.isArray(visitsData) ? visitsData : []);
    } catch (error) {
      console.error("Unable to load fellowship data", error);
      setMembers([]);
      setVisits([]);
    }
  };

  useEffect(() => { loadData(); }, [branch]);

  const submitReport = async () => {
    const response = await fetch(`${API_BASE_URL}/home-visit-reports`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ branch, cell_group: fellowship, report_date: reportDate,
        members_present: Number(membersPresent), offering: Number(offering),
        submitted_by: loggedInLeader?.full_name || "Fellowship Leader", note }),
    });
    if (!response.ok) return alert("Failed to submit report.");
    setReportDate(""); setMembersPresent(""); setOffering(""); setNote("");
    alert("Report submitted successfully.");
  };

  const createRound = async () => {
    if (!selectedIds.length) return alert("Select at least one member.");
    const response = await fetch(`${API_BASE_URL}/house-visit-queue/start-round`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ branch, cell_group: fellowship,
        round_no: visits[0]?.round_no ? visits[0].round_no + 1 : 1,
        members: selectedIds.map((member_id, index) => ({ member_id, visit_order: index + 1 })) }),
    });
    if (!response.ok) return alert("Failed to create round.");
    setSelectedIds([]); setShowRound(false); loadData();
  };

  const toggleVisit = async (visit: Visit) => {
    await fetch(`${API_BASE_URL}/house-visit-queue/${visit.id}/status`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: visit.status === "Pending" ? "Visited" : "Pending" }),
    });
    loadData();
  };

  if (!branch) return <div style={pageStyle}>Select a branch before opening the Fellowship Department.</div>;
  return <div style={pageStyle}>
    {showRound && <div style={modalStyle}><div style={modalCardStyle}>
      <h2>Create Next House Visit Round</h2>
      {members.map((member) => <label key={member.id} style={{ display: "block", padding: "8px 0" }}>
        <input type="checkbox" checked={selectedIds.includes(member.id)} onChange={() =>
          setSelectedIds((ids) => ids.includes(member.id) ? ids.filter((id) => id !== member.id) : [...ids, member.id])} /> {member.full_name} — {member.phone}
      </label>)}
      <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
        <button onClick={() => setShowRound(false)}>Cancel</button><button style={primaryButton} onClick={createRound}>Create Round</button>
      </div>
    </div></div>}
    <aside style={sidebarStyle}><h2>{branch}</h2><h3>FELLOWSHIP</h3>
      <p>Dashboard</p><p>Home Visit Report</p><p>Members</p><p>Visit Schedule</p><p>Announcements</p>
      <button style={logoutButton} onClick={() => setPage("cell-group-dashboard")}>← Back</button>
    </aside>
    <main style={{ flex: 1, padding: "30px", overflow: "auto" }}>
      <h1 style={{ marginTop: 0, color: "#1e3a8a" }}>{branch} Fellowship Dashboard</h1>
      <div style={cardGrid}>
        <ActionCard title="Church Group Chat" icon="💬" color="#075e54" onClick={() => {
          setChatUserName(loggedInLeader?.full_name || "Fellowship Leader"); setChatSenderType("Leader");
          setChatDepartment(fellowship); setChatBackPage("fellowship-dashboard"); setPage("group-chat"); }} />
        <ActionCard title="Manage Announcements" icon="📢" color="#0d47a1" onClick={() => {
          setAnnouncementDepartment(fellowship); setAnnouncementBackPage("fellowship-dashboard"); setPage("manage-announcements"); }} />
        <div style={reportStyle}><h3>📋 Home Visit Report</h3>
          <input type="date" value={reportDate} onChange={(e) => setReportDate(e.target.value)} style={inputStyle} />
          <input type="number" placeholder="Members Present" value={membersPresent} onChange={(e) => setMembersPresent(e.target.value)} style={inputStyle} />
          <input type="number" placeholder="Offering" value={offering} onChange={(e) => setOffering(e.target.value)} style={inputStyle} />
          <textarea placeholder="Description / note" value={note} onChange={(e) => setNote(e.target.value)} style={inputStyle} />
          <button style={primaryButton} onClick={submitReport}>Submit Report</button>
        </div>
      </div>
      <section style={tableCard}><h2>Members in {branch} Fellowship</h2><Table headers={["Name", "Phone", "Department"]} rows={members.map((m) => [m.full_name, m.phone, m.department])} /></section>
      <section style={tableCard}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h2>House Visit Queue — Round {visits[0]?.round_no || 1}</h2><button style={primaryButton} onClick={() => setShowRound(true)}>➕ Start Next Round</button></div>
        <Table headers={["Order", "Member", "Phone", "Status"]} rows={visits.map((v) => [String(v.visit_order), v.full_name, v.phone, <button key={v.id} style={v.status === "Pending" ? pendingButton : primaryButton} onClick={() => toggleVisit(v)}>{v.status}</button>])} />
      </section>
    </main>
  </div>;
}

function ActionCard({ title, icon, color, onClick }: { title: string; icon: string; color: string; onClick: () => void }) { return <button onClick={onClick} style={{ background: color, color: "white", border: 0, borderRadius: "12px", padding: "24px", minHeight: "170px", cursor: "pointer", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,.2)" }}><div style={{ fontSize: "40px" }}>{icon}</div><h2>{title}</h2><p>Coordinate fellowship activities.</p></button>; }
function Table({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) { return <table style={{ width: "100%", borderCollapse: "collapse" }}><thead><tr>{headers.map((h) => <th key={h} style={cellStyle}>{h}</th>)}</tr></thead><tbody>{rows.length ? rows.map((row, i) => <tr key={i}>{row.map((value, j) => <td key={j} style={cellStyle}>{value}</td>)}</tr>) : <tr><td colSpan={headers.length} style={cellStyle}>No records yet.</td></tr>}</tbody></table>; }

const pageStyle = { minHeight: "100vh", background: "#f3f4f6", display: "flex", fontFamily: "Arial, sans-serif" };
const sidebarStyle = { width: "230px", background: "#14532d", color: "white", padding: "24px", display: "flex", flexDirection: "column" as const, gap: "12px" };
const cardGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "24px" };
const reportStyle = { background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,.1)" };
const tableCard = { background: "white", borderRadius: "12px", padding: "20px", marginBottom: "24px", overflowX: "auto" as const };
const inputStyle = { width: "100%", boxSizing: "border-box" as const, padding: "10px", marginBottom: "10px", border: "1px solid #d1d5db", borderRadius: "6px" };
const primaryButton = { background: "#16a34a", color: "white", border: "none", padding: "10px 16px", borderRadius: "6px", cursor: "pointer" };
const pendingButton = { ...primaryButton, background: "#ca8a04" };
const logoutButton = { ...primaryButton, marginTop: "auto", background: "#dc2626" };
const cellStyle = { padding: "10px", borderBottom: "1px solid #e5e7eb", textAlign: "left" as const };
const modalStyle = { position: "fixed" as const, inset: 0, background: "rgba(0,0,0,.45)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10 };
const modalCardStyle = { width: "min(600px, 90vw)", maxHeight: "80vh", overflowY: "auto" as const, background: "white", padding: "24px", borderRadius: "12px" };
