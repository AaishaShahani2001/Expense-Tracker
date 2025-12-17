import { useEffect, useState } from "react";

export default function SummaryCard({ refreshKey }) {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);

  const fetchTotals = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/expenses/totals");
      const data = await res.json();

      setIncome(data.income);
      setExpense(data.expense);
      setBalance(data.balance);
    } catch (err) {
      console.error("Failed to fetch totals", err);
    }
  };

  useEffect(() => {
    fetchTotals();
  }, [refreshKey]); // re-fetch when refreshed

  return (
    <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#fff",
          borderRadius: "22px",
          padding: "22px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.12)"
        }}
      >
        <div style={{ fontSize: "14px", color: "#666" }}>
          Total Balance
        </div>

        <h2 style={{ margin: "10px 0 0", fontSize: "28px" }}>
          Rs.{balance.toFixed(2)}
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "22px"
          }}
        >
          {/* Income */}
          <div>
            <div style={{ fontSize: "13px", color: "#888" }}>Income</div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "4px",
                color: "#16a34a",
                fontWeight: "600"
              }}
            >
              <span style={{ fontSize: "18px" }}>↑</span>
              Rs.{income.toFixed(2)}
            </div>
          </div>

          {/* Expense */}
          <div>
            <div style={{ fontSize: "13px", color: "#888" }}>Expense</div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "4px",
                color: "#dc2626",
                fontWeight: "600"
              }}
            >
              <span style={{ fontSize: "18px" }}>↓</span>
              Rs.{expense.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
