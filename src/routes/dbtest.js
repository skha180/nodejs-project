const express = require("express");
const router = express.Router();
const db = require("../models/db");

// TEST DATABASE CONNECTION
router.get("/dbtest", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    res.send("DB Connected! Result = " + rows[0].result);
  } catch (err) {
    console.error(err);
    res.send("DB ERROR: " + err.message);
  }
});

module.exports = router;
