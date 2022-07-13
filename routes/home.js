express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { loginValidation } = require("../middleware/validation");
const User = require("../models/User");

const router = express.Router();

router.get("/", (req, res) => {
  // show headers
  let data = {};
  let { success } = req.query;
  if (success) {
    data.success = true;
  }
  data.title = "my awesome app title";
  res.render("home", data);
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) {
    console.log(error.details[0].message);
    return res.status(400).send(error.details[0].message);
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send("Credentials are invalid."); // TODO: show message instead of 404
  }

  const validPassword = await bcrypt.compare(req.body.password, user.Password);
  if (!validPassword) {
    return res.status(404).send("Credentials are invalid."); // TODO: show message instead of 404
  }

  // doen't work
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  return res.header("auth-token", token).redirect("/");
});

module.exports = router;
