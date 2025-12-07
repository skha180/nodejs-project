// All required imports
const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware to parse requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// (Optional) For production security
// const helmet = require("helmet");
// app.use(helmet());

// =====================
// SESSION SETUP
// =====================
app.use(session({
  secret: process.env.SESSION_SECRET || 'mysecretkey',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// =====================
// EJS & Static Files
// =====================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // views folder inside src/
app.use(express.static(path.join(__dirname, '../public'))); // public folder outside src

// =====================
// ROUTES
// =====================

// AUTH ROUTES (login, register)
const authRoutes = require("./routes/auth");
app.use("/", authRoutes);

// HOME ROUTE
app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

// CONTACT (CRUD user side)
const contactRoute = require("./routes/contact");
app.use("/", contactRoute);

// DB TEST ROUTE
const dbtestRoute = require("./routes/dbtest");
app.use("/", dbtestRoute);

// ADMIN ROUTES (after auth)
const adminRoutes = require("./routes/admin");
app.use("/", adminRoutes);

// =====================
// ONE-TIME SETUP ROUTES
// =====================
/*
const createTableRoute = require("./routes/createTable");
app.use("/", createTableRoute);

const createMessagesTable = require("./routes/createMessagesTable");
app.use("/", createMessagesTable);

const roleRoute = require("./routes/addRoleColumn");
app.use("/", roleRoute);

const makeAdminRoute = require("./routes/makeAdmin");
app.use("/", makeAdminRoute);
*/

// =====================
// GLOBAL ERROR HANDLER
// =====================
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).send("Server Error: " + err.message);
});

// =====================
// EXPORT APP
// =====================
module.exports = app;
