express = require("express");
const router = express.Router();
const Family = require("../models/Family");
const Person = require("../models/Person");

// some routes
router.get("/", (req, res) => {
  res.render("admin-panel");
});

// ADD FAMILY MEMBERS ROUTES
router.get("/add-members", (req, res) => {
  const families = Family.find({})
    .lean()
    .then((families) => {
      res.render("add-members", { families });
    });
});

router.post("/add-members", async (req, res) => {
  console.log(req.body);
  const family = await Family.findById(req.body.family);
  const newPerson = new Person({
    name: req.body.name,
    lastName: req.body.lastName,
    Family: family._id,
  });
  try {
    await newPerson.save();
    return res.redirect("/admin");
  } catch (err) {
    console.log(err);
    return res.redirect("/admin");
  }
});
// ADDING FAMILY ROUTES
router.get("/add-family", (req, res) => {
  res.render("add-family");
});
router.post("/add-family", async (req, res) => {
  //add family to db
  if (req.body.budget < 0) {
    console.log("budget cannot be negative");
    console.log(req.body.budget);
    return res.render("add-family", {
      message: "Budget cannot be negative",
    });
  }
  const newFamily = new Family({
    name: req.body.lastName,
    budget: req.body.budget,
  });

  const newPerson = new Person({
    name: req.body.name,
    lastName: req.body.lastName,
    Family: newFamily._id,
  });

  try {
    await newFamily.save();
    await newPerson.save();
  } catch (err) {
    res.json({ message: err });
    return;
  }
  res.redirect("/admin");
});
module.exports = router;
