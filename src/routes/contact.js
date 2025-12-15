const express = require("express");
const router = express.Router();
const { readMessages, writeMessages } = require("../models/dataHandler");

// =======================
// CONTACT PAGE (GET)
// =======================
router.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact" });
});

// =======================
// SAVE MESSAGE (POST)
// =======================
router.post("/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.send("All fields are required!");
  }

  const messages = readMessages();

  messages.push({
    id: Date.now(),
    name,
    email,
    message,
    created_at: new Date().toISOString()
  });

  writeMessages(messages);

  res.send("✅ Message sent successfully!");
});

module.exports = router;
