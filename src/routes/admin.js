const express = require("express");
const router = express.Router();
const db = require("../models/db");

router.get("/admin", async (req, res) => {
  try {
    const [users] = await db.query("SELECT id, username, email FROM users");
    res.render("admin", { users });
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

module.exports = router;
