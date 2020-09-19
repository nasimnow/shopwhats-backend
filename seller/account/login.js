const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", (req, res) => {
  res.render("login.ejs");
});

router.post("/", (req, res) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({
        status: false,
        login: false,
        error: { message: "Check your credentials", code: 101 },
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res
        .status(201)
        .json({ status: true, login: true, data: req.user[0] });
    });
  })(req, res);
});

module.exports = router;
