express = require("express");
const router = express.Router();

// some routes
router.get("/", (req, res) => {
  //Serves the body of the page aka "main.handlebars" to the container //aka "main.handlebars"
  res.render("home", { title: "my awesome app!!!!" });
});
// -----------
module.exports = router;
