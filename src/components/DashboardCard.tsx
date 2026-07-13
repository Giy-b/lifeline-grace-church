type DashboardCardProps = {
  icon: string;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
};

export default function DashboardCard({
  icon,
  title,
  description,
  color,
  onClick,
}: DashboardCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: color,
        borderRadius: "18px",
        padding: "20px",
        color: "white",
        cursor: "pointer",
        height: "250px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 8px 18px rgba(0,0,0,.35)",
        transition: ".3s",
      }}
    >
      <div
        style={{
          width: "70px",
          height: "70px",
          margin: "0 auto",
          borderRadius: "15px",
          background: "rgba(255,255,255,.15)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "36px",
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          textAlign: "center",
          margin: 0,
          lineHeight: 1.3,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          textAlign: "center",
          fontSize: "14px",
          opacity: .9,
        }}
      >
        {description}
      </p>

      <div
        style={{
          width: "38px",
          height: "38px",
          borderRadius: "50%",
          margin: "0 auto",
          background: "rgba(255,255,255,.2)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
          fontSize: "20px",
        }}
      >
        →
      </div>
    </div>
  );
}