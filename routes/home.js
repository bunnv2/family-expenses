express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  let data = {};
  let { success } = req.query;
  if (success) {
    data.success = true;
  }
  data.title = "my awesome app title";
  res.render("home", data);
});

module.exports = router;
