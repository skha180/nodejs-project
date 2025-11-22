const express = require("express");
const router = express.Router();
const db = require("../models/db");
const bcrypt = require("bcrypt");

// ONE-TIME ROUTE to create admin
router.get("/make-admin", async (req, res) => {
  try {
    const adminEmail = "admin@gmail.com";
    const adminPassword = "admin123"; // Change it later!

    // Check if admin exists
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [adminEmail]);
    if (existing.length > 0) {
      return res.send("Admin already exists!");
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await db.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'admin')",
      ["Admin", adminEmail, hashedPassword]
    );

    res.send("Admin created! Use email: admin@gmail.com & password: admin123");
  } catch (err) {
    res.send("ERROR: " + err.message);
  }
});

module.exports = router;
