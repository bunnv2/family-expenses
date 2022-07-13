express = require("express");
const router = express.Router();
const Family = require("../models/Family");
const User = require("../models/User");
const Expense = require("../models/Expenses");

router.get("/", async (req, res) => {
  const users = await User.find({}).lean();
  res.render("expenses-panel", { users });
});

router.post("/", async (req, res) => {
  const user = await User.findById(req.body.user);
  res.redirect(`/expenses/${user._id}`);
});

router.post("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  let family = await Family.findById(user.Family);
  if (!family.budget || family.budget - req.body.expenseAmount < 0) {
    res.redirect(`/expenses/${user._id}?cantSpend=${false}`);
  } else {
    const newExpense = new Expense({
      name: req.body.expenseName,
      cost: req.body.expenseAmount,
      date: Date.now(),
      user: user._id,
    });
    family.budget -= req.body.expenseAmount;
    try {
      await family.save();
      await newExpense.save();
      return res.redirect(`/expenses/${user._id}`);
    } catch (err) {
      console.log(err);
      return res.redirect(`/expenses/${user._id}`);
    }
  }
});

router.get("/:id", async (req, res) => {
  const data = {};
  if (req.params.id == "...") return res.redirect("/expenses");

  const user = await User.findById(req.params.id).lean();
  data.user = user;
  data.family = await Family.findById(user.Family).lean();
  data.cantSpend = false;
  if (req.query.cantSpend == "false") {
    data.cantSpend = true;
  }
  data.expenses = await Expense.find({ user: user._id }).lean();
  res.render("your-expenses", data);
});

module.exports = router;
