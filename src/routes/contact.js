const express = require("express");
const router = express.Router();
const db = require("../models/db");

// Show page
router.get("/contact", (req, res) => {
  res.render("contact");
});

// Save to database
router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;
  try {
    await db.query(
      "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)",
      [name, email, message]
    );
    res.send("Message sent successfully!");
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

module.exports = router;
