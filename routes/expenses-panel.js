express = require("express");
const router = express.Router();
const Family = require("../models/Family");
const User = require("../models/User");
const Expense = require("../models/Expenses");
const { publicLogged, auth } = require("../middleware/verifyToken");

router.get("/", auth, async (req, res) => {
  let data = {};
  data.user = req.user;
  const users = await User.find({}).lean();
  data.users = users;
  res.render("expenses-panel", data);
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

router.get("/:id", auth, async (req, res) => {
  let data = {};
  data.user = req.user;
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
