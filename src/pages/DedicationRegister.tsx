import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";

type DedicationRecord = {
  id: number;
  child_name: string;
  date_of_birth: string;
  dedication_date: string;
  dedication_place: string;
  father_name: string;
  mother_name: string;
  certificate_number: string;
  pastor_name: string;
  branch: string;
};

type Props = { setPage: (page: string) => void; loggedInLeader: { full_name?: string; branch?: string } | null };

const blankRecord = () => ({
  child_name: "",
  date_of_birth: "",
  dedication_date: new Date().toISOString().slice(0, 10),
  dedication_place: "",
  father_name: "",
  mother_name: "",
  certificate_number: "",
});

const fieldPositions: Record<string, React.CSSProperties> = {
  child_name: { left: "34.5%", top: "40.5%", width: "57%", textAlign: "center" },
  date_of_birth: { left: "35.5%", top: "50.5%", width: "20%" },
  dedication_date: { left: "72%", top: "50.5%", width: "21%" },
  dedication_place: { left: "35.5%", top: "58.5%", width: "58%" },
  father_name: { left: "43%", top: "67.5%", width: "50%" },
  mother_name: { left: "43%", top: "77.5%", width: "50%" },
  pastor_name: { left: "43.5%", top: "86.5%", width: "33%" },
  certificate_number: { left: "85.2%", top: "24.2%", width: "12%", textAlign: "center", fontFamily: "Arial, sans-serif" },
};

// The original scanned certificate contains script labels beside the lines.
// These masks leave a clean line-only area for the typed certificate details.
const labelMasks: React.CSSProperties[] = [
  { left: "28%", top: "66%", width: "14.5%", height: "6%", background: "#d9f7fa" },
  { left: "28%", top: "76%", width: "14.5%", height: "6%", background: "#d9f7fa" },
  { left: "28%", top: "84%", width: "15%", height: "6%", background: "#d9f7fa" },
];

function Certificate({ record }: { record: DedicationRecord }) {
  const values = record as unknown as Record<string, string>;
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "820 / 357", background: "url('/dedication-certificate.png') center / 100% 100% no-repeat" }}>
      {labelMasks.map((mask, index) => <span key={index} aria-hidden="true" style={{ position: "absolute", ...mask }} />)}
      {Object.entries(fieldPositions).map(([key, position]) => (
        <span key={key} style={{ position: "absolute", ...position, fontSize: "clamp(6px, 1.65vw, 14px)", lineHeight: 1.1, color: "#111827", fontFamily: "Arial, sans-serif", fontWeight: 600, fontStyle: "normal", letterSpacing: "0.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {values[key]}
        </span>
      ))}
    </div>
  );
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character] as string));
}

export default function DedicationRegister({ setPage, loggedInLeader }: Props) {
  const branch = loggedInLeader?.branch || "Church";
  const pastor = loggedInLeader?.full_name || "Pastoral Leader";
  const [form, setForm] = useState(blankRecord);
  const [records, setRecords] = useState<DedicationRecord[]>([]);
  const [selected, setSelected] = useState<DedicationRecord | null>(null);
  const [saving, setSaving] = useState(false);

  const loadRecords = async () => {
    const response = await fetch(`${API_BASE_URL}/dedication-records/${encodeURIComponent(branch)}`);
    if (response.ok) setRecords(await response.json());
  };

  useEffect(() => { void loadRecords(); }, [branch]);

  const save = async () => {
    if (Object.values(form).some((value) => !value.trim())) return alert("Fill in every certificate field.");
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/dedication-records`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, pastor_name: pastor, branch }),
      });
      if (!response.ok) throw new Error("Save failed");
      setForm(blankRecord());
      await loadRecords();
      alert("Dedication record saved.");
    } catch {
      alert("Unable to save the dedication record. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const printCertificate = (record: DedicationRecord) => {
    setSelected(record);
    const masks = labelMasks.map((mask) => {
      const styles = Object.entries(mask).map(([property, value]) => `${property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}:${value}`).join(";");
      return `<span aria-hidden="true" style="position:absolute;${styles}"></span>`;
    }).join("");
    const fields = Object.entries(fieldPositions).map(([key, position]) => {
      const styles = Object.entries(position).map(([property, value]) => `${property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}:${value}`).join(";");
      return `<span style="position:absolute;${styles};font:600 14px Arial,sans-serif;font-style:normal;letter-spacing:.01em;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#111827">${escapeHtml(record[key as keyof DedicationRecord] as string)}</span>`;
    }).join("");
    const printWindow = window.open("", "_blank", "width=1200,height=650");
    if (!printWindow) return alert("Allow pop-ups to print the certificate.");
    printWindow.document.write(`<!doctype html><html><head><title>Dedication Certificate</title><style>@page{size:landscape;margin:0}html,body{margin:0;width:100%;height:100%}.certificate{position:relative;width:100vw;height:43.5366vw;background:url('${window.location.origin}/dedication-certificate.png') center/100% 100% no-repeat}@media print{.certificate{width:100vw;height:43.5366vw}}</style></head><body><div class="certificate">${masks}${fields}</div><script>window.onload=()=>window.print()</script></body></html>`);
    printWindow.document.close();
  };

  const inputs: Array<[string, keyof typeof form, string]> = [["Child/candidate name", "child_name", "text"], ["Date of birth", "date_of_birth", "date"], ["Dedication date", "dedication_date", "date"], ["Dedication location", "dedication_place", "text"], ["Father’s name", "father_name", "text"], ["Mother’s name", "mother_name", "text"], ["Certificate number", "certificate_number", "text"]];

  return <main style={{ minHeight: "100vh", background: "#f3f4f6", color: "#111827", padding: "28px", boxSizing: "border-box" }}>
    <button onClick={() => setPage("pastoral-dashboard")}>← Back to Pastoral Department</button>
    <h1>Dedication Register</h1>
    <p>Save dedication details, then generate and print the official certificate.</p>
    <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 390px) minmax(0, 1fr)", gap: 24, marginTop: 24 }}>
      <section style={{ background: "white", padding: 22, borderRadius: 10 }}><h2>Add record</h2>
        {inputs.map(([label, key, type]) => <label key={key} style={{ display: "block", margin: "12px 0", fontWeight: 700 }}>{label}<input required type={type} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} style={{ display: "block", width: "100%", padding: 10, marginTop: 5, boxSizing: "border-box" }} /></label>)}
        <label style={{ display: "block", margin: "12px 0", fontWeight: 700 }}>Pastor’s full name<input value={pastor} disabled style={{ display: "block", width: "100%", padding: 10, marginTop: 5, boxSizing: "border-box" }} /></label>
        <button onClick={save} disabled={saving} style={{ padding: "12px 18px", background: "#ef6c00", color: "white", border: 0, borderRadius: 6, fontWeight: 700, cursor: saving ? "wait" : "pointer" }}>{saving ? "Saving…" : "Save record"}</button>
      </section>
      <section style={{ background: "white", padding: 22, borderRadius: 10, overflowX: "auto" }}><h2>Saved dedication records</h2><table style={{ minWidth: 820, width: "100%" }}><thead><tr>{["Child", "D.O.B.", "Dedication date", "Location", "Father", "Mother", "Pastor", "Certificate", ""].map((heading) => <th key={heading} style={{ textAlign: "left", padding: 8 }}>{heading}</th>)}</tr></thead><tbody>{records.map((record) => <tr key={record.id}>{[record.child_name, record.date_of_birth, record.dedication_date, record.dedication_place, record.father_name, record.mother_name, record.pastor_name, record.certificate_number].map((value, index) => <td key={index} style={{ padding: 8 }}>{value}</td>)}<td><button onClick={() => printCertificate(record)}>Generate card</button></td></tr>)}{!records.length && <tr><td colSpan={9} style={{ padding: 8 }}>No saved dedication records.</td></tr>}</tbody></table></section>
    </div>
    {selected && <section style={{ marginTop: 25, maxWidth: 1000 }}><h2>Certificate preview</h2><Certificate record={selected} /><button onClick={() => printCertificate(selected)} style={{ marginTop: 12 }}>Print certificate</button></section>}
  </main>;
}
