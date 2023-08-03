const express = require("express");
const router = express.Router();
require('dotenv').config

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  res.render("response", { title: "You are logged in", email, password });
});

module.exports = router;
