export default function TransactionItem({ tx, onEdit, onDelete }) {
  const isIncome = tx.category === "Income";

  const displayDate = new Date(tx.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div
      style={{
        background: "#fff",
        padding: "12px 14px",
        borderRadius: "14px",
        marginBottom: "12px",
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

      {/* ACTION BUTTONS */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 10,
          justifyContent: "flex-end"
        }}
      >
        <button
          onClick={() => onEdit(tx)}
          style={editBtn}
        >
          Edit
        </button>

        <button
          onClick={onDelete}
          style={deleteBtn}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

const editBtn = {
  padding: "6px 12px",
  borderRadius: "8px",
  border: "1px solid #005ce6",
  background: "#fff",
  color: "#005ce6",
  fontSize: "13px",
  cursor: "pointer"
};

const deleteBtn = {
  padding: "6px 12px",
  borderRadius: "8px",
  border: "none",
  background: "#dc2626",
  color: "#fff",
  fontSize: "13px",
  cursor: "pointer"
};
