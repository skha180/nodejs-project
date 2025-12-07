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
    if (!username || !email || !password) {
      return res.send("All fields are required!");
    }

    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.send("User already exists. Try another email.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Default role is "user"
    await db.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, "user"]
    );

    res.send("Registration successful! You can now <a href='/login'>login</a>.");
  } catch (err) {
    console.error(err);
    res.send("ERROR: " + err.message);
  }
});

// =========================
// LOGIN PAGE (GET)
// =========================
router.get("/login", (req, res) => {
  res.render("auth/login", { title: "Login" });
});

// =========================
// LOGIN FORM (POST)
// =========================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return res.send("No user found with this email.");

    const user = rows[0];
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.send("Incorrect password.");

    // STORE FULL SESSION
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    // Redirect based on ROLE
    if (user.role === "admin") return res.redirect("/admin");
    res.redirect("/dashboard");
  } catch (err) {
    res.send("ERROR: " + err.message);
  }
});

// =========================
// PROTECT MIDDLEWARE
// =========================
function isLoggedIn(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  next();
}

function isAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).send("Access Denied – Admins Only");
  }
  next();
}

// =========================
// DASHBOARD (Logged-in Users)
// =========================
router.get("/dashboard", isLoggedIn, (req, res) => {
  res.render("dashboard", { 
    title: "Dashboard",
    username: req.session.user.username 
  });
});

module.exports = router;
module.exports.isAdmin = isAdmin; // export middleware for admin routes
