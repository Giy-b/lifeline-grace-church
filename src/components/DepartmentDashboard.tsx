type DepartmentDashboardProps = {
  selectedBranch: string;
  setPage: (page: string) => void;
   setIsBishopAccess: (value: boolean) => void;
};
function DepartmentDashboard({
  selectedBranch,
  setPage,
  setIsBishopAccess,
}: DepartmentDashboardProps) {
  const departments = [
  { name: "Administration", icon: "🏢" },
  { name: "Cell Group", icon: "🏠" },
  { name: "Media", icon: "🎥" },
  { name: "Pastoral", icon: "🙏" },
  { name: "Youth", icon: "🧑‍🤝‍🧑" },
];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#4b0082,#7e22ce)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "30px",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#003b8e",
          padding: "20px",
          borderRadius: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Department Dashboard</h1>

          <h3 style={{ marginTop: 10 }}>
            {selectedBranch} Branch
          </h3>
        </div>

        <button
          onClick={() => setPage("bishop-dashboard")}
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
          ← Back
        </button>
      </div>


      {/* Department Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "20px",
        }}
      >
        {departments.map((dept) => (
          <div
            key={dept.name}
            style={{
              background: "linear-gradient(180deg,#1565c0,#0d47a1)",
              borderRadius: "18px",
              padding: "25px",
              textAlign: "center",
              cursor: "pointer",
              height: "220px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 6px 15px rgba(0,0,0,.35)",
            }}
          >
            <div style={{ fontSize: 60 }}>{dept.icon}</div>

            <h2>{dept.name}</h2>

       <button
  onClick={() => {
  setIsBishopAccess(true);

  if (dept.name === "Pastoral") {
    setPage("pastoral-dashboard");
  } else if (dept.name === "Media") {
    setPage("media-dashboard");
  } else if (dept.name === "Administration") {
    setPage("administration-dashboard");
  } else if (dept.name === "Cell Group") {
    setPage("cell-group-dashboard");
  } else if (dept.name === "Youth") {
    setPage("youth-dashboard");
  }
}}
  style={{
    background: "white",
    color: "#003b8e",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  Open Dashboard
</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DepartmentDashboard;
