const express = require("express");
const router = express.Router();
const db = require("../models/db");
const bcrypt = require("bcrypt");

// =========================
// REGISTER PAGE (GET)
// =========================
router.get("/register", (req, res) => {
  res.render("auth/register", { title: "Register" });
});

// =========================
// REGISTER FORM (POST)
// =========================
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 1️⃣ VALIDATION — check empty fields
    if (!username || !email || !password) {
      return res.send("All fields are required!");
    }

    // 2️⃣ CHECK IF USER EXISTS
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.send("User already exists. Try another email.");
    }

    // 3️⃣ HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);  // 10 = salt rounds

    // 4️⃣ INSERT INTO DATABASE
    await db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    // 5️⃣ SUCCESS
    res.send("Registration successful! You can now <a href='/login'>login</a>.");
  } catch (err) {
    console.error(err);
    res.send("ERROR: " + err.message);
  }
});

module.exports = router;
