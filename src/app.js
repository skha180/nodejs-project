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

const dbtestRoute = require("./routes/dbtest");
app.use("/", dbtestRoute);

const createTableRoute = require("./routes/createTable");  // ✔ ONLY ONCE
app.use("/", createTableRoute);

// HOME ROUTE
app.get("/", (req, res) => {
    res.render("home");
});

// ⚠️ GLOBAL ERROR HANDLER (MUST BE AT BOTTOM)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.send("Error: " + err.message);
});

app.use((err, req, res, next) => {
  console.error("EJS ERROR in file:", err);
  res.send("EJS ERROR: " + err.message);
});


// EXPORT APP
module.exports = app;
