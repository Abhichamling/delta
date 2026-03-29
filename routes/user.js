const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { isLoggedIn } = require("../middleware");

// Signup form
router.get("/signup", (req, res) => {
  res.render("users/signup");
});

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;
    const user = new User({ fullname, username, email });
    const registeredUser = await User.register(user, password);
    
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", `Welcome to Sirjanasizzu, ${fullname || username}!`);
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
});

// Login form
router.get("/login", (req, res) => {
  res.render("users/login");
});

// Login
router.post("/login", passport.authenticate("local", { 
  failureRedirect: "/login", 
  failureFlash: true 
}), (req, res) => {
  req.flash("success", `Welcome back, ${req.user.fullname || req.user.username}!`);
  res.redirect("/listings");
});

// Logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) { return next(err); }
    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
});

module.exports = router;