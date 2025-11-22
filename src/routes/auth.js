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
    // 1️VALIDATION — check empty fields
    if (!username || !email || !password) {
      return res.send("All fields are required!");
    }

    // 2️ CHECK IF USER EXISTS
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.send("User already exists. Try another email.");
    }

    // 3️ HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);  // 10 = salt rounds

    // 4️ INSERT INTO DATABASE
    await db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    // 5️ SUCCESS
    res.send("Registration successful! You can now <a href='/login'>login</a>.");
  } catch (err) {
    console.error(err);
    res.send("ERROR: " + err.message);
  }
});

// logic for login

// LOGIN PAGE
router.get("/login", (req, res) => {
  res.render("auth/login", { title: "Login" });
});

// LOGIN POST
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (user.length === 0) return res.send("No user found with this email.");

    const validPass = await bcrypt.compare(password, user[0].password);
    if (!validPass) return res.send("Incorrect password.");

    // CREATE SESSION
    req.session.user = { id: user[0].id, username: user[0].username };
    res.redirect("/dashboard");
  } catch (err) {
    res.send("ERROR: " + err.message);
  }
});


// protecting dashboard

// MIDDLEWARE (protect pages)
function isLoggedIn(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}

// DASHBOARD (only after login)
router.get("/dashboard", isLoggedIn, (req, res) => {
  res.render("dashboard", { 
    title: "Dashboard",
    username: req.session.user.username 
  });
});



module.exports = router;
