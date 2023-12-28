const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./database");
// const User = User.models.User;
const validatePassword = require("../lib/passwordUtils").validatePassword;
const crypto = require("crypto");

const customFields = {
  usernameField: "uname",
  passwordField: "pw",
};

function validateHash(userId, SECRET) {
  const user_hash = crypto
    .createHmac("sha256", SECRET)
    .update(userId)
    .digest("hex");

  return user_hash;
}

const verifyCallback = (username, password, done) => {
  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        return done(null, false);
      }

      if (!user.userHash) {
        const user_hash = validateHash(user.userId, process.env.SECRET);

        User.findByIdAndUpdate(
          user.id,
          { userHash: user_hash },
          function (err, result) {
            if (err) {
              console.log("err:", err);
            } else {
              console.log("result:", result);
            }
          }
        );
      }

      const isValid = validatePassword(password, user.hash, user.salt);

      if (isValid) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((err) => {
      done(err);
    });
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});
