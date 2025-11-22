// All required imports
const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// (Recommended) Use for production security
// const helmet = require("helmet");
// app.use(helmet());

app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: false,
  // store: new MySQLStore(...) // can be added later
}));

// EJS & static folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '../public')));

// ===================
// ROUTES
// ===================

// AUTH ROUTES (must be first)
const authRoutes = require("./routes/auth");
app.use("/", authRoutes);

// HOME ROUTE
app.get("/", (req, res) => {
  res.render("home");
});

// DB TEST ROUTE
const dbtestRoute = require("./routes/dbtest");
app.use("/", dbtestRoute);

// CONTACT (CRUD - user side)
const contactRoute = require("./routes/contact");
app.use("/", contactRoute);

// ADMIN (must come after contact + auth)
const adminRoute = require("./routes/admin");
app.use("/", adminRoute);

// ========== ONE-TIME ROUTES ==========
// ⚠️ USE ONLY ONCE then REMOVE from app.js!
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
// ====================================

// ⚠️ GLOBAL ERROR HANDLER (ONLY ONCE!)
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).send("Server Error: " + err.message);
});

// EXPORT APP
module.exports = app;
