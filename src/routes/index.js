const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

const passport = require("passport");
const initializePassport = require("../passport-config");
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

const users = [];

// create application/json parser
const jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/home");
});

router.get("/home", (req, res) => {
  res.render("home");
});

router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login");
});

router.get("/signup", checkNotAuthenticated, (req, res) => {
  res.render("signup");
});

router.post("/signup", urlencodedParser, checkNotAuthenticated, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    users.push({
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
    });
    console.log(users);
    res.redirect("/login");
  } catch (e) {
    console.log(e);
    res.redirect("/signup");
  }
});

router.post(
  "/login",
  urlencodedParser,
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.get("/aboutus", checkAuthenticated, (req, res) => {
  res.render("aboutus");
});

router.get("/contactus", checkAuthenticated, (req, res) => {
  res.render("contactus");
});

router.post('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
});

router.get("*", (req, res) => {
  res.render("404");
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/");
  }
  next();
}

module.exports = router;
