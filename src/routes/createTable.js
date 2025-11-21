const express = require("express");
const router = express.Router();
const db = require("../models/db");

// CREATE USERS TABLE FROM A ROUTE
router.get("/create-table", async (req, res) => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('visitor', 'registered', 'admin') DEFAULT 'registered',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    res.send("Users table created successfully!");
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

module.exports = router;
