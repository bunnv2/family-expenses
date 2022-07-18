express = require("express");
const router = express.Router();
const Family = require("../models/Family");
const User = require("../models/User");
const Expense = require("../models/Expenses");
const { auth } = require("../middleware/verifyToken");

router.get("/", auth, async (req, res) => {
  let data = {};
  const user = req.user;
  if (req.user.isAdmin) return res.redirect("/");
  data.user = req.user;
  data.family = await Family.findById(user.Family).lean();
  data.cantSpend = false;
  if (req.query.cantSpend == "false") {
    data.cantSpend = true;
  }
  data.expenses = await Expense.find({ user: user._id }).lean();
  const family = await Family.findById(user.Family);
  const familyMembers = await User.find({ Family: family._id }).lean();
  const familyExpenses = [];
  for (let i = 0; i < familyMembers.length; i++) {
    let memberExpenses = await Expense.find({
      user: familyMembers[i]._id,
    }).lean();

    for (let j = 0; j < memberExpenses.length; j++) {
      memberExpenses[j].user = familyMembers[i].name;
    }

    familyExpenses.push(...memberExpenses);
  }
  data.familyExpenses = familyExpenses;
  res.render("your-expenses", data);
});

router.post("/", auth, async (req, res) => {
  const user = req.user;
  if (req.user.isAdmin) return res.redirect("/");
  let family = await Family.findById(user.Family);
  if (!family.budget || family.budget - req.body.expenseAmount < 0) {
    res.redirect(`/expenses?cantSpend=${false}`);
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
      return res.redirect(`/expenses`);
    } catch (err) {
      console.log(err);
      return res.redirect(`/expenses`);
    }
  }
});

module.exports = router;
