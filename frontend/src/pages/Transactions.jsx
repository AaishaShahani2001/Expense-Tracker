import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    try {
      const res = await fetch("https://expense-tracker-backend-9lee.onrender.com/api/expenses");
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div style={{ padding: "20px", background: "#FFF7ED", minHeight: "100vh" }}>
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/")}
        style={{
          marginBottom: "16px",
          background: "transparent",
          border: "none",
          color: "#005ce6",
          fontSize: "14px",
          cursor: "pointer",
          fontWeight: "600"
        }}
      >
        ← Back to Home
      </button>

      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        All Transactions
      </h2>

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

      {!loading && transactions.length === 0 && (
        <p style={{ textAlign: "center" }}>No transactions found</p>
      )}

      {transactions.map(tx => {
        const isIncome = tx.category === "Income";

        //  USE FORM DATE
        const displayDate = new Date(tx.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        });

        return (
          <div
            key={tx._id}
            style={{
              background: "#fff",
              padding: "14px 16px",
              borderRadius: "14px",
              marginBottom: "14px",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
              borderLeft: `6px solid ${isIncome ? "#22c55e" : "#ef4444"}`
            }}
          >
            {/* TOP ROW */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start"
              }}
            >
              {/* LEFT */}
              <div>
                <div style={{ fontWeight: 600 }}>{tx.title}</div>
                <div style={{ fontSize: 13, color: "#6b7280" }}>
                  {tx.category}
                </div>
              </div>

              {/* RIGHT */}
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontWeight: 700,
                    color: isIncome ? "#22c55e" : "#ef4444"
                  }}
                >
                  {isIncome ? "+" : "-"} Rs.{tx.amount}
                </div>

                {/* DATE UNDER AMOUNT */}
                <div
                  style={{
                    fontSize: 12,
                    color: "#6b7280",
                    marginTop: 4
                  }}
                >
                  {displayDate}
                </div>
              </div>
            </div>

            {/* NOTE */}
            {tx.note && (
              <div
                style={{
                  marginTop: 10,
                  fontSize: 14,
                  color: "#374151",
                  background: "#f9fafb",
                  padding: "8px 10px",
                  borderRadius: "8px"
                }}
              >
                📝 {tx.note}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
