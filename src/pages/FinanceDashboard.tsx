import { API_BASE_URL } from "../config/api";
import { useEffect, useState } from "react";

type FinanceDashboardProps = {
  setPage: (page: string) => void;
  loggedInLeader: any;

  setChatUserName: (name: string) => void;
  setChatBackPage: (page: string) => void;
  setChatSenderType: (type: string) => void;
  setChatDepartment: (department: string) => void;
};
function FinanceDashboard({
  setPage,
  loggedInLeader,
  setChatUserName,
  setChatBackPage,
  setChatSenderType,
  setChatDepartment,
}: FinanceDashboardProps) {
  const [cellReports, setCellReports] = useState<any[]>([]);
  const [incomeRecords, setIncomeRecords] = useState<any[]>([]);
  const [financialReports, setFinancialReports] = useState<any[]>([]);
  const [isReportCardOpen, setIsReportCardOpen] = useState(false);
  const [isReportPreviewOpen, setIsReportPreviewOpen] = useState(false);
  const [selectedFinancialReport, setSelectedFinancialReport] = useState<any | null>(null);
  const [expenseDate, setExpenseDate] = useState(
  new Date().toISOString().split("T")[0]
);

const [category, setCategory] = useState("Electricity");
const [amount, setAmount] = useState("");

const [expenses, setExpenses] = useState<any[]>([]);
  const [offeringDate, setOfferingDate] = useState(
  new Date().toISOString().split("T")[0]
);

const [mainOffering, setMainOffering] = useState("");

const [sundaySchoolOffering, setSundaySchoolOffering] = useState("");
  const loadFinancialReports = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/financial-reports/${loggedInLeader.branch}`
    );

    const data = await response.json();

    setFinancialReports(data);
  } catch (err) {
    console.error(err);
  }
};

  const loadIncome = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/income/${loggedInLeader.branch}`
    );

    const data = await response.json();

    setIncomeRecords(data);
  } catch (err) {
    console.error(err);
  }
};
const loadExpenses = async () => {
  try {
    const res = await fetch(
  `${API_BASE_URL}/expenses/${loggedInLeader.branch}`
);

    const data = await res.json();

    setExpenses(data);
  } catch (err) {
    console.error(err);
  }
};
  const loadCellReports = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/home-visit-reports/${loggedInLeader.branch}`
    );

    const data = await response.json();

    setCellReports(data);
  } catch (err) {
    console.error(err);
  }
};
const verifyCash = async (reportId: number) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/home-visit-reports/import/${reportId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recorded_by: loggedInLeader.full_name,
        }),
      }
    );

    const data = await response.json();

    alert(data.message);

if (response.ok) {
  loadCellReports();
  loadIncome();
}
    
  } catch (err) {
    console.error(err);
  }
};
const saveExpense = async () => {
  if (!amount) {
    alert("Enter amount");
    return;
  }

  const res = await fetch(
    `${API_BASE_URL}/expenses`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expense_date: expenseDate,
        category,
        amount: Number(amount),
        branch: loggedInLeader.branch,
        recorded_by: "Bishop",
      }),
    }
  );

  const data = await res.json();

  alert(data.message);

  setAmount("");

  loadExpenses();
};
const generateFinancialReport = async () => {
  if (!window.confirm("Generate this finance report and start a new active finance cycle?")) {
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/financial-reports/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          branch: loggedInLeader.branch,
          generated_by: loggedInLeader.full_name,
        }),
      }
    );

    const data = await response.json();

    alert(data.message);

    if (response.ok) {
      loadIncome();
      loadExpenses();
      loadCellReports();
      loadFinancialReports();
    }
  } catch (err) {
    console.error(err);
    alert("Failed to generate report.");
  }
};

const totalIncome = incomeRecords.reduce(
  (sum, item) => sum + Number(item.amount),
  0
);

const totalExpenses = expenses.reduce(
  (sum, item) => sum + Number(item.amount),
  0
);

const netBalance = totalIncome - totalExpenses;
const totalAttendance = cellReports.reduce(
  (sum, item) => sum + Number(item.members_present),
  0
);

const totalCellOffering = cellReports.reduce(
  (sum, item) => sum + Number(item.offering),
  0
);

const cellGroupSummary = Object.values(
  cellReports.reduce((groups: Record<string, any>, report) => {
    const name = report.cell_group || "Unassigned";

    if (!groups[name]) {
      groups[name] = {
        cell_group: name,
        submissions: 0,
        attendance: 0,
        offering: 0,
      };
    }

    groups[name].submissions += 1;
    groups[name].attendance += Number(report.members_present);
    groups[name].offering += Number(report.offering);

    return groups;
  }, {})
).sort((first: any, second: any) => second.attendance - first.attendance);

const cellReportNotes = cellReports.filter((report) =>
  String(report.note || "").trim()
);

const expenseSummary = Object.values(
  expenses.reduce((groups: Record<string, any>, expense) => {
    const categoryName = expense.category || "Other";

    if (!groups[categoryName]) {
      groups[categoryName] = {
        category: categoryName,
        amount: 0,
      };
    }

    groups[categoryName].amount += Number(expense.amount);

    return groups;
  }, {})
).sort((first: any, second: any) => second.amount - first.amount);

const sortedFinancialReports = [...financialReports].sort((firstReport, secondReport) => {
  const firstDate = new Date(firstReport.created_at).getTime();
  const secondDate = new Date(secondReport.created_at).getTime();

  if (secondDate !== firstDate) {
    return secondDate - firstDate;
  }

  return Number(secondReport.id) - Number(firstReport.id);
});

const latestReport = sortedFinancialReports[0];
const openReportPreview = () => {
  setIsReportPreviewOpen(true);
};

const saveSundayOfferings = async () => {
  try {
    const records = [];

    if (Number(mainOffering) > 0) {
      records.push({
        source: "Main Service Offering",
        description: "Main Service Offering",
        amount: Number(mainOffering),
        income_date: offeringDate,
        branch: loggedInLeader.branch,
        recorded_by: loggedInLeader.full_name,
      });
    }

    if (Number(sundaySchoolOffering) > 0) {
      records.push({
        source: "Sunday School Offering",
        description: "Sunday School Offering",
        amount: Number(sundaySchoolOffering),
        income_date: offeringDate,
        branch: loggedInLeader.branch,
        recorded_by: loggedInLeader.full_name,
      });
    }

    for (const record of records) {
      await fetch(`${API_BASE_URL}/income`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(record),
      });
    }

    alert("Offerings saved successfully.");

    setMainOffering("");
    setSundaySchoolOffering("");

    loadIncome();

  } catch (err) {
    console.error(err);
    alert("Failed to save offerings.");
  }
};
useEffect(() => {
  if (loggedInLeader?.branch) {
    loadCellReports();
    loadIncome();
    loadExpenses();
    loadFinancialReports();
  }
}, [loggedInLeader]);


  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f3f4f6",
      }}
    >
      {/* ================= SIDEBAR ================= */}

      <div
        style={{
          width: "270px",
          background: "linear-gradient(180deg,#5b21b6,#6d28d9)",
          color: "white",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Logo */}

        <div
          style={{
            padding: "30px 20px",
            borderBottom: "1px solid rgba(255,255,255,.2)",
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <div
            style={{
              fontSize: "46px",
            }}
          >
            ⛪
          </div>

          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "28px",
              }}
            >
              LIFELINE GRACE CHURCH
            </h2>

            <p
              style={{
                margin: 0,
                opacity: 0.8,
              }}
            >
              CHURCH
            </p>
          </div>
        </div>

        {/* MENU */}

        <div
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {[
            "🏠 Dashboard",
            "💼 Income",
            "📉 Expenses",
            "⛪ Tithes",
            "🎁 Offerings",
            "📄 Transactions",
            "📊 Reports",
            "💰 Budget",
            "👥 Members",
            "⚙ Settings",
          ].map((item, index) => (
            <button
              key={index}
              style={{
                border: "none",
                background:
                  index === 0
                    ? "rgba(255,255,255,.18)"
                    : "transparent",
                color: "white",
                padding: "15px",
                borderRadius: "12px",
                textAlign: "left",
                fontSize: "16px",
                cursor: "pointer",
                fontWeight: index === 0 ? "bold" : "normal",
              }}
            >
              {item}
            </button>
          ))}

          <button
            onClick={() => setPage("branch-dashboard")}
            style={{
              marginTop: "30px",
              background: "#dc2626",
              color: "white",
              border: "none",
              padding: "15px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            logout
          </button>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* TOP BAR */}

        <div
          style={{
            height: "80px",
            background: "linear-gradient(90deg,#5b21b6,#7c3aed)",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 30px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <span
              style={{
                fontSize: "30px",
              }}
            >
              ☰
            </span>

            <h1
              style={{
                margin: 0,
              }}
            >
              Finance Dashboard
            </h1>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "25px",
            }}
          >
            <span style={{ fontSize: "24px" }}>🔔</span>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                  background: "white",
                  color: "#5b21b6",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "bold",
                }}
              >
                👤
              </div>

              <div>
             <div style={{ fontWeight: "bold" }}>
  {loggedInLeader?.full_name}
</div>

<div
  style={{
    fontSize: "13px",
  }}
>
  {loggedInLeader?.department}
</div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}

        <div
          style={{
            padding: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "30px",
            }}
          >
            <div>
              <h1
  style={{
    margin: 0,
    color: "#5b21b6",
  }}
>
  Welcome back, {loggedInLeader?.full_name} 👋
</h1>

              <p
                style={{
                  color: "#666",
                  marginTop: "10px",
                }}
              >
                Here's what's happening with the church finances.
              </p>
            </div>

            <div
              style={{
                background: "white",
                padding: "15px 25px",
                borderRadius: "15px",
                boxShadow: "0 3px 10px rgba(0,0,0,.1)",
                fontWeight: "bold",
              }}
            >
             📅 {new Date().toLocaleDateString("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
})}
            </div>
          </div>
                    {/* ================= FINANCE CARDS ================= */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  }}
>
<div
  onClick={() => setIsReportCardOpen(true)}
  role="button"
  tabIndex={0}
  onKeyDown={(event) => {
    if (event.key === "Enter" || event.key === " ") {
      setIsReportCardOpen(true);
    }
  }}
  style={{
    background: "linear-gradient(135deg,#1d4ed8,#5b21b6)",
    color: "white",
    borderRadius: "18px",
    padding: "24px",
    minHeight: "220px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 8px 20px rgba(0,0,0,.15)",
    cursor: "pointer",
  }}
>
  <div>
    <div style={{ fontSize: "42px", marginBottom: "8px" }}>📊</div>

    <h2 style={{ margin: 0, fontSize: "27px" }}>
      Report
    </h2>

    <p
      style={{
        marginTop: "10px",
        fontSize: "15px",
        opacity: 0.95,
        lineHeight: "23px",
      }}
    >
      Generate a reviewable finance report with income, expenses,
      balance, cell attendance and cell group offering performance.
    </p>

    {isReportCardOpen && (
      <p
        style={{
          margin: "12px 0 0",
          fontSize: "13px",
          opacity: 0.9,
        }}
      >
        Choose whether to generate a new report or preview the active cycle before generating.
      </p>
    )}
  </div>

  <div
    style={{
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
    }}
  >
    <button
      onClick={(event) => {
        event.stopPropagation();
        generateFinancialReport();
      }}
      style={{
        background: "white",
        color: "#1d4ed8",
        border: "none",
        padding: "11px 18px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Generate Report
    </button>

    <button
      onClick={(event) => {
        event.stopPropagation();
        setIsReportCardOpen(true);
        openReportPreview();
      }}
      style={{
        background: "rgba(255,255,255,.18)",
        color: "white",
        border: "1px solid rgba(255,255,255,.65)",
        padding: "11px 18px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Report Preview
    </button>
  </div>
</div>

{/* ================= CHURCH GROUP CHAT ================= */}

<div
  onClick={() => {
    setChatUserName(loggedInLeader.full_name);
    setChatSenderType("Leader");
    setChatDepartment("Finance");
    setChatBackPage("finance-dashboard");
    setPage("group-chat");
  }}
  style={{
    background: "linear-gradient(135deg,#075e54,#128C7E)",
    color: "white",
    borderRadius: "18px",
    padding: "24px",
    minHeight: "220px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    boxShadow: "0 8px 20px rgba(0,0,0,.15)",
    cursor: "pointer",
  }}
>
  <div>
    <div
      style={{
        fontSize: "42px",
        marginBottom: "8px",
      }}
    >
      💬
    </div>

    <h2
      style={{
        margin: 0,
        fontSize: "27px",
      }}
    >
      Church Group Chat
    </h2>

    <p
      style={{
        marginTop: "10px",
        fontSize: "15px",
        opacity: 0.95,
        lineHeight: "23px",
      }}
    >
      Communicate with church leaders, receive announcements,
      discuss finance matters and stay connected with every department.
    </p>
  </div>

  <button
    style={{
      width: "46px",
      height: "46px",
      borderRadius: "50%",
      border: "none",
      background: "white",
      color: "#075e54",
      fontSize: "22px",
      fontWeight: "bold",
      cursor: "pointer",
    }}
  >
    →
  </button>
</div>
</div>
           

          {/* ================= REPORT PREVIEW ================= */}

          {isReportPreviewOpen && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(17,24,39,.65)",
                zIndex: 1900,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "24px",
              }}
            >
          <section
            style={{
              background: "white",
              borderRadius: "18px",
              padding: "25px",
              boxShadow: "0 20px 45px rgba(0,0,0,.25)",
              width: "min(1100px, 100%)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "20px",
                alignItems: "flex-start",
                marginBottom: "22px",
              }}
            >
              <div>
                <h2 style={{ margin: 0, color: "#111827" }}>
                  Finance Report Preview
                </h2>

                <p style={{ color: "#6b7280", marginTop: "8px" }}>
                  Active cycle summary for {loggedInLeader?.branch} Branch.
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    background: "#f3f4f6",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    textAlign: "right",
                    minWidth: "190px",
                  }}
                >
                  <div style={{ color: "#6b7280", fontSize: "13px" }}>
                    Latest Reviewed Report
                  </div>

                  <strong>
                    {latestReport
                      ? new Date(latestReport.created_at).toLocaleDateString()
                      : "No report yet"}
                  </strong>
                </div>

                <button
                  onClick={() => setIsReportPreviewOpen(false)}
                  style={{
                    background: "#111827",
                    color: "white",
                    border: "none",
                    padding: "11px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Close
                </button>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "14px",
                marginBottom: "24px",
              }}
            >
              {[
                ["Total Income", totalIncome, "green"],
                ["Total Expenses", totalExpenses, "red"],
                ["Balance", netBalance, "#2563eb"],
                ["Cell Attendance", totalAttendance, "#7c3aed"],
                ["Cell Offering", totalCellOffering, "#0f766e"],
              ].map(([label, value, color]) => (
                <div
                  key={String(label)}
                  style={{
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "16px",
                  }}
                >
                  <div style={{ color: "#6b7280", fontSize: "13px" }}>
                    {label}
                  </div>

                  <strong
                    style={{
                      display: "block",
                      marginTop: "8px",
                      color: String(color),
                      fontSize: "22px",
                    }}
                  >
                    {label === "Cell Attendance"
                      ? Number(value).toLocaleString()
                      : `KSh ${Number(value).toLocaleString()}`}
                  </strong>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "20px",
              }}
            >
              <div>
                <h3 style={{ marginTop: 0 }}>Cell Group Attendance Rate</h3>

                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#eef2ff" }}>
                      <th style={{ padding: "10px" }}>Cell Group</th>
                      <th>Attendance</th>
                      <th>Rate</th>
                      <th>Offering</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cellGroupSummary.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ padding: "18px", textAlign: "center" }}>
                          No cell group submissions in this cycle.
                        </td>
                      </tr>
                    ) : (
                      cellGroupSummary.map((group: any) => (
                        <tr key={group.cell_group}>
                          <td style={{ padding: "10px", textAlign: "center" }}>
                            {group.cell_group}
                          </td>
                          <td style={{ textAlign: "center" }}>{group.attendance}</td>
                          <td style={{ textAlign: "center" }}>
                            {totalAttendance > 0
                              ? `${Math.round((group.attendance / totalAttendance) * 100)}%`
                              : "0%"}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            KSh {Number(group.offering).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div>
                <h3 style={{ marginTop: 0 }}>Cost Expenditure Share</h3>

                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#fef2f2" }}>
                      <th style={{ padding: "10px" }}>Category</th>
                      <th>Amount</th>
                      <th>Share</th>
                    </tr>
                  </thead>

                  <tbody>
                    {expenseSummary.length === 0 ? (
                      <tr>
                        <td colSpan={3} style={{ padding: "18px", textAlign: "center" }}>
                          No expenses in this cycle.
                        </td>
                      </tr>
                    ) : (
                      expenseSummary.map((expense: any) => (
                        <tr key={expense.category}>
                          <td style={{ padding: "10px", textAlign: "center" }}>
                            {expense.category}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            KSh {Number(expense.amount).toLocaleString()}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {totalExpenses > 0
                              ? `${Math.round((expense.amount / totalExpenses) * 100)}%`
                              : "0%"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ marginTop: "24px" }}>
              <h3>Reviewed Reports</h3>

              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#111827", color: "white" }}>
                    <th style={{ padding: "12px" }}>Generated</th>
                    <th>Period</th>
                    <th>Income</th>
                    <th>Expenses</th>
                    <th>Balance</th>
                    <th>Generated By</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedFinancialReports.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "18px", textAlign: "center" }}>
                        No reviewed reports yet.
                      </td>
                    </tr>
                  ) : (
                    sortedFinancialReports.map((report) => (
                      <tr
                        key={report.id}
                        onClick={() => setSelectedFinancialReport(report)}
                        title="Open this financial report"
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          {new Date(report.created_at).toLocaleDateString()}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {report.period_start || "-"} to {report.period_end || "-"}
                        </td>
                        <td style={{ textAlign: "center", color: "green", fontWeight: "bold" }}>
                          KSh {Number(report.total_income).toLocaleString()}
                        </td>
                        <td style={{ textAlign: "center", color: "red", fontWeight: "bold" }}>
                          KSh {Number(report.total_expenses).toLocaleString()}
                        </td>
                        <td style={{ textAlign: "center", color: "#2563eb", fontWeight: "bold" }}>
                          KSh {Number(report.net_balance).toLocaleString()}
                        </td>
                        <td style={{ textAlign: "center" }}>{report.generated_by}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
            </div>
          )}

          {selectedFinancialReport && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(17,24,39,.65)",
                zIndex: 2000,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "24px",
              }}
            >
              <div
                style={{
                  width: "min(980px, 100%)",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  background: "white",
                  borderRadius: "18px",
                  padding: "26px",
                  boxShadow: "0 20px 45px rgba(0,0,0,.25)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "20px",
                    alignItems: "flex-start",
                    marginBottom: "22px",
                  }}
                >
                  <div>
                    <h2 style={{ margin: 0, color: "#111827" }}>
                      Financial Report #{selectedFinancialReport.id}
                    </h2>

                    <p style={{ color: "#6b7280", marginTop: "8px" }}>
                      {selectedFinancialReport.branch} Branch | {selectedFinancialReport.period_start || "-"} to{" "}
                      {selectedFinancialReport.period_end || "-"} | Generated by{" "}
                      {selectedFinancialReport.generated_by}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedFinancialReport(null)}
                    style={{
                      background: "#111827",
                      color: "white",
                      border: "none",
                      padding: "10px 16px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Close
                  </button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
                    gap: "14px",
                    marginBottom: "24px",
                  }}
                >
                  {[
                    ["Income", selectedFinancialReport.total_income, "green"],
                    ["Expenses", selectedFinancialReport.total_expenses, "red"],
                    ["Balance", selectedFinancialReport.net_balance, "#2563eb"],
                    ["Attendance", selectedFinancialReport.total_attendance, "#7c3aed"],
                    ["Cell Offering", selectedFinancialReport.total_cell_offering, "#0f766e"],
                  ].map(([label, value, color]) => (
                    <div
                      key={String(label)}
                      style={{
                        background: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        padding: "16px",
                      }}
                    >
                      <div style={{ color: "#6b7280", fontSize: "13px" }}>
                        {label}
                      </div>

                      <strong
                        style={{
                          display: "block",
                          marginTop: "8px",
                          color: String(color),
                          fontSize: "21px",
                        }}
                      >
                        {label === "Attendance"
                          ? Number(value).toLocaleString()
                          : `KSh ${Number(value).toLocaleString()}`}
                      </strong>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "18px",
                  }}
                >
                  <div>
                    <h3>Income Summary</h3>

                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "#ecfdf5" }}>
                          <th style={{ padding: "10px" }}>Source</th>
                          <th>Records</th>
                          <th>Amount</th>
                        </tr>
                      </thead>

                      <tbody>
                        {(Array.isArray(selectedFinancialReport.income_summary)
                          ? selectedFinancialReport.income_summary
                          : []
                        ).length === 0 ? (
                          <tr>
                            <td colSpan={3} style={{ padding: "14px", textAlign: "center" }}>
                              No income saved in this report.
                            </td>
                          </tr>
                        ) : (
                          selectedFinancialReport.income_summary.map((income: any) => (
                            <tr key={income.source}>
                              <td style={{ padding: "10px", textAlign: "center" }}>
                                {income.source}
                              </td>
                              <td style={{ textAlign: "center" }}>{income.records}</td>
                              <td style={{ textAlign: "center", color: "green", fontWeight: "bold" }}>
                                KSh {Number(income.amount).toLocaleString()}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <h3>Expense Summary</h3>

                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "#fef2f2" }}>
                          <th style={{ padding: "10px" }}>Category</th>
                          <th>Records</th>
                          <th>Amount</th>
                        </tr>
                      </thead>

                      <tbody>
                        {(Array.isArray(selectedFinancialReport.expense_summary)
                          ? selectedFinancialReport.expense_summary
                          : []
                        ).length === 0 ? (
                          <tr>
                            <td colSpan={3} style={{ padding: "14px", textAlign: "center" }}>
                              No expenses saved in this report.
                            </td>
                          </tr>
                        ) : (
                          selectedFinancialReport.expense_summary.map((expense: any) => (
                            <tr key={expense.category}>
                              <td style={{ padding: "10px", textAlign: "center" }}>
                                {expense.category}
                              </td>
                              <td style={{ textAlign: "center" }}>{expense.records}</td>
                              <td style={{ textAlign: "center", color: "red", fontWeight: "bold" }}>
                                KSh {Number(expense.amount).toLocaleString()}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div style={{ marginTop: "24px" }}>
                  <h3>Cell Group Summary</h3>

                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#eef2ff" }}>
                        <th style={{ padding: "10px" }}>Cell Group</th>
                        <th>Submissions</th>
                        <th>Attendance</th>
                        <th>Offering</th>
                      </tr>
                    </thead>

                    <tbody>
                      {(Array.isArray(selectedFinancialReport.cell_group_summary)
                        ? selectedFinancialReport.cell_group_summary
                        : []
                      ).length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ padding: "14px", textAlign: "center" }}>
                            No cell group details saved in this report.
                          </td>
                        </tr>
                      ) : (
                        selectedFinancialReport.cell_group_summary.map((group: any) => (
                          <tr key={group.cell_group}>
                            <td style={{ padding: "10px", textAlign: "center" }}>
                              {group.cell_group}
                            </td>
                            <td style={{ textAlign: "center" }}>{group.submissions}</td>
                            <td style={{ textAlign: "center" }}>{group.attendance}</td>
                            <td style={{ textAlign: "center", fontWeight: "bold" }}>
                              KSh {Number(group.offering).toLocaleString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= SUMMARY ================= */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "25px",
            }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "18px",
                padding: "25px",
                boxShadow: "0 4px 12px rgba(0,0,0,.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <h2 style={{ margin: 0 }}>
                  Financial Summary
                </h2>

                <button
                  style={{
                    border: "1px solid #ddd",
                    background: "white",
                    padding: "8px 16px",
                    borderRadius: "8px",
                  }}
                >
                  This Month ▼
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: "15px",
                  marginBottom: "30px",
                }}
              >
                <div
                  style={{
                    background: "#ecfdf5",
                    borderRadius: "12px",
                    padding: "20px",
                    textAlign: "center",
                  }}
                >
                  <h4>Total Income</h4>
                  <h2 style={{ color: "green" }}>
  KSh {totalIncome.toLocaleString()}
</h2>
                </div>

                <div
                  style={{
                    background: "#fef2f2",
                    borderRadius: "12px",
                    padding: "20px",
                    textAlign: "center",
                  }}
                >
                  <h4>Total Expenses</h4>
                  <h2 style={{ color: "red" }}>
  KSh {totalExpenses.toLocaleString()}
</h2>
                </div>

                <div
                  style={{
                    background: "#eff6ff",
                    borderRadius: "12px",
                    padding: "20px",
                    textAlign: "center",
                  }}
                >
                  <h4>Net Balance</h4>
                  <h2 style={{ color: "#2563eb" }}>
  KSh {netBalance.toLocaleString()}
</h2>
                </div>
              </div>

              <h3 style={{ marginBottom: "20px" }}>
  Record Expense
</h3>

<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: "15px",
    marginBottom: "20px",
  }}
>
  <input
    type="date"
    value={expenseDate}
    onChange={(e) => setExpenseDate(e.target.value)}
    style={{
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid #ccc",
    }}
  />

  <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    style={{
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid #ccc",
    }}
  >
    <option>Electricity</option>
    <option>Rent</option>
    <option>Transport</option>
    <option>Welfare</option>
    <option>Equipment</option>
    <option>Maintenance</option>
    <option>Water</option>
    <option>Internet</option>
    <option>Stationery</option>
    <option>Other</option>
  </select>

  <input
    type="number"
    placeholder="Amount"
    value={amount}
    onChange={(e) => setAmount(e.target.value)}
    style={{
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid #ccc",
    }}
  />
</div>

<button
  onClick={saveExpense}
  style={{
    background: "#5d26dc",
    color: "white",
    border: "none",
    padding: "12px 25px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    marginBottom: "25px",
  }}
>
  Save 
</button>

<h3>Recent Expenses</h3>

<table
  style={{
    width: "100%",
    borderCollapse: "collapse",
  }}
>
  <thead>
    <tr style={{ background: "#f3f4f6" }}>
      <th style={{ padding: "10px" }}>Date</th>
      <th>Category</th>
      <th>Amount</th>
      <th>Recorded By</th>
    </tr>
  </thead>

  <tbody>
    {expenses.length === 0 ? (
      <tr>
        <td
          colSpan={4}
          style={{
            textAlign: "center",
            padding: "20px",
          }}
        >
          No expenses recorded
        </td>
      </tr>
    ) : (
      expenses.map((expense) => (
        <tr key={expense.id}>
          <td style={{ padding: "12px", textAlign: "center" }}>
            {new Date(expense.expense_date).toLocaleDateString()}
          </td>

          <td style={{ textAlign: "center" }}>
            {expense.category}
          </td>

          <td
            style={{
              textAlign: "center",
              color: "red",
              fontWeight: "bold",
            }}
          >
            KSh {Number(expense.amount).toLocaleString()}
          </td>

          <td style={{ textAlign: "center" }}>
            {expense.recorded_by}
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>
            </div>
                        
              {/* QUICK OFFERING ENTRY */}

<div
  style={{
    background: "white",
    borderRadius: "18px",
    padding: "25px",
    boxShadow: "0 4px 12px rgba(0,0,0,.08)",
  }}
>
  <h2
    style={{
      marginTop: 0,
      marginBottom: "20px",
      color: "#5b21b6",
    }}
  >
    Quick Offering Entry
  </h2>

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    }}
  >
    <input
  type="date"
  value={offeringDate}
  onChange={(e) => setOfferingDate(e.target.value)}
  style={{
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
  }}
/>

    <input
  type="number"
  placeholder="Main Service Offering"
  value={mainOffering}
  onChange={(e) => setMainOffering(e.target.value)}
  style={{
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
  }}
/>

    <input
  type="number"
  placeholder="Sunday School Offering"
  value={sundaySchoolOffering}
  onChange={(e) => setSundaySchoolOffering(e.target.value)}
  style={{
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
  }}
/>
<button
  onClick={saveSundayOfferings}
  style={{
        background: "#1b095e",
        color: "white",
        border: "none",
        padding: "14px",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "16px",
      }}
    >
      💾 Save
    </button>
  </div>
</div>
          </div>

          {/* RECENT TRANSACTIONS */}

          <div
            style={{
              marginTop: "30px",
              background: "white",
              borderRadius: "18px",
              padding: "25px",
              boxShadow: "0 4px 12px rgba(0,0,0,.08)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "20px",
              }}
            >
              Recent Transactions
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
                    background: "#6d28d9",
                    color: "white",
                  }}
                >
                  <th style={{ padding: "15px" }}>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
  {incomeRecords.length === 0 ? (
    <tr>
      <td
        colSpan={4}
        style={{
          padding: "20px",
          textAlign: "center",
        }}
      >
        No income records found
      </td>
    </tr>
  ) : (
    incomeRecords.map((item) => (
      <tr key={item.id}>
        <td
          style={{
            padding: "14px",
            borderBottom: "1px solid #eee",
            textAlign: "center",
          }}
        >
          {new Date(item.income_date).toLocaleDateString()}
        </td>

        <td
          style={{
            padding: "14px",
            borderBottom: "1px solid #eee",
            textAlign: "center",
          }}
        >
          {item.description}
        </td>

        <td
          style={{
            padding: "14px",
            borderBottom: "1px solid #eee",
            textAlign: "center",
          }}
        >
          {item.source}
        </td>

        <td
          style={{
            padding: "14px",
            borderBottom: "1px solid #eee",
            textAlign: "center",
            color: "green",
            fontWeight: "bold",
          }}
        >
          KSh {Number(item.amount).toLocaleString()}
        </td>
      </tr>
    ))
  )}
</tbody>
            </table>
          </div>

         {/* ================= CELL GROUP REPORTS ================= */}

<section
  style={{
    marginTop: "30px",
    background: "#fff",
    borderRadius: "15px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,.1)",
  }}
>
  <h2
    style={{
      marginBottom: "20px",
      color: "#333",
    }}
  >
    Cell Group Reports
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
          background: "#5d3fd3",
          color: "white",
        }}
      >
        <th style={{ padding: "12px" }}>Date</th>
        <th style={{ padding: "12px" }}>Cell Group</th>
        <th style={{ padding: "12px" }}>Members</th>
        <th style={{ padding: "12px" }}>Offering</th>
        <th style={{ padding: "12px" }}>Submitted By</th>
<th style={{ padding: "12px" }}>Action</th>
      </tr>
    </thead>

    <tbody>
  {cellReports.length === 0 ? (
    <tr>
      <td colSpan={6} style={{ padding: "20px", textAlign: "center" }}>
        No reports found
      </td>
    </tr>
  ) : (
    cellReports.map((report) => (
      <tr key={report.id}>
        <td>{new Date(report.report_date).toLocaleDateString()}</td>

        <td>{report.cell_group}</td>

        <td>{report.members_present}</td>

        <td>KSh {Number(report.offering).toLocaleString()}</td>

        <td>{report.submitted_by}</td>

        <td>
          {report.imported ? (
            <span
              style={{
                color: "green",
                fontWeight: "bold",
              }}
            >
              ✓ Verified
            </span>
          ) : (
            <button
              onClick={() => verifyCash(report.id)}
              style={{
                background: "#16a34a",
                color: "white",
                border: "none",
                padding: "8px 14px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Verify Cash
            </button>
          )}
        </td>
      </tr>
    ))
  )}
</tbody>
  </table>
</section>

{/* ================= CELL GROUP NOTES / CHALLENGES ================= */}

<section
  style={{
    marginTop: "30px",
    background: "#fff",
    borderRadius: "15px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,.1)",
  }}
>
  <h2
    style={{
      marginBottom: "8px",
      color: "#333",
    }}
  >
    Cell Group Notes / Challenges
  </h2>

  <p
    style={{
      color: "#666",
      marginTop: 0,
      marginBottom: "20px",
    }}
  >
    Reports with notes entered by cell group leaders for administrator follow-up.
  </p>

  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
    }}
  >
    <thead>
      <tr
        style={{
          background: "#92400e",
          color: "white",
        }}
      >
        <th style={{ padding: "12px" }}>Date</th>
        <th style={{ padding: "12px" }}>Cell Group</th>
        <th style={{ padding: "12px" }}>Members</th>
        <th style={{ padding: "12px" }}>Offering</th>
        <th style={{ padding: "12px" }}>Submitted By</th>
        <th style={{ padding: "12px" }}>Description / Note</th>
      </tr>
    </thead>

    <tbody>
      {cellReportNotes.length === 0 ? (
        <tr>
          <td colSpan={6} style={{ padding: "20px", textAlign: "center" }}>
            No notes or challenges submitted
          </td>
        </tr>
      ) : (
        cellReportNotes.map((report) => (
          <tr key={report.id}>
            <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
              {new Date(report.report_date).toLocaleDateString()}
            </td>

            <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
              {report.cell_group}
            </td>

            <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
              {report.members_present}
            </td>

            <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
              KSh {Number(report.offering).toLocaleString()}
            </td>

            <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
              {report.submitted_by}
            </td>

            <td
              style={{
                padding: "12px",
                borderBottom: "1px solid #eee",
                maxWidth: "420px",
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
              }}
            >
              {report.note}
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</section>
        </div>
      </div>
    </div>
  );
}

export default FinanceDashboard;
