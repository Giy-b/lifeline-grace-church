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

type Props = {
  setPage: (page: string) => void;
  loggedInLeader: {
    full_name?: string;
    branch?: string;
  } | null;
};

const blankRecord = () => ({
  child_name: "",
  date_of_birth: "",
  dedication_date: new Date().toISOString().slice(0, 10),
  dedication_place: "",
  father_name: "",
  mother_name: "",
  certificate_number: "",
});

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      }[character] as string)
  );

// ---------- Field icons (plain inline SVG so the same markup works both in
// the React preview and in the raw HTML print window) ----------
const ICON_SVG: Record<"user" | "calendar" | "pin", string> = {
  user: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
};

const certificateCss = `
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    background:#ffffff;
    font-family:Arial,Helvetica,sans-serif;
}

.certificate{
    width:100%;
    background:#fff;
    border:8px solid #5b168b;
    padding:8px;
}

.certificate-inner{
    border:3px solid #5b168b;
    padding:4px;
}

.certificate-inner2{
    border:1px solid #7d3db3;
}

.certificate-layout{
    display:grid;
    grid-template-columns:265px 1fr;
    min-height:760px;
}

/* ================= LEFT PANEL ================= */

.certificate-side{
    position:relative;
    overflow:hidden;
    background:linear-gradient(135deg,#6f1bb5 0%,#8d2ed6 35%,#7a24bd 70%,#5f1795 100%);
    border-right:2px solid #5b168b;
    display:flex;
    flex-direction:column;
    align-items:center;
    padding:26px 18px;
}

.certificate-side::before{
    content:"";
    position:absolute;
    width:520px;
    height:980px;
    left:-275px;
    top:-100px;
    background:white;
    border-radius:260px;
    box-shadow:
        inset -14px 0 rgba(161,108,230,.45);
}

.certificate-logo{
    position:relative;
    z-index:2;
    width:150px;
    margin-top:110px;
    margin-bottom:20px;
}

.scripture-heading{
    position:relative;
    z-index:2;
    color:#5b168b;
    font-size:20px;
    font-weight:900;
    text-align:center;
}

.side-divider{
    position:relative;
    z-index:2;
    width:92%;
    display:flex;
    align-items:center;
    margin:20px 0;
    color:#7b2cbf;
}

.side-divider::before,
.side-divider::after{
    content:"";
    flex:1;
    height:2px;
    background:#7b2cbf;
}

.side-divider::before{
    margin-right:10px;
}

.side-divider::after{
    margin-left:10px;
}

.scripture{
    position:relative;
    z-index:2;
    width:100%;
    border:2px dashed #8f5fd1;
    border-radius:14px;
    padding:18px;
    text-align:center;
    color:#3826a3;
    background:rgba(255,255,255,.45);
    font-style:italic;
    line-height:1.8;
    font-size:16px;
}

/* ================= RIGHT SIDE ================= */

.certificate-main{
    padding:24px 34px 28px;
    background:white;
}

.certificate-header{
    display:grid;
    grid-template-columns:1fr auto;
    align-items:flex-start;
    gap:20px;
}

/* ================= CHURCH NAME ================= */

.church-name{
    width:100%;
    text-align:center;
    font-size:74px;
    font-weight:900;
    line-height:.95;
    letter-spacing:2px;
    text-transform:uppercase;
}

.lifeline{
    color:#00AF50;
}

.grace{
    color:#92D050;
}

.certificate-no{
    min-width:145px;
    border:2px solid #333;
    padding:10px;
    text-align:center;
    margin-top:18px;
}

.certificate-no small{
    display:block;
    font-size:13px;
    font-weight:800;
}

.certificate-no strong{
    display:block;
    margin-top:8px;
    font-size:28px;
}

/* ================= HEADER DIVIDER ================= */

.header-divider{
    display:flex;
    align-items:center;
    color:#6b1fb2;
    margin:12px 0;
}

.header-divider::before,
.header-divider::after{
    content:"";
    flex:1;
    height:2px;
    background:#7b2cbf;
}

.header-divider::before{
    margin-right:10px;
}

.header-divider::after{
    margin-left:10px;
}

.motto{
    text-align:center;
    font-size:20px;
    color:#0d49b5;
    font-weight:900;
    text-transform:uppercase;
}

.address{
    text-align:center;
    font-size:18px;
    font-weight:800;
    margin-top:8px;
    margin-bottom:40px;
}

/* ================= TITLE ================= */

.certificate-title{
    text-align:center;
    color:#0d49b5;
    font-size:58px;
    font-style:italic;
    font-weight:900;
    text-decoration:underline;
    margin-bottom:25px;
}

.certificate-subtitle{
    text-align:center;
    font-size:22px;
    margin-bottom:42px;
}

/* ================= FIELDS ================= */

.fields{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:34px 42px;
}

.field{
    display:flex;
    align-items:flex-start;
    gap:18px;
}

.field-icon{
    width:56px;
    height:56px;
    border:2px solid #7a2fc1;
    border-radius:10px;
    display:flex;
    justify-content:center;
    align-items:center;
    color:#6f22ba;
}

.field-body{
    flex:1;
    border-bottom:2px solid #8d5ccc;
    padding-bottom:12px;
}

.field-body small{
    display:block;
    font-size:18px;
    color:#333;
    text-transform:uppercase;
}

.field-body strong{
    display:block;
    margin-top:10px;
    font-size:28px;
}

/* ================= SIGNATURE ================= */

.signatures{
    display:grid;
    grid-template-columns:1fr 1px 1fr;
    gap:40px;
    margin-top:70px;
}

.signature{
    text-align:center;
}

.sig-line{
    border-bottom:3px solid #222;
    min-height:38px;
    margin-bottom:10px;
}

.signature strong{
    font-size:28px;
}

.signature small{
    display:block;
    font-size:18px;
    margin-top:8px;
}

.sig-divider{
    background:#7a2fc1;
}

@media print{

@page{
    size:A4 landscape;
    margin:8mm;
}

html,
body{
    width:100%;
    height:100%;
    margin:0 !important;
    padding:0 !important;
    background:#fff !important;
    -webkit-print-color-adjust:exact;
    print-color-adjust:exact;
}

body{
    margin:0;
}

.certificate{
    /* The preview is designed at 1200px wide.  Keep that exact layout and
       scale the complete card once so it fits on one A4 landscape sheet. */
    width:1200px;
    zoom:.885;
    break-inside:avoid;
    page-break-inside:avoid;
    border-width:6px;
}

.certificate-layout{
    min-height:0;
}

.certificate-side{
    padding:18px 14px;
}

.certificate-logo{
    width:128px;
    margin-top:58px;
    margin-bottom:12px;
}

.scripture-heading{ font-size:17px; }
.side-divider{ margin:12px 0; }
.scripture{ padding:12px; font-size:13px; line-height:1.55; }

.certificate-main{ padding:16px 26px 18px; }
.church-name{ font-size:58px; }
.certificate-no{ margin-top:8px; padding:7px; }
.certificate-no strong{ margin-top:4px; font-size:23px; }
.header-divider{ margin:8px 0; }
.motto{ font-size:17px; }
.address{ font-size:15px; margin-top:5px; margin-bottom:20px; }
.certificate-title{ font-size:46px; margin-bottom:14px; }
.certificate-subtitle{ font-size:18px; margin-bottom:22px; }

.fields{ gap:18px 30px; }
.field{ gap:12px; }
.field-icon{ width:44px; height:44px; }
.field-body{ padding-bottom:7px; }
.field-body small{ font-size:14px; }
.field-body strong{ margin-top:5px; font-size:22px; }

.signatures{ gap:30px; margin-top:30px; }
.sig-line{ min-height:28px; margin-bottom:6px; }
.signature strong{ font-size:22px; }
.signature small{ font-size:14px; margin-top:4px; }

}
`;
function ChurchName() {
  return (
    <div className="church-name">
      <span className="lifeline">LIFELINE</span>{" "}
      <span className="grace">GRACE CHURCH</span>
    </div>
  );
}
function Certificate({ record }: { record: DedicationRecord }) {
  const Field = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: string;
    icon: keyof typeof ICON_SVG;
  }) => (
    <div className="field">
      <div
        className="field-icon"
        dangerouslySetInnerHTML={{ __html: ICON_SVG[icon] }}
      />
      <div className="field-body">
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </div>
  );

  return (
    <article className="certificate">
      <div className="certificate-inner">
        <div className="certificate-inner2">
          <div className="certificate-layout">

            {/* ================= LEFT PANEL ================= */}

            <aside className="certificate-side">

              <img
                src="/logo.png"
                alt="Lifeline Grace Church"
                className="certificate-logo"
              />

              <div className="scripture-heading">
                EPHESIANS 4:13–15
              </div>

              <div className="side-divider">
                ✦
              </div>

              <div className="scripture">

                For You formed my inward parts;
                You covered me in my mother's womb.

                <br /><br />

                I will praise You, for I am fearfully
                and wonderfully made.
                Marvelous are Your works,
                and that my soul knows very well.

                <br /><br />

                <strong>Psalm 139 : 13–14</strong>

              </div>

            </aside>

            {/* ================= RIGHT SIDE ================= */}

            <main className="certificate-main">

              <header className="certificate-header">

                <div style={{ width: "100%" }}>

                  <ChurchName />

                </div>

                <div className="certificate-no">
                  <small>CERTIFICATE NO.</small>
                  <strong>{record.certificate_number}</strong>
                </div>

              </header>

              <div className="header-divider">
                ✦
              </div>

              <div className="motto">
                SPIRITUAL INTEGRITY THROUGH EXCELLENCE IN MINISTRY
              </div>

              <div className="address">
                P.O BOX 722 – 50200
              </div>

              <div className="certificate-title">
                Certificate of Dedication
              </div>

              <div
                className="certificate-subtitle"
                style={{
                  lineHeight: 1.8,
                }}
              >
                This certifies that the following dedication
                has been officially recorded by
                <strong> Lifeline Grace Church.</strong>
              </div>

              <section className="fields">

                <Field
                  label="Child / Candidate Name"
                  value={record.child_name}
                  icon="user"
                />

                <Field
                  label="Dedication Date"
                  value={record.dedication_date}
                  icon="calendar"
                />

                <Field
                  label="Date of Birth"
                  value={record.date_of_birth}
                  icon="calendar"
                />

                <Field
                  label="Dedication Location"
                  value={record.dedication_place}
                  icon="pin"
                />

                <Field
                  label="Father's Name"
                  value={record.father_name}
                  icon="user"
                />

                <Field
                  label="Mother's Name"
                  value={record.mother_name}
                  icon="user"
                />

              </section>

              <footer className="signatures">

                <div className="signature">

                  <div className="sig-line">
                    {record.pastor_name}
                  </div>

                  <small>
                    OFFICIATING PASTOR
                  </small>

                </div>

                <div className="sig-divider" />

                <div className="signature">

                  <div className="sig-line" />

                  <small>
                    AUTHORIZED SIGNATURE
                  </small>

                </div>

              </footer>

            </main>

          </div>
        </div>
      </div>
    </article>
  );
}

// The generated certificate is rendered in the dedicated print window only.
void Certificate;

// ---------- Shared inline style helpers (match Pastoral Dashboard theme) ----------
const pageWrapperStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#14532d",
  padding: "30px",
  color: "white",
  boxSizing: "border-box",
};

const contentPanelStyle: React.CSSProperties = {
  background: "#003b8e",
  borderRadius: "22px",
  padding: "25px",
};

const cardStyle: React.CSSProperties = {
  background: "white",
  color: "#111827",
  borderRadius: "18px",
  padding: "25px",
  boxShadow: "0 8px 18px rgba(0,0,0,.25)",
};

const backButtonStyle: React.CSSProperties = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "12px 28px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  marginBottom: "20px",
};

const saveButtonStyle = (saving: boolean): React.CSSProperties => ({
  padding: "12px 18px",
  background: "linear-gradient(180deg,#fb8c00,#ef6c00)",
  color: "white",
  border: 0,
  borderRadius: 8,
  fontWeight: 700,
  cursor: saving ? "wait" : "pointer",
  marginTop: 10,
});

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: 10,
  marginTop: 5,
  boxSizing: "border-box",
  borderRadius: 6,
  border: "1px solid #d1d5db",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  margin: "12px 0",
  fontWeight: 700,
};

export default function DedicationRegister({ setPage, loggedInLeader }: Props) {
  const branch = loggedInLeader?.branch || "Church";
  const pastor = loggedInLeader?.full_name || "Pastoral Leader";

  const [form, setForm] = useState(blankRecord);
  const [records, setRecords] = useState<DedicationRecord[]>([]);
  const [generatedRecordIds, setGeneratedRecordIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  const loadRecords = async () => {
    const response = await fetch(
      `${API_BASE_URL}/dedication-records/${encodeURIComponent(branch)}`
    );
    if (response.ok) setRecords(await response.json());
  };

  useEffect(() => {
    void loadRecords();
  }, [branch]);

  const save = async () => {
    if (Object.values(form).some((value) => !value.trim())) {
      return alert("Fill in every certificate field.");
    }
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
    const printWindow = window.open("", "_blank", "width=1200,height=650");
    if (!printWindow) return alert("Allow pop-ups to print the certificate.");

    setGeneratedRecordIds((ids) =>
      ids.includes(record.id) ? ids : [...ids, record.id]
    );

    // A generated certificate should not stay in the register, preventing it
    // from being generated again after a refresh.
    void fetch(
      `${API_BASE_URL}/dedication-records/${record.id}?branch=${encodeURIComponent(branch)}`,
      { method: "DELETE" }
    ).then((response) => {
      if (response.ok) {
        setRecords((current) => current.filter((item) => item.id !== record.id));
      }
    });

    const value = (key: keyof DedicationRecord) => escapeHtml(String(record[key]));
    const field = (label: string, key: keyof DedicationRecord, icon: keyof typeof ICON_SVG) =>
      `<div class="field">
         <div class="field-icon">${ICON_SVG[icon]}</div>
         <div class="field-body"><small>${label}</small><strong>${value(key)}</strong></div>
       </div>`;

    printWindow.document.write(`<!doctype html>
<html>
<head>
  <title>Dedication Certificate</title>
 <style>${certificateCss}</style>
</head>
<body>
  <article class="certificate">

<div class="certificate-inner">

<div class="certificate-inner2">

<div class="certificate-layout">

<aside class="certificate-side">

<img
class="certificate-logo"
src="${window.location.origin}/logo.png"
alt="Church Logo">

<div class="scripture-heading">
EPHESIANS 4:13–15
</div>

<div class="side-divider">
✦
</div>

<div class="scripture">

For You formed my inward parts;
You covered me in my mother's womb.

<br><br>

I will praise You, for I am fearfully
and wonderfully made.

Marvelous are Your works,
and that my soul knows very well.

<br><br>

<strong>Psalm 139 : 13–14</strong>

</div>

</aside>

<main class="certificate-main">

<header class="certificate-header">

<div style="width:100%;">

<div class="church-name">

<span class="lifeline">
LIFELINE
</span>

<span class="grace">
GRACE CHURCH
</span>

</div>

</div>

<div class="certificate-no">

<small>
CERTIFICATE NO.
</small>

<strong>
${value("certificate_number")}
</strong>

</div>

</header>

<div class="header-divider">
✦
</div>

<div class="motto">

SPIRITUAL INTEGRITY THROUGH
EXCELLENCE IN MINISTRY

</div>

<div class="address">

P.O BOX 722 – 50200

</div>

<div class="certificate-title">

Certificate of Dedication

</div>

<div class="certificate-subtitle">

This certifies that the following
dedication has been officially
recorded by
<strong>Lifeline Grace Church.</strong>

</div>

<section class="fields">

${field("Child / Candidate Name","child_name","user")}

${field("Dedication Date","dedication_date","calendar")}

${field("Date of Birth","date_of_birth","calendar")}

${field("Dedication Location","dedication_place","pin")}

${field("Father's Name","father_name","user")}

${field("Mother's Name","mother_name","user")}
            </section>
            <footer class="signatures">
              <div class="signature">
                <div class="sig-line">${value("pastor_name")}</div>
                <small>OFFICIATING PASTOR</small>
              </div>
              <div class="sig-divider"></div>
              <div class="signature">
                <div class="sig-line"></div>
                <small>AUTHORIZED SIGNATURE</small>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  </article>
<script>
window.addEventListener("load", () => {
  const images = Array.from(document.images);
  Promise.all(images.map((image) => image.complete
    ? Promise.resolve()
    : new Promise((resolve) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      })
  )).then(() => window.print());
});
</script>
</body>
</html>`);
    printWindow.document.close();
  };

  const inputs: Array<[string, keyof typeof form, string]> = [
    ["Child/candidate name", "child_name", "text"],
    ["Date of birth", "date_of_birth", "date"],
    ["Dedication date", "dedication_date", "date"],
    ["Dedication location", "dedication_place", "text"],
    ["Father's name", "father_name", "text"],
    ["Mother's name", "mother_name", "text"],
    ["Certificate number", "certificate_number", "text"],
  ];

  return (
    <div style={pageWrapperStyle}>
      <button onClick={() => setPage("pastoral-dashboard")} style={backButtonStyle}>
        ← Back to Pastoral Department
      </button>

      <h1 style={{ marginBottom: "25px", fontSize: "42px", fontWeight: "bold" }}>
        Dedication Register
      </h1>

      <div style={contentPanelStyle}>
        <h2 style={{ marginBottom: "10px", fontSize: "28px" }}>
          Save dedication details, then generate and print the certificate
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(280px, 390px) minmax(0, 1fr)",
            gap: 24,
            marginTop: 24,
          }}
        >
          <section style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>Add record</h2>

            {inputs.map(([label, key, type]) => (
              <label key={key} style={labelStyle}>
                {label}
                <input
                  required
                  type={type}
                  value={form[key]}
                  onChange={(event) =>
                    setForm({ ...form, [key]: event.target.value })
                  }
                  style={inputStyle}
                />
              </label>
            ))}

            <label style={labelStyle}>
              Pastor's full name
              <input value={pastor} disabled style={inputStyle} />
            </label>

            <button onClick={save} disabled={saving} style={saveButtonStyle(saving)}>
              {saving ? "Saving…" : "Save record"}
            </button>
          </section>

          <section style={{ ...cardStyle, overflowX: "auto" }}>
            <h2 style={{ marginTop: 0 }}>Saved dedication records</h2>

            <table style={{ minWidth: 820, width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {[
                    "Child",
                    "D.O.B.",
                    "Dedication date",
                    "Location",
                    "Father",
                    "Mother",
                    "Pastor",
                    "Certificate",
                    "",
                  ].map((heading) => (
                    <th key={heading} style={{ textAlign: "left", padding: 8 }}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((record) => {
                  const generated = generatedRecordIds.includes(record.id);
                  return (
                    <tr key={record.id}>
                      {[
                        record.child_name,
                        record.date_of_birth,
                        record.dedication_date,
                        record.dedication_place,
                        record.father_name,
                        record.mother_name,
                        record.pastor_name,
                        record.certificate_number,
                      ].map((value, index) => (
                        <td key={index} style={{ padding: 8 }}>
                          {value}
                        </td>
                      ))}
                      <td>
                        <button
                          onClick={() => printCertificate(record)}
                          style={{
                            padding: "9px 12px",
                            border: 0,
                            borderRadius: 6,
                            color: "white",
                            fontWeight: 700,
                            cursor: "pointer",
                            background: generated ? "#6b7280" : "#16a34a",
                            animation: generated ? "none" : "blink 1s infinite",
                          }}
                        >
                          {generated ? "Generated" : "Generate card"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {!records.length && (
                  <tr>
                    <td colSpan={9} style={{ padding: 8 }}>
                      No saved dedication records.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        </div>

      </div>

      <style>{"@keyframes blink { 50% { opacity: .45; } }"}</style>
    </div>
  );
}
