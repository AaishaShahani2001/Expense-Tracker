import express from "express";
import {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense
} from "../controllers/expenseController.js";

import { getTotals } from "../controllers/expenseController.js";

const router = express.Router();

router.post("/", addExpense);        // POST /api/expenses
router.get("/", getExpenses);        // GET /api/expenses
router.put("/:id", updateExpense);   // PUT /api/expenses/:id
router.delete("/:id", deleteExpense);// DELETE /api/expenses/:id

router.get("/totals", getTotals);

export default router;
