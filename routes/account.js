express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/User");
const Family = require("../models/Family");
const {
  registerAccValidation,
  registerValidation,
} = require("../middleware/validation");

router.get("/", (req, res) => {
  res.render("register");
});

// REGISTER NEW USER

router.get("/user", async (req, res) => {
  const families = await Family.find({}).lean();
  res.render("register-user", { families });
});

router.post("/user", async (req, res) => {
  let { name, lastName, email, password, family } = req.body;

  if (family == "new") {
    family = new Family({
      name: req.body.lastName,
    });
  } else {
    family = await Family.findById(family);
  }
  const { error } = registerValidation(req.body);
  if (error) {
    console.log(error.details[0].message);
    return res.status(400).send(error.details[0].message);
  }

  console.log(email);
  // check if email exist
  const emailExist = await User.findOne({ email: email });
  if (emailExist) {
    return res.status(400).send("Email already exists");
  }

  const user = new User({
    name: name,
    lastName: lastName,
    Password: password,
    email: email,
    Family: family._id,
  });
  try {
    const salt = await bcrypt.genSalt(10);
    user.Password = await bcrypt.hash(password, salt);
    await family.save();
    await user.save();
    res.redirect("/" + "?success=true");
  } catch (err) {
    console.log(err);
    res.redirect("/" + "?success=false");
  }
});

// REGISTER NEW ADMIN

router.get("/admin", (req, res) => {
  res.render("register-admin");
});

router.post("/admin", async (req, res) => {
  if (req.body.isAdmin) req.body.isAdmin = true;
  const { error } = registerAccValidation(req.body);
  if (error) {
    console.log(error.details[0].message);
    return res.status(400).send(error.details[0].message);
  }

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).send("Email already exists");
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    lastName: req.body.lastName,
    email: req.body.email,
    Password: hashedPassword,
    isAdmin: req.body.isAdmin,
  });

  try {
    await user.save();
    res.redirect("/" + "?success=" + "true");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

module.exports = router;
