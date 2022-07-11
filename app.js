// express setup
const express = require("express");
const app = express();
const port = 3000;

// dotenv setup
require("dotenv/config");

// bodyparser setup
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// view engine setup
const { engine } = require("express-handlebars");
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(express.static("public"));
// mongoose setup
const mongoose = require("mongoose");
try {
  mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () =>
    console.log("connected to db")
  );
} catch (err) {
  console.log(err);
}

// routes setup
homeRoute = require("./routes/home");
adminRoute = require("./routes/admin-panel");

app.use("/", homeRoute);
app.use("/admin", adminRoute);
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
