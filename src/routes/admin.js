const express = require("express");
const router = express.Router();
const db = require("../models/db"); // Make sure db.js is correct
const isAdmin = require("../middleware/isAdmin");


// 📌 1. READ – Show all users
router.get("/admin", async (req, res) => {
  try {
    const [users] = await db.query("SELECT * FROM users");
    res.render("admin", { users });
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

// 📌 2. DELETE – Remove user
router.get("/admin/delete/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.redirect("/admin");
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

//  3. EDIT – Load form
router.get("/admin/edit/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [req.params.id]);
    res.render("editUser", { user: rows[0] });
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

//  4. UPDATE – Save changes
router.post("/admin/edit/:id", async (req, res) => {
  const { username, email } = req.body;
  try {
    await db.query(
      "UPDATE users SET username = ?, email = ? WHERE id = ?",
      [username, email, req.params.id]
    );
    res.redirect("/admin");
  } catch (err) {
    res.send("Error: " + err.message);
  }
});

module.exports = router;










