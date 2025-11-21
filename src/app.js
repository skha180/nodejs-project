const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();   // 👉 APP MUST BE CREATED FIRST

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files (public folder)
app.use(express.static(path.join(__dirname, '../public')));

// 👉 ROUTES MUST BE ADDED *AFTER* APP IS CREATED
const authRoutes = require("./routes/auth");
app.use("/", authRoutes);

// Home route
app.get('/', (req, res) => {
    res.render('home');
});

module.exports = app;
