express = require("express");
const router = express.Router();
const Family = require("../models/Family");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const {
  registerValidation,
  loginValidation,
} = require("../middleware/validation");
// some routes
router.get("/", (req, res) => {
  res.render("admin-panel");
});

// ADD FAMILY MEMBERS ROUTES
router.get("/add-members", async (req, res) => {
  const families = await Family.find({}).lean();
  const error = req.query.error;
  res.render("add-members", { families, error });
});

router.post("/add-members", async (req, res) => {
  if (req.body.family == "") {
    return res.redirect("/admin/add-members" + "?error=familyNotFound");
  }
  const family = await Family.findById(req.body.family);
  // VALIDATION
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const emailExist = User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).send("Email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newUser = new User({
    name: req.body.name,
    lastName: req.body.lastName,
    email: req.body.email,
    Password: hashedPassword,
    Family: family._id,
  });
  try {
    await newUser.save();
    return res.redirect("/admin");
  } catch (err) {
    console.log(err);
    return res.redirect("/admin");
  }
});

// ADDING FAMILY
router.get("/add-family", (req, res) => {
  res.render("add-family");
});

router.post("/add-family", async (req, res) => {
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

  // VALIDATION

  data = {
    name: req.body.name,
    lastName: req.body.lastName,
    password: req.body.password,
    email: req.body.email,
    family: newFamily._id,
  };

  const { error } = registerValidation(data);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const emailExist = User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).send("Email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newUser = new User({
    name: req.body.name,
    lastName: req.body.lastName,
    email: req.body.email,
    Password: hashedPassword,
    Family: newFamily._id,
  });

  try {
    await newFamily.save();
    await newUser.save();
  } catch (err) {
    res.json({ message: err });
    return;
  }
  res.redirect("/admin");
});

// ADDING FAMILY BUDGET
router.get("/add-budget", async (req, res) => {
  const families = await Family.find({}).lean();
  res.render("add-budget", { families });
});

router.post("/add-budget", async (req, res) => {
  let data = req.body;
  data["family"] = data["family"].split(":")[0];
  data["budget"] = parseInt(data["budget"]);
  const family = await Family.findById(data.family);
  family.budget += data.budget;
  try {
    await family.save();
    return res.redirect("/admin");
  } catch (err) {
    console.log(err);
    return res.redirect("/admin");
  }
});

module.exports = router;
