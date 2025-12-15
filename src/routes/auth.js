const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../models/dataHandler");

// =========================
// REGISTER PAGE (GET)
router.get("/register", (req, res) => {
  res.render("auth/register", { title: "Register" });
});

// REGISTER FORM (POST)
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) return res.send("All fields are required!");

    await registerUser({ username, email, password });
    res.send("Registration successful! You can now <a href='/login'>login</a>.");
  } catch (err) {
    res.send("ERROR: " + err.message);
  }
});

// LOGIN PAGE (GET)
router.get("/login", (req, res) => {
  res.render("auth/login", { title: "Login" });
});

// LOGIN FORM (POST)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await loginUser({ email, password });

    // STORE SESSION
    req.session.user = { id: user.id, username: user.username, role: user.role };

    if (user.role === "admin") return res.redirect("/admin");
    res.redirect("/dashboard");
  } catch (err) {
    res.send("ERROR: " + err.message);
  }
});

// PROTECT MIDDLEWARE
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

// DASHBOARD
router.get("/dashboard", isLoggedIn, (req, res) => {
  res.render("dashboard", { title: "Dashboard", username: req.session.user.username });
});

module.exports = router;
module.exports.isAdmin = isAdmin;
