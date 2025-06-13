const Expense = require("../models/Expense");

const getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ createdBy: req.user._id }).sort(
      "createdAt"
    );
    res.render("expenses", { expenses, csrfToken: req.csrfToken()});
  } catch (error) {
    next(error);
  }
};

const getNewExpenseForm = (req, res) => {
  res.render("new-expense", { csrfToken: req.csrfToken() });
};

const createExpense = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;
    await Expense.create(req.body);
    res.redirect("/expenses"); // Show updated list
  } catch (error) {
    next(error);
  }
};

const getEditExpenseForm = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
   if (!expense) {
     const error = new Error("Expense not found");
     error.statusCode = 404;
     throw error;
   }
    res.render("edit-expense", { expense, csrfToken: req.csrfToken() });
  } catch (error) {
    next(error);
  }
};


const updateExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Expense.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      throw new NotFoundError("Expense not found");
    }
    res.redirect("/expenses");
  } catch (error) {
    next(error);
  }
};


const deleteExpense = async (req, res, next) => {
  try {
    await Expense.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    res.redirect("/expenses");
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getAllExpenses,
  getNewExpenseForm,
  createExpense,
  getEditExpenseForm,
  updateExpense,
  deleteExpense,
};

