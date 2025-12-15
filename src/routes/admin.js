const express = require("express");
const router = express.Router();
const { readUsers, deleteUser, readMessages, deleteMessage } = require("../models/dataHandler");
const { isAdmin } = require("./auth"); // middleware from auth.js

// =======================
// Admin Dashboard (Users + Messages)
// =======================
router.get("/admin", isAdmin, async (req, res) => {
  try {
    // Fetch all users
    const users = readUsers();

    // Fetch all messages
    const messages = readMessages();

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
    // Remove user from users.txt
    const users = readUsers();
    const updatedUsers = users.filter(user => user.id !== parseInt(req.params.id));
    writeUsers(updatedUsers);
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
    const users = readUsers();
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.send("User not found");
    res.render("editUser", { title: "Edit User", user });
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
    const users = readUsers();
    const updatedUsers = users.map(user => {
      if (user.id === parseInt(req.params.id)) {
        return { ...user, username, email, role: role || "user" };
      }
      return user;
    });
    writeUsers(updatedUsers);
    res.redirect("/admin");
  } catch (err) {
    console.error("ERROR:", err);
    res.send("Server error: " + err.message);
  }
});

// =======================
// DELETE MESSAGE
// =======================
router.get("/admin/delete/message/:id", isAdmin, (req, res) => {
  try {
    deleteMessage(req.params.id);
    res.redirect("/admin");
  } catch (err) {
    console.error("ERROR:", err);
    res.send("Server error: " + err.message);
  }
});

module.exports = router;
