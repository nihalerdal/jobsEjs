const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      maxlength: 100,
    },
    amount: {
      type: Number,
      required: [true, "Please provide an amount"],
    },
    date: {
      type: Date,
    },

    description: {
      type: String,
      maxlength: 500,
    },

    mainCategory: {
      type: String,
      enum: [
        "Housing",
        "Transportation",
        "Food",
        "Health",
        "Entertainment",
        "Education",
        "Utilities",
        "Personal",
        "Other",
      ],
      required: [true, "Please provide a subcategory"],
    },
    subCategory: {
      type: String,
      enum: [
        "Rent",
        "Mortgage",
        "Fuel",
        "Car Insurance",
        "Car Maintenance",
        "Groceries",
        "Dining Out",
        "Medical Expenses",
        "Health Insurance",
        "Movies",
        "Concerts",
        "Books",
        "Tuition",
        "Internet",
        "Electricity",
        "Water",
        "Haircut",
        "Clothing",
        "Gifts",
        "Donations",
        "Travel",
        "Hotel",
        "Flights",
        "Gym",
        "Vet",
        "Pet Food",
        "Cosmetics",
        "Other",
      ],
      required: [true, "Please provide a subcategory"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", ExpenseSchema);
