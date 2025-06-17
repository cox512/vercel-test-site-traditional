const router = require("express").Router();

/**
 * -------------- ROUTES ----------------
 */

router.get("/", (req, res, next) => {
  res.render("landing.ejs");
});

module.exports = router;
