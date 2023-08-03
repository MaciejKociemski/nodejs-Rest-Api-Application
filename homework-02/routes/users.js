const express = require("express");
const router = express.Router();

const users = [
  { id: "1", username: "Felix", surname: "Brown", email: "felix@test.com" },
  { id: "2", username: "Sonya", surname: "Redhead", email: "sonya@test.com" },
  { id: "3", username: "Conan", surname: "Barbarian", email: "conan@test.com" },
];

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.json(users);
});

router.get("/:id", (req, res, next) => {
  const { id } = req.params;
  const user = users.filter((us) => us.id === id);
  res.status(404).json(user);
});

module.exports = router;
