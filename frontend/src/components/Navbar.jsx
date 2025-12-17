import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header
      style={{
        background: "#fff",
        padding: "14px 20px",
        boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
        marginBottom: "24px"
      }}
    >
      <div
        style={{
          maxWidth: "420px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        {/* App Name */}
        <h2
          style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: "600"
          }}
        >
          Expense Tracker
        </h2>

        {/* NAV LINKS */}
        <nav style={{ display: "flex", gap: "18px" }}>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "500",
              color: "#000"
            }}
          >
            Home
          </Link>

          <Link
            to="/transactions"
            style={{
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "500",
              color: "#000"
            }}
          >
            Transactions
          </Link>

          <Link
            to="/dashboard"
            style={{
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "500",
              color: "#000"
            }}
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
