import { useEffect, useState } from "react";
import TransactionItem from "./TransactionItem";
import Modal from "./Model";
import AddTransaction from "./AddTransaction";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

export default function RecentTransactions({ refreshKey, onGlobalRefresh }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTx, setEditingTx] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://expense-tracker-backend-9lee.onrender.com/api/expenses");
      const data = await res.json();
      setTransactions(data.slice(0, 5));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await fetch(`https://expense-tracker-backend-9lee.onrender.com/api/expenses/${deleteId}`, {
        method: "DELETE"
      });
      setDeleteId(null);
      onGlobalRefresh(); //  refresh summary + recent
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [refreshKey]);

  return (
    <div>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14
        }}
      >
        <h3>Recent Transactions</h3>

        <button
          onClick={onGlobalRefresh}
          style={{
            padding: "6px 12px",
            borderRadius: 8,
            border: "none",
            background: "#A78BFA",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

      {!loading && transactions.length === 0 && (
        <p style={{ textAlign: "center" }}>No transactions yet</p>
      )}

      {transactions.map(tx => (
        <TransactionItem
          key={tx._id}
          tx={tx}
          onEdit={setEditingTx}
          onDelete={() => setDeleteId(tx._id)} //  open confirm modal
        />
      ))}

      {/* EDIT MODAL */}
      {editingTx && (
        <Modal open={true} onClose={() => setEditingTx(null)}>
          <AddTransaction
            editTx={editingTx}
            onAdd={() => {
              onGlobalRefresh();
              setEditingTx(null);
            }}
          />
        </Modal>
      )}

      {/* DELETE CONFIRM MODAL */}
      <ConfirmDeleteModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
