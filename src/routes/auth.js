const express = require("express");
const router = express.Router();
const db = require("../models/db");

// ========== REGISTER PAGE ==========
router.get("/register", (req, res) => {
  res.render("auth/register", { title: "Register" });
});

// ========== REGISTER POST (SIMPLE FOR NOW) ==========
router.post("/register", async (req, res) => {
  res.send("Received register form. We'll save to database next.");
});

// ========== TEST DB ROUTE ==========
router.get("/dbtest", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    res.send("DB Connected! Result = " + rows[0].result);
  } catch (err) {
    res.send("DB ERROR: " + err.message);
  }
});

module.exports = router;
