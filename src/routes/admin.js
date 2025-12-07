const express = require("express");
const router = express.Router();
const db = require("../models/db");
const isAdmin = require("../middleware/isAdmin");

// Admin Dashboard
router.get("/admin", isAdmin, async (req, res) => {
  try {
    // fetch users
    const [rows, fields] = await db.query("SELECT * FROM users");
    console.log("DEBUG: users fetched:", rows);

    // render admin view
    res.render("admin", {
      title: "Admin Panel",
      username: req.session.user?.username || "Admin",
      users: rows // must be rows
    });

  } catch (err) {
    console.error("ERROR:", err);
    res.send("Server error: " + err.message);
  }
});

// Delete user
router.get("/admin/delete/:id", isAdmin, async (req, res) => {
  try {
    await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.redirect("/admin");
  } catch (err) {
    console.error("ERROR:", err);
    res.send("Server error: " + err.message);
  }
});

// Edit user form
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

// Update user (POST)
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
