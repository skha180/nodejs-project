const express = require("express");
const router = express.Router();
const db = require("../models/db");
const isAdmin = require("../middleware/isAdmin");  // 🔐 PROTECT!!

// =======================
// 1. READ – Admin Panel
// =======================
router.get("/admin", isAdmin, async (req, res) => {
  try {
    const [users] = await db.query("SELECT * FROM users");
    res.render("admin", { 
      title: "Admin Panel",
      username: req.session.user.username,
      users 
    });
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

// =======================
// 2. DELETE – Remove user
// =======================
router.get("/admin/delete/:id", isAdmin, async (req, res) => {
  try {
    await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.redirect("/admin");
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

// =======================
// 3. EDIT USER (form)
// =======================
router.get("/admin/edit/:id", isAdmin, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [req.params.id]);
    res.render("editUser", { 
      title: "Edit User",
      user: rows[0]
    });
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

// =======================
// 4. UPDATE USER (POST)
// =======================
router.post("/admin/edit/:id", isAdmin, async (req, res) => {
  const { username, email, role } = req.body;
  try {
    await db.query(
      "UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?",
      [username, email, role || "user", req.params.id]
    );
    res.redirect("/admin");
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const db = require("../models/db");
const isAdmin = require("../middleware/isAdmin");  // 🔐 PROTECT!!

// =======================
// 1. READ – Admin Panel
// =======================
router.get("/admin", isAdmin, async (req, res) => {
  try {
    const [users] = await db.query("SELECT * FROM users");
    res.render("admin", { 
      title: "Admin Panel",
      username: req.session.user.username,
      users 
    });
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

// =======================
// 2. DELETE – Remove user
// =======================
router.get("/admin/delete/:id", isAdmin, async (req, res) => {
  try {
    await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.redirect("/admin");
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

// =======================
// 3. EDIT USER (form)
// =======================
router.get("/admin/edit/:id", isAdmin, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [req.params.id]);
    res.render("editUser", { 
      title: "Edit User",
      user: rows[0]
    });
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

// =======================
// 4. UPDATE USER (POST)
// =======================
router.post("/admin/edit/:id", isAdmin, async (req, res) => {
  const { username, email, role } = req.body;
  try {
    await db.query(
      "UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?",
      [username, email, role || "user", req.params.id]
    );
    res.redirect("/admin");
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

module.exports = router;
