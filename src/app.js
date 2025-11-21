// All required imports
const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false
}));

// EJS & static folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '../public')));

// ROUTES (very important)
const authRoutes = require("./routes/auth");
app.use("/", authRoutes);

// HOME ROUTE
app.get("/", (req, res) => {
    res.render("home");
});


// ⚠️ PUT THIS AT THE BOTTOM — GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.send("Error: " + err.message);
});

// EXPORT APP
module.exports = app;
