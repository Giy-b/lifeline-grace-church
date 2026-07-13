import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { API_BASE_URL } from "../config/api";

type ChurchOversightProps = {
  selectedBranch: string;
  setPage: (page: string) => void;
};

type DepartmentSummary = {
  department: string;
  leaders: number;
  members: number;
  announcements: number;
};

type CellGroupSummary = {
  cell_group: string;
  members: number;
};

type RecentItem = {
  title?: string;
  department?: string;
  posted_by?: string;
  media_type?: string;
  uploaded_by?: string;
  generated_by?: string;
  net_balance?: number;
  created_at: string;
};

type OversightData = {
  last_report: {
    id: number;
    generated_by: string;
    created_at: string;
    net_balance: number;
  } | null;
  totals: {
    members: number;
    leaders: number;
    active_announcements: number;
    active_media: number;
    active_financial_reports: number;
    stored_income: number;
    stored_expenses: number;
    stored_net_balance: number;
    active_income: number;
    active_expenses: number;
    active_net_balance: number;
    attendance: number;
    cell_offering: number;
  };
  department_summary: DepartmentSummary[];
  cell_group_summary: CellGroupSummary[];
  recent_activity: {
    announcements: RecentItem[];
    media: RecentItem[];
    financial_reports: RecentItem[];
  };
};

type StoredReport = {
  id: number;
  generated_by: string;
  total_members: number;
  total_leaders: number;
  total_announcements: number;
  total_media: number;
  total_financial_reports: number;
  total_income: number;
  total_expenses: number;
  net_balance: number;
  total_attendance: number;
  total_cell_offering: number;
  created_at: string;
};

const emptyOverview: OversightData = {
  last_report: null,
  totals: {
    members: 0,
    leaders: 0,
    active_announcements: 0,
    active_media: 0,
    active_financial_reports: 0,
    stored_income: 0,
    stored_expenses: 0,
    stored_net_balance: 0,
    active_income: 0,
    active_expenses: 0,
    active_net_balance: 0,
    attendance: 0,
    cell_offering: 0,
  },
  department_summary: [],
  cell_group_summary: [],
  recent_activity: {
    announcements: [],
    media: [],
    financial_reports: [],
  },
};

function money(value: number) {
  return `KSh ${Math.round(value || 0).toLocaleString()}`;
}

function shortDate(value: string) {
  if (!value) return "Not yet";

  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ChurchOversight({ selectedBranch, setPage }: ChurchOversightProps) {
  const [overview, setOverview] = useState<OversightData>(emptyOverview);
  const [reports, setReports] = useState<StoredReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");

  const totalIncome =
    overview.totals.stored_income + overview.totals.active_income;
  const totalExpenses =
    overview.totals.stored_expenses + overview.totals.active_expenses;
  const netBalance = totalIncome - totalExpenses;

  const largestDepartment = useMemo(
    () =>
      Math.max(
        1,
        ...overview.department_summary.map(
          (department) => department.members + department.leaders
        )
      ),
    [overview.department_summary]
  );

  const largestCellGroup = useMemo(
    () =>
      Math.max(
        1,
        ...overview.cell_group_summary.map((cellGroup) => cellGroup.members)
      ),
    [overview.cell_group_summary]
  );

  const loadOversight = async () => {
    setLoading(true);
    setMessage("");

    try {
      const [overviewResponse, reportsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/bishop-oversight/${selectedBranch}`),
        fetch(`${API_BASE_URL}/bishop-oversight-reports/${selectedBranch}`),
      ]);

      if (!overviewResponse.ok || !reportsResponse.ok) {
        throw new Error("Unable to load oversight data.");
      }

      setOverview(await overviewResponse.json());
      setReports(await reportsResponse.json());
    } catch {
      setMessage("Unable to load Bishop oversight data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOversight();
  }, [selectedBranch]);

  const generateReport = async () => {
    setGenerating(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/bishop-oversight-reports/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            branch: selectedBranch,
            generated_by: "Bishop",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Unable to generate report.");
      }

      setMessage("Bishop oversight report generated. New activity starts now.");
      await loadOversight();
    } catch {
      setMessage("Unable to generate Bishop oversight report.");
    } finally {
      setGenerating(false);
    }
  };

  const cardStyle = {
    background: "white",
    color: "#111827",
    borderRadius: "8px",
    padding: "18px",
    boxShadow: "0 8px 20px rgba(0,0,0,.16)",
  };

  const statStyle = {
    ...cardStyle,
    minHeight: "112px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        color: "#111827",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "#123b6d",
          color: "white",
          padding: "20px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: "28px" }}>Bishop Oversight</h1>
          <p style={{ margin: "8px 0 0" }}>
            {selectedBranch} Branch - church activity, departments, reports and
            finance summary.
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={generateReport}
            disabled={generating || loading}
            style={{
              background: generating ? "#64748b" : "#15803d",
              color: "white",
              border: "none",
              padding: "12px 18px",
              borderRadius: "8px",
              cursor: generating ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {generating ? "Generating..." : "Generate Bishop Report"}
          </button>

          <button
            onClick={() => setPage("bishop-dashboard")}
            style={{
              background: "#dc2626",
              color: "white",
              border: "none",
              padding: "12px 22px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Back
          </button>
        </div>
      </div>

      <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
        {message && (
          <div
            style={{
              background: message.startsWith("Unable") ? "#fee2e2" : "#dcfce7",
              color: message.startsWith("Unable") ? "#991b1b" : "#14532d",
              padding: "14px 16px",
              borderRadius: "8px",
              marginBottom: "18px",
              fontWeight: "bold",
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            ...cardStyle,
            marginBottom: "18px",
            display: "flex",
            justifyContent: "space-between",
            gap: "14px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: "20px" }}>Current Period</h2>
            <p style={{ margin: "6px 0 0", color: "#475569" }}>
              {overview.last_report
                ? `New activity after last Bishop report on ${shortDate(
                    overview.last_report.created_at
                  )}`
                : "No Bishop report generated yet. This view includes all available activity."}
            </p>
          </div>

          <button
            onClick={loadOversight}
            disabled={loading}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "14px",
            marginBottom: "18px",
          }}
        >
          <div style={statStyle}>
            <p style={{ margin: 0, color: "#64748b" }}>Members</p>
            <h2 style={{ margin: "10px 0 0", fontSize: "34px" }}>
              {overview.totals.members}
            </h2>
          </div>

          <div style={statStyle}>
            <p style={{ margin: 0, color: "#64748b" }}>Leaders</p>
            <h2 style={{ margin: "10px 0 0", fontSize: "34px" }}>
              {overview.totals.leaders}
            </h2>
          </div>

          <div style={statStyle}>
            <p style={{ margin: 0, color: "#64748b" }}>Announcements</p>
            <h2 style={{ margin: "10px 0 0", fontSize: "34px" }}>
              {overview.totals.active_announcements}
            </h2>
          </div>

          <div style={statStyle}>
            <p style={{ margin: 0, color: "#64748b" }}>Media Items</p>
            <h2 style={{ margin: "10px 0 0", fontSize: "34px" }}>
              {overview.totals.active_media}
            </h2>
          </div>

          <div style={statStyle}>
            <p style={{ margin: 0, color: "#64748b" }}>Attendance</p>
            <h2 style={{ margin: "10px 0 0", fontSize: "34px" }}>
              {overview.totals.attendance}
            </h2>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "14px",
            marginBottom: "18px",
          }}
        >
          <div style={cardStyle}>
            <p style={{ margin: 0, color: "#64748b" }}>Income</p>
            <h2 style={{ margin: "8px 0 0", color: "#166534" }}>
              {money(totalIncome)}
            </h2>
          </div>

          <div style={cardStyle}>
            <p style={{ margin: 0, color: "#64748b" }}>Expenses</p>
            <h2 style={{ margin: "8px 0 0", color: "#991b1b" }}>
              {money(totalExpenses)}
            </h2>
          </div>

          <div style={cardStyle}>
            <p style={{ margin: 0, color: "#64748b" }}>Net Balance</p>
            <h2
              style={{
                margin: "8px 0 0",
                color: netBalance >= 0 ? "#166534" : "#991b1b",
              }}
            >
              {money(netBalance)}
            </h2>
          </div>

          <div style={cardStyle}>
            <p style={{ margin: 0, color: "#64748b" }}>Cell Group Offering</p>
            <h2 style={{ margin: "8px 0 0", color: "#1d4ed8" }}>
              {money(overview.totals.cell_offering)}
            </h2>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.3fr) minmax(280px, .7fr)",
            gap: "18px",
            alignItems: "start",
          }}
        >
          <div style={cardStyle}>
            <h2 style={{ margin: "0 0 16px", fontSize: "20px" }}>
              Department Overview
            </h2>

            {overview.department_summary.length === 0 ? (
              <p style={{ color: "#64748b" }}>No department data yet.</p>
            ) : (
              <div style={{ display: "grid", gap: "14px" }}>
                {overview.department_summary.map((department) => {
                  const total = department.members + department.leaders;
                  const width = Math.max(8, (total / largestDepartment) * 100);

                  return (
                    <div key={department.department}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "10px",
                          marginBottom: "6px",
                        }}
                      >
                        <strong>{department.department}</strong>
                        <span style={{ color: "#475569" }}>
                          {department.members} members, {department.leaders}{" "}
                          leaders
                        </span>
                      </div>

                      <div
                        style={{
                          height: "12px",
                          background: "#e2e8f0",
                          borderRadius: "999px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${width}%`,
                            background: "#2563eb",
                          }}
                        />
                      </div>

                      <p
                        style={{
                          margin: "6px 0 0",
                          color: "#64748b",
                          fontSize: "13px",
                        }}
                      >
                        {department.announcements} new announcements in this
                        period
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={cardStyle}>
            <h2 style={{ margin: "0 0 16px", fontSize: "20px" }}>
              Cell Groups
            </h2>

            {overview.cell_group_summary.length === 0 ? (
              <p style={{ color: "#64748b" }}>No cell group data yet.</p>
            ) : (
              <div style={{ display: "grid", gap: "12px" }}>
                {overview.cell_group_summary.map((cellGroup) => {
                  const width = Math.max(
                    8,
                    (cellGroup.members / largestCellGroup) * 100
                  );

                  return (
                    <div key={cellGroup.cell_group}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "6px",
                        }}
                      >
                        <strong>{cellGroup.cell_group}</strong>
                        <span>{cellGroup.members}</span>
                      </div>

                      <div
                        style={{
                          height: "10px",
                          background: "#e2e8f0",
                          borderRadius: "999px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${width}%`,
                            background: "#16a34a",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "18px",
            marginTop: "18px",
          }}
        >
          <RecentList
            title="Recent Announcements"
            items={overview.recent_activity.announcements}
            renderItem={(item) => (
              <>
                <strong>{item.title}</strong>
                <span>
                  {item.department} - {item.posted_by} -{" "}
                  {shortDate(item.created_at)}
                </span>
              </>
            )}
          />

          <RecentList
            title="Recent Media"
            items={overview.recent_activity.media}
            renderItem={(item) => (
              <>
                <strong>{item.title}</strong>
                <span>
                  {item.media_type} - {item.uploaded_by} -{" "}
                  {shortDate(item.created_at)}
                </span>
              </>
            )}
          />

          <RecentList
            title="Finance Reports"
            items={overview.recent_activity.financial_reports}
            renderItem={(item) => (
              <>
                <strong>{money(item.net_balance || 0)}</strong>
                <span>
                  Generated by {item.generated_by} - {shortDate(item.created_at)}
                </span>
              </>
            )}
          />
        </div>

        <div style={{ ...cardStyle, marginTop: "18px" }}>
          <h2 style={{ margin: "0 0 16px", fontSize: "20px" }}>
            Stored Bishop Reports
          </h2>

          {reports.length === 0 ? (
            <p style={{ color: "#64748b" }}>
              No Bishop oversight report has been generated yet.
            </p>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {reports.map((report) => (
                <div
                  key={report.id}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "14px",
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "12px",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong>Report #{report.id}</strong>
                    <p style={{ margin: "4px 0 0", color: "#64748b" }}>
                      {shortDate(report.created_at)} by {report.generated_by}
                    </p>
                  </div>

                  <SmallReportValue
                    label="Members"
                    value={String(report.total_members)}
                  />
                  <SmallReportValue
                    label="Leaders"
                    value={String(report.total_leaders)}
                  />
                  <SmallReportValue
                    label="Attendance"
                    value={String(report.total_attendance)}
                  />
                  <SmallReportValue
                    label="Net"
                    value={money(report.net_balance)}
                    color={report.net_balance >= 0 ? "#166534" : "#991b1b"}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RecentList({
  title,
  items,
  renderItem,
}: {
  title: string;
  items: RecentItem[];
  renderItem: (item: RecentItem) => ReactNode;
}) {
  return (
    <div
      style={{
        background: "white",
        color: "#111827",
        borderRadius: "8px",
        padding: "18px",
        boxShadow: "0 8px 20px rgba(0,0,0,.16)",
      }}
    >
      <h2 style={{ margin: "0 0 14px", fontSize: "20px" }}>{title}</h2>

      {items.length === 0 ? (
        <p style={{ color: "#64748b" }}>No records yet.</p>
      ) : (
        <div style={{ display: "grid", gap: "10px" }}>
          {items.map((item, index) => (
            <div
              key={`${item.created_at}-${index}`}
              style={{
                borderBottom:
                  index === items.length - 1 ? "none" : "1px solid #e2e8f0",
                paddingBottom: index === items.length - 1 ? 0 : "10px",
                display: "grid",
                gap: "4px",
              }}
            >
              {renderItem(item)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SmallReportValue({
  label,
  value,
  color = "#111827",
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div>
      <p style={{ margin: 0, color: "#64748b", fontSize: "13px" }}>{label}</p>
      <strong style={{ color }}>{value}</strong>
    </div>
  );
}

export default ChurchOversight;
