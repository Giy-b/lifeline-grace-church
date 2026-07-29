import { useState } from "react";
import { API_BASE_URL } from "../config/api";
import type { Leader } from "../types";

type Props = { selectedBranch: string; loggedInLeader: Leader | null; setPage: (page: string) => void };
const initial = { service_date: "", adult_attendance: "", sunday_school_attendance: "", main_service_offering: "", sunday_school_offering: "" };

export default function ServiceStatisticsEntry({ selectedBranch, loggedInLeader, setPage }: Props) {
  const [form, setForm] = useState(initial); const [saving, setSaving] = useState(false);
  const change = (key: keyof typeof initial, value: string) => setForm({ ...form, [key]: value });
  const save = async () => {
    if (!form.service_date) return alert("Service date is required.");
    const values = [form.adult_attendance, form.sunday_school_attendance, form.main_service_offering, form.sunday_school_offering].map(Number);
    if (values.some((value) => !Number.isFinite(value) || value < 0)) return alert("Attendance and offering values cannot be negative.");
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/service-statistics`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        ...Object.fromEntries(Object.entries(form).map(([key, value]) => [key, key === "service_date" ? value : Number(value)])),
        branch: selectedBranch, created_by: loggedInLeader?.full_name || "Secretary", actor_role: "secretary", actor_branch: loggedInLeader?.branch || selectedBranch,
      }) });
      const data = await response.json();
      if (!response.ok) return alert(data.detail || "Unable to save service statistics.");
      alert(data.message); setForm(initial);
    } finally { setSaving(false); }
  };
  return <main style={page}><button onClick={() => setPage("secretary-dashboard")} style={back}>← Back</button><section style={panel}><p style={eyebrow}>SERVICE RECORD · {selectedBranch.toUpperCase()}</p><h1 style={{ marginTop: 0 }}>Service Statistics</h1><p style={{ color: "#64748b" }}>Record attendance and offerings after each church service.</p><div style={grid}>
    <Field label="Service Date" type="date" value={form.service_date} onChange={(v) => change("service_date", v)} />
    <Field label="Adult Attendance" value={form.adult_attendance} onChange={(v) => change("adult_attendance", v)} />
    <Field label="Sunday School Attendance" value={form.sunday_school_attendance} onChange={(v) => change("sunday_school_attendance", v)} />
    <Field label="Main Service Offering (KSh)" value={form.main_service_offering} onChange={(v) => change("main_service_offering", v)} />
    <Field label="Sunday School Offering (KSh)" value={form.sunday_school_offering} onChange={(v) => change("sunday_school_offering", v)} />
  </div><div style={{ display: "flex", gap: 12, marginTop: 24 }}><button onClick={save} disabled={saving} style={saveButton}>{saving ? "Saving…" : "Save"}</button><button onClick={() => setForm(initial)} style={clearButton}>Clear</button></div></section></main>;
}
function Field({ label, type = "number", value, onChange }: { label: string; type?: string; value: string; onChange: (value: string) => void }) { return <label style={{ display: "grid", gap: 7, fontWeight: 700 }}>{label}<input type={type} min={type === "number" ? 0 : undefined} step={type === "number" ? "any" : undefined} value={value} onChange={(e) => onChange(e.target.value)} style={input} /></label>; }
const page = { minHeight: "100vh", padding: "36px", background: "linear-gradient(135deg,#edf6ff,#f8fafc)", fontFamily: "Arial, sans-serif" }; const panel = { maxWidth: 760, margin: "0 auto", background: "white", padding: 32, borderRadius: 20, boxShadow: "0 12px 35px rgba(15,23,42,.12)" }; const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 18 }; const input = { padding: 12, border: "1px solid #cbd5e1", borderRadius: 9, fontSize: 16 }; const back = { ...input, background: "#0f3d82", color: "white", border: "none", marginBottom: 20, cursor: "pointer" }; const saveButton = { ...back, marginBottom: 0, background: "#15803d", fontWeight: 700 }; const clearButton = { ...back, marginBottom: 0, background: "#e2e8f0", color: "#0f172a" }; const eyebrow = { color: "#2563eb", fontSize: 12, fontWeight: 800, letterSpacing: 1 };
