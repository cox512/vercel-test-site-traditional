const router = require("express").Router();
const passport = require("passport");
const genPassword = require("../lib/passwordUtils").genPassword;
const User = require("../config/database.js");
// const User = connection.models.User;
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

function validateHash(user_id, SECRET) {
  const user_hash = crypto
    .createHmac("sha256", SECRET)
    .update(user_id)
    .digest("hex");

  return user_hash;
}

/**
 * -------------- POST ROUTES ----------------
 */

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login-failure",
    successRedirect: "/login-success",
  })
);

router.post("/register", async (req, res, next) => {
  const saltHash = genPassword(req.body.pw);

  const salt = saltHash.salt;
  const hash = saltHash.hash;
  const user_id = uuidv4();
  const company_id = uuidv4();
  const user_hash = await validateHash(user_id, process.env.SECRET);

  console.log("user_hash:", user_hash);

  
  const newUser = new User({
    username: req.body.uname,
    hash: hash,
    salt: salt,
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    userId: user_id,
    userHash: user_hash,
    companyName: req.body.company,
    companyId: company_id,
    createdAt: new Date(),
  });

  const makeUser = await User.create(newUser);

  console.log("makeUser:", makeUser);

  res.redirect("/login");
});

/**
 * -------------- GET ROUTES ----------------
 */

router.get("/", (req, res, next) => {
  res.render("landing.ejs", {
    currentUser: req.user,
  });
});

router.get("/login", (req, res, next) => {
  res.render("login.ejs", {
    currentUser: req.user,
  });
});

router.get("/register", (req, res, next) => {
  res.render("register.ejs", {
    currentUser: req.user,
  });
});

/**
 * Lookup how to authenticate users on routes with Local Strategy
 * Google Search: "How to use Express Passport Local Strategy"
 *
 * Also, look up what behaviour express session has without a maxage set
 */
router.get("/protected-route", (req, res, next) => {
  // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
  if (req.isAuthenticated()) {
    res.render("protected-route-success.ejs", {
      currentUser: req.user,
    });
  } else {
    res.render("protected-route-unauth.ejs", {
      currentUser: req.user,
    });
  }
});

router.get("/logout", (req, res, next) => {
  req.logout();

  res.redirect("/protected-route");
});

router.get("/login-success", (req, res, next) => {
  res.render("successful-login.ejs", {
    currentUser: req.user,
  });
});

router.get("/login-failure", (req, res, next) => {
  res.render("failed-login.ejs", {
    currentUser: req.user,
  });
});

module.exports = router;
