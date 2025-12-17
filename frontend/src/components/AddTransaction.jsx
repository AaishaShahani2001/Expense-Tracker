import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AddTransaction({ onAdd, editTx }) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: "",
    note: ""
  });

  useEffect(() => {
    if (editTx) {
      setFormData({
        title: editTx.title,
        amount: editTx.amount,
        category: editTx.category,
        date: editTx.date?.slice(0, 10) || "",
        note: editTx.note || ""
      });
    }
  }, [editTx]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { title, amount, category, date, note } = formData;

    // Title
    if (!title.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (title.trim().length < 3) {
      toast.error("Title must be at least 3 characters");
      return false;
    }

    //  Amount
    if (!amount) {
      toast.error("Amount is required");
      return false;
    }
    if (isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount must be a positive number");
      return false;
    }

    //  Category
    if (!category) {
      toast.error("Please select a category");
      return false;
    }

    // Date
    if (!date) {
      toast.error("Date is required");
      return false;
    }

    const selectedDateKey = date;
    const todayKey = new Date().toLocaleDateString("en-CA");

    if (selectedDateKey > todayKey) {
      toast.error("Date cannot be in the future");
      return false;
    }


    //  Note (optional)
    if (note && note.length > 200) {
      toast.error("Note cannot exceed 200 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Frontend validation
    if (!validateForm()) return;

    const amount = Number(formData.amount);

    //  BALANCE CHECK (ONLY FOR EXPENSE)
    if (formData.category !== "Income") {
      try {
        const res = await fetch(
          "https://expense-tracker-backend-9lee.onrender.com/api/expenses/totals"
        );
        const totals = await res.json();

        const remainingBalance = totals.income - totals.expense;

        // Prevent overspending (new expense only)
        if (!editTx && amount > remainingBalance) {
          toast.error(
            "❌ Insufficient balance! You cannot spend more than your income."
          );
          return;
        }
      } catch (err) {
        toast.error("Failed to check balance");
        return;
      }
    }

    const url = editTx
      ? `https://expense-tracker-backend-9lee.onrender.com/api/expenses/${editTx._id}`
      : "https://expense-tracker-backend-9lee.onrender.com/api/expenses";

    const method = editTx ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        toast.error(errData.message || "Transaction failed");
        return;
      }

      const data = await res.json();
      toast.success(
        editTx ? "Transaction updated successfully" : "Transaction added successfully"
      );
      onAdd(data);
    } catch (err) {
      toast.error("Save failed");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 style={{ textAlign: "center", marginBottom: 16 }}>
        {editTx ? "Edit Transaction" : "Add Transaction"}
      </h3>

      <input
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        style={inputStyle}
      />

      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleChange}
        style={inputStyle}
      />

      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        style={inputStyle}
      >
        <option value="">Select Category</option>
        <option value="Income">Income</option>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Bills">Bills</option>
        <option value="Shopping">Shopping</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Health">Health</option>
        <option value="Other">Other</option>
      </select>

      <input
        type="date"
        name="date"
        value={formData.date}
        max={new Date().toISOString().split("T")[0]} // 🚫 future dates blocked
        onChange={handleChange}
        style={inputStyle}
      />

      <textarea
        name="note"
        placeholder="Note (optional)"
        value={formData.note}
        onChange={handleChange}
        style={{ ...inputStyle, height: 70 }}
      />

      <button style={buttonStyle}>
        {editTx ? "Update Transaction" : "Add Transaction"}
      </button>
    </form>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  marginBottom: 12,
  borderRadius: 8,
  border: "1px solid #ddd"
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: 10,
  border: "none",
  background: "#005ce6",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer"
};
