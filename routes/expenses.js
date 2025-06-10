const express = require("express");
const router = express.Router();
const expensesController = require("../controllers/expenses");

// Display all expenses
router.get("/", expensesController.getAllExpenses);

// Show form to add a new expense
router.get("/new", expensesController.getNewExpenseForm);

// Create a new expense
router.post("/", expensesController.createExpense);

// Show form to edit an existing expense
router.get("/edit/:id", expensesController.getEditExpenseForm);

// Update an existing expense
router.post("/update/:id", expensesController.updateExpense);

// Delete an expense
router.post("/delete/:id", expensesController.deleteExpense);

module.exports = router;
