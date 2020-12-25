const express = require("express");
const path = require("path");
const hbs = require("hbs");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const flash = require("express-flash");
const bcrypt = require("bcrypt");
const router = require("./routes/index");
const app = express();
const port = 3000;

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../templates/views"));
hbs.registerPartials(path.join(__dirname, "../templates/partials"));
app.use(express.static(path.join(__dirname, "../public")));

app.use(passport.initialize());
app.use(passport.session());
app.use(
  session({
    secret: "session_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

app.use("/", router);

app.use(function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = res.user;
    res.locals.authenticated = true;
  } else {
    res.locals.authenticated = false;
  }
  next();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
