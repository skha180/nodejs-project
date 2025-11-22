const express = require("express");
const router = express.Router();
const db = require("../models/db");

router.get("/create-messages-table", async (req, res) => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    res.send("Messages table created.");
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

module.exports = router;
