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

// ROUTES 
const authRoutes = require("./routes/auth");
app.use("/", authRoutes);

const dbtestRoute = require("./routes/dbtest");
app.use("/", dbtestRoute);

const createTableRoute = require("./routes/createTable");  // i used this only once to create table in db 
app.use("/", createTableRoute);

// HOME ROUTE
app.get("/", (req, res) => {
    res.render("home");
});

const contactRoute = require("./routes/contact");
const adminRoute = require("./routes/admin");
const createMessagesTable = require("./routes/createMessagesTable");

app.use("/", contactRoute);
app.use("/", adminRoute);
app.use("/", createMessagesTable);


const roleRoute = require("./routes/addRoleColumn");
app.use("/", roleRoute);

const makeAdminRoute = require("./routes/makeAdmin");
app.use("/", makeAdminRoute);


//  GLOBAL ERROR HANDLER
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
