import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Income", 
        "Food",
        "Transport",
        "Bills",
        "Shopping",
        "Entertainment",
        "Health",
        "Other"
      ]
    },
    date: {
      type: Date,
      required: true
    },
    note: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);
