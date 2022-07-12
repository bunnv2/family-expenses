express = require("express");
const router = express.Router();
const Family = require("../models/Family");
const Person = require("../models/Person");
const Expense = require("../models/Expenses");

router.get("/", async (req, res) => {
  const people = await Person.find({}).lean();
  res.render("expenses-panel", { people });
});

router.post("/", async (req, res) => {
  const person = await Person.findById(req.body.people);
  res.redirect(`/expenses/${person._id}`);
});

router.post("/:id", async (req, res) => {
  const person = await Person.findById(req.params.id);
  let family = await Family.findById(person.Family);
  if (!family.budget || family.budget - req.body.expenseAmount < 0) {
    res.redirect(`/expenses/${person._id}?cantSpend=${false}`);
  } else {
    const newExpense = new Expense({
      name: req.body.expenseName,
      cost: req.body.expenseAmount,
      date: Date.now(),
      person: person._id,
    });
    family.budget -= req.body.expenseAmount;
    try {
      await family.save();
      await newExpense.save();
      return res.redirect(`/expenses/${person._id}`);
    } catch (err) {
      console.log(err);
      return res.redirect(`/expenses/${person._id}`);
    }
  }
});

router.get("/:id", async (req, res) => {
  const data = {};
  if (req.params.id == "...") return res.redirect("/expenses");

  const person = await Person.findById(req.params.id).lean();
  data.person = person;
  data.family = await Family.findById(person.Family).lean();
  data.cantSpend = false;
  if (req.query.cantSpend == "false") {
    data.cantSpend = true;
  }
  data.expenses = await Expense.find({ person: person._id }).lean();
  res.render("your-expenses", data);
});

module.exports = router;
