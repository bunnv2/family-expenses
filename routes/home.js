express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { publicLogged } = require("../middleware/verifyToken");
const { loginValidation } = require("../middleware/validation");
const User = require("../models/User");

const router = express.Router();

router.get("/", publicLogged, (req, res) => {
  let data = {};
  data.user = req.user;
  let { success } = req.query;
  if (success) {
    data.success = true;
  }
  res.render("home", data);
});

router.get("/login", publicLogged, (req, res) => {
  let data = {};
  data.user = req.user;
  if (req.user) return res.redirect("/");
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

  const payload = user.toJSON();
  const token = jwt.sign(payload, process.env.TOKEN_SECRET);

  res
    .cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 2,
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    })
    .redirect("/");
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;
