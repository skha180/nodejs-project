const express = require("express");
const router = express.Router();

router.get("/register", (req, res) => {
    res.render("auth/register", { title: "Register" });
});

// HANDLE FORM DATA NOW (next step = DB & bcrypt)
router.post("/register", (req, res) => {
    console.log(req.body);  // Just check for now
    res.send("Form Received! We will save to database later.");
});

module.exports = router;
