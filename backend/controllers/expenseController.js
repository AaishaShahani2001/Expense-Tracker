import Expense from "../models/Expense.js";

/* --------------------------------------------------
    ADD EXPENSE / INCOME (WITH VALIDATION)
-------------------------------------------------- */
export const addExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    //  BASIC FIELD VALIDATION
    if (!title || !amount || !category || !date) {
      return res.status(400).json({
        message: "Title, amount, category and date are required"
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than zero"
      });
    }

    // INCOME LIMIT CHECK (ONLY FOR EXPENSE)
    if (category !== "Income") {
      const expenses = await Expense.find();

      let totalIncome = 0;
      let totalExpense = 0;

      expenses.forEach(item => {
        if (item.category === "Income") {
          totalIncome += item.amount;
        } else {
          totalExpense += item.amount;
        }
      });

      if (totalExpense + amount > totalIncome) {
        return res.status(400).json({
          message: "Insufficient balance. Expense exceeds total income."
        });
      }
    }

    const newExpense = await Expense.create(req.body);
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* --------------------------------------------------
    GET ALL EXPENSES
-------------------------------------------------- */
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* --------------------------------------------------
    UPDATE EXPENSE (SAFE EDIT)
-------------------------------------------------- */
export const updateExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    const { id } = req.params;

    if (!title || !amount || !category || !date) {
      return res.status(400).json({
        message: "All fields except note are required"
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than zero"
      });
    }

    const existingExpense = await Expense.findById(id);
    if (!existingExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    //  CHECK BALANCE AGAIN (EXCLUDING CURRENT EXPENSE)
    if (category !== "Income") {
      const expenses = await Expense.find({ _id: { $ne: id } });

      let totalIncome = 0;
      let totalExpense = 0;

      expenses.forEach(item => {
        if (item.category === "Income") {
          totalIncome += item.amount;
        } else {
          totalExpense += item.amount;
        }
      });

      if (totalExpense + amount > totalIncome) {
        return res.status(400).json({
          message: "Insufficient balance for this update"
        });
      }
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json(updatedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* --------------------------------------------------
    DELETE EXPENSE
-------------------------------------------------- */
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* --------------------------------------------------
   GET TOTALS
-------------------------------------------------- */
export const getTotals = async (req, res) => {
  try {
    const expenses = await Expense.find();

    let income = 0;
    let expense = 0;

    expenses.forEach(item => {
      if (item.category === "Income") {
        income += item.amount;
      } else {
        expense += item.amount;
      }
    });

    res.json({
      income,
      expense,
      balance: income - expense
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
