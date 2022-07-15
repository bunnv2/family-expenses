const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).redirect("/login");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded;
    req.headers.user = decoded;
    next();
  } catch (err) {
    return res.status(401).redirect("/login");
  }
}

function publicLogged(req, res, next) {
  const token = req.cookies.token;
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded;
    req.headers.user = decoded;
    next();
  } catch (err) {
    next();
  }
}

module.exports = { auth, publicLogged };
