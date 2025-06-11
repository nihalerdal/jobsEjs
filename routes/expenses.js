const express = require("express");
const router = express.Router();
const expensesController = require("../controllers/expenses");
const auth = require("../middleware/auth");

router.get("/", auth, expensesController.getAllExpenses);
router.get("/new", auth, expensesController.getNewExpenseForm);
router.post("/", auth, expensesController.createExpense);
router.get("/edit/:id", auth, expensesController.getEditExpenseForm);
router.post("/update/:id", auth, expensesController.updateExpense);
router.post("/delete/:id", auth, expensesController.deleteExpense);

module.exports = router;
