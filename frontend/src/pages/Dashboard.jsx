import { useEffect, useState, useMemo } from "react";
import { exportPDF } from "../utils/pdfExport";
import { useNavigate } from "react-router-dom";
import CategoryPieChart from "../components/CategoryPieChart";
import DailyExpenseBarChart from "../components/DailyExpenseBarChart";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [period, setPeriod] = useState("monthly");
  const [category, setCategory] = useState("All");

  // 🔹 NEW: Month filter (0–11)
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth()
  );

  useEffect(() => {
    fetch("https://expense-tracker-backend-9lee.onrender.com/api/expenses")
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(err => console.error(err));
  }, []);

  /* --------------------------------------------------
     FILTER BY PERIOD (+ MONTH SUPPORT)
  -------------------------------------------------- */
  const periodTransactions = useMemo(() => {
    const now = new Date();
    const todayKey = now.toLocaleDateString("en-CA");

    return transactions.filter(tx => {
      const txDate = new Date(tx.date);
      const txKey = txDate.toLocaleDateString("en-CA");

      if (period === "daily") {
        return txKey === todayKey;
      }

      if (period === "monthly") {
        return (
          txDate.getMonth() === selectedMonth &&
          txDate.getFullYear() === now.getFullYear()
        );
      }

      if (period === "yearly") {
        return txDate.getFullYear() === now.getFullYear();
      }

      return true;
    });
  }, [transactions, period, selectedMonth]);

  /* --------------------------------------------------
     CATEGORY FILTER
  -------------------------------------------------- */
  const chartTransactions = useMemo(() => {
    return category === "All"
      ? periodTransactions
      : periodTransactions.filter(tx => tx.category === category);
  }, [periodTransactions, category]);

  /* --------------------------------------------------
     SUMMARY CALCULATION
  -------------------------------------------------- */
  const { income, expense, balance } = useMemo(() => {
    let income = 0;
    let totalExpense = 0;
    let filteredExpense = 0;

    periodTransactions.forEach(tx => {
      if (tx.category === "Income") {
        income += tx.amount;
      } else {
        totalExpense += tx.amount;
        if (category === "All" || tx.category === category) {
          filteredExpense += tx.amount;
        }
      }
    });

    return {
      income,
      expense: category === "All" ? totalExpense : filteredExpense,
      balance: income - totalExpense
    };
  }, [periodTransactions, category]);

  return (
    <div style={{ padding: "20px", background: "#FFF7ED", minHeight: "100vh" }}>
      {/* BACK */}
      <button
        onClick={() => navigate("/")}
        style={{
          background: "transparent",
          border: "none",
          color: "#005ce6",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
          marginBottom: "12px"
        }}
      >
        ← Back to Home
      </button>

      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Analytics Dashboard
      </h2>

      {/* FILTER BAR */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#fff",
          padding: "14px 16px",
          borderRadius: "16px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          marginBottom: "30px"
        }}
      >
        {/* PERIOD */}
        <div style={{ display: "flex", gap: "8px" }}>
          {["daily", "monthly", "yearly"].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: "8px 14px",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                background: period === p ? "#005ce6" : "#f1f5f9",
                color: period === p ? "#fff" : "#334155"
              }}
            >
              {p === "daily" && "Today"}
              {p === "monthly" && "This Month"}
              {p === "yearly" && "This Year"}
            </button>
          ))}
        </div>

        {/* 🆕 MONTH FILTER */}
        {period === "monthly" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#f1f5f9",
              padding: "6px 10px",
              borderRadius: "999px",
              boxShadow: "inset 0 2px 6px rgba(0,0,0,0.08)"
            }}
          >
            <span
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "#475569"
              }}
            >
              Month
            </span>

            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                color: "#005ce6",
                appearance: "none"
              }}
            >
              {MONTHS.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>

            <span style={{ fontSize: "12px", color: "#64748b" }}>▾</span>
          </div>
        )}


        {/* CATEGORY */}
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            background: "#f9fafb",
            fontSize: "14px"
          }}
        >
          <option value="All">All Categories</option>
          <option value="Income">Income</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Bills">Bills</option>
          <option value="Shopping">Shopping</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Health">Health</option>
          <option value="Other">Other</option>
        </select>

        {/* PDF */}
        <button
          onClick={() => exportPDF(periodTransactions)}
          style={{
            padding: "10px 14px",
            borderRadius: "12px",
            border: "none",
            background: "#22c55e",
            color: "#fff",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          📄 Export PDF
        </button>
      </div>

      {/* SUMMARY */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: "40px"
        }}
      >
        {[
          { label: "Income", value: income, color: "#22c55e" },
          { label: "Expense", value: expense, color: "#ef4444" },
          { label: "Balance", value: balance, color: "#005ce6" }
        ].map(item => (
          <div
            key={item.label}
            style={{
              flex: "1",
              minWidth: "180px",
              background: "#fff",
              padding: "16px",
              borderRadius: "16px",
              textAlign: "center",
              boxShadow: "0 10px 24px rgba(0,0,0,0.1)"
            }}
          >
            <div style={{ fontSize: "14px", color: "#6b7280" }}>
              {item.label}
            </div>
            <div
              style={{
                marginTop: "8px",
                fontSize: "22px",
                fontWeight: "700",
                color: item.color
              }}
            >
              Rs.{item.value}
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "56px", // 👈 MAIN SPACING BETWEEN CHARTS
          marginTop: "40px",
          marginBottom: "40px"
        }}
      >
        {/* PIE CHART CARD */}
        <div
          style={{
            background: "#ffffff",
            padding: "24px",
            borderRadius: "20px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.08)"
          }}
        >
          <CategoryPieChart transactions={chartTransactions} />
        </div>

        {/* BAR CHART CARD */}
        <div
          style={{
            background: "#ffffff",
            padding: "24px",
            borderRadius: "20px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.08)"
          }}
        >
          <DailyExpenseBarChart transactions={chartTransactions} />
        </div>
      </div>

    </div>
  );
}
