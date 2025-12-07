const express = require("express");
const router = express.Router();
const db = require("../models/db");
const { isAdmin } = require("./auth"); // middleware from auth.js

// =======================
// Admin Dashboard (Users + Messages)
// =======================
router.get("/admin", isAdmin, async (req, res) => {
  try {
    // Fetch all users
    const [users] = await db.query("SELECT * FROM users");

    // Fetch all messages
    const [messages] = await db.query("SELECT * FROM messages ORDER BY created_at DESC");

    res.render("admin", {
      title: "Admin Panel",
      username: req.session.user?.username || "Admin",
      users,
      messages
    });
  } catch (err) {
    console.error("ERROR:", err);
    res.send("Server error: " + err.message);
  }
});

// =======================
// DELETE USER
// =======================
router.get("/admin/delete/:id", isAdmin, async (req, res) => {
  try {
    await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.redirect("/admin");
  } catch (err) {
    console.error("ERROR:", err);
    res.send("Server error: " + err.message);
  }
});

// =======================
// EDIT USER FORM
// =======================
router.get("/admin/edit/:id", isAdmin, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [req.params.id]);
    if (!rows[0]) return res.send("User not found");
    res.render("editUser", { title: "Edit User", user: rows[0] });
  } catch (err) {
    console.error("ERROR:", err);
    res.send("Server error: " + err.message);
  }
});

// =======================
// UPDATE USER (POST)
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
    console.error("ERROR:", err);
    res.send("Server error: " + err.message);
  }
});

module.exports = router;
