import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

/* -----------------------------------
   CATEGORY COLORS
----------------------------------- */
const CATEGORY_COLORS = {
  Income: "#22c55e",
  Food: "#ef4444",
  Transport: "#f97316",
  Bills: "#3b82f6",
  Shopping: "#a855f7",
  Entertainment: "#14b8a6",
  Health: "#eab308",
  Other: "#64748b"
};

/* -----------------------------------
   LOCAL DATE KEY (TIMEZONE SAFE)
----------------------------------- */
const getLocalDateKey = date =>
  new Date(date).toLocaleDateString("en-CA"); // YYYY-MM-DD

export default function DailyExpenseBarChart({ transactions }) {
  const [days, setDays] = useState(7);
  const [selectedDate, setSelectedDate] = useState(null);

  const todayKey = getLocalDateKey(new Date());

  /* -----------------------------------
     BUILD CHART DATA
  ----------------------------------- */
  const data = useMemo(() => {
    const map = {};

    // Create last N days INCLUDING TODAY (LOCAL)
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const key = getLocalDateKey(d);
      map[key] = { date: key };

      Object.keys(CATEGORY_COLORS).forEach(cat => {
        map[key][cat] = 0;
      });
    }

    // Group transactions by LOCAL date
    transactions.forEach(tx => {
      const key = getLocalDateKey(tx.date);
      if (map[key]) {
        map[key][tx.category] += tx.amount;
      }
    });

    return Object.values(map);
  }, [transactions, days]);

  /* -----------------------------------
     CLICK HANDLER
  ----------------------------------- */
  const handleBarClick = state => {
    if (state?.activeLabel) {
      setSelectedDate(state.activeLabel);
    }
  };

  /* -----------------------------------
     SELECTED DAY TRANSACTIONS
  ----------------------------------- */
  const selectedTransactions = useMemo(() => {
    if (!selectedDate) return [];
    return transactions.filter(
      tx => getLocalDateKey(tx.date) === selectedDate
    );
  }, [transactions, selectedDate]);

  return (
    <div style={{ width: "100%", marginBottom: 40 }}>
      <h4 style={{ textAlign: "center", marginBottom: 10 }}>
        Daily Breakdown (Last {days} Days)
      </h4>

      {/* RANGE TOGGLE */}
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        {[7, 15, 30].map(d => (
          <button
            key={d}
            onClick={() => {
              setDays(d);
              setSelectedDate(null);
            }}
            style={{
              margin: "0 6px",
              padding: "6px 12px",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              background: days === d ? "#005ce6" : "#e5e7eb",
              color: days === d ? "#fff" : "#334155",
              fontWeight: 600
            }}
          >
            Last {d} days
          </button>
        ))}
      </div>

      {/* BAR CHART */}
      <div style={{ width: "100%", height: 360 }}>
        <ResponsiveContainer>
          <BarChart data={data} onClick={handleBarClick}>
            <XAxis
              dataKey="date"
              tickFormatter={d =>
                new Date(d).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric"
                })
              }
            />
            <YAxis />
            <Tooltip formatter={v => `Rs. ${v}`} />
            <Legend />

            {Object.keys(CATEGORY_COLORS).map(cat => (
              <Bar
                key={cat}
                dataKey={cat}
                stackId="a"
                fill={CATEGORY_COLORS[cat]}
                isAnimationActive={false}
                stroke={
                  data.some(d => d.date === todayKey)
                    ? "#000"
                    : "none"
                }
                opacity={1}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* TODAY LABEL */}
      <div style={{ textAlign: "center", marginTop: 8 }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#005ce6"
          }}
        >
          ● Highlighted bar = Today
        </span>
      </div>

      {/* CLICKED DAY TRANSACTIONS */}
      {selectedDate && (
        <div style={{ marginTop: 20 }}>
          <h4>
            Transactions on{" "}
            {new Date(selectedDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })}
          </h4>

          {selectedTransactions.length === 0 && (
            <p>No transactions</p>
          )}

          {selectedTransactions.map(tx => (
            <div
              key={tx._id}
              style={{
                background: "#fff",
                padding: "10px 12px",
                borderRadius: 10,
                marginBottom: 8,
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
              }}
            >
              <b>{tx.title}</b> — {tx.category} — Rs.{tx.amount}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
