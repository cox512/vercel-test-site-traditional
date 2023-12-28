const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = mongoose.connection;
const cookieSession = require("cookie-session");
require("dotenv").config();
const PORT = process.env.PORT;

require("./config/passport");

const passport = require("passport");
const routes = require("./routes");
// const connection = require("./config/database.js");

//===============================
// DATABASE
//===============================
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(
  MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("the connection with mongod is established");
  }
);

db.on("error", (err) => console.log(err.message + " is Mongod not running?"));
db.on("connected", () => console.log("mongo connected: ", MONGO_URI));
db.on("disconnected", () => console.log("mongo disconnected"));
db.on("open", () => {
  console.log("connected to Mongo");
});
/**
 * -------------- GENERAL SETUP ----------------
 */

// Create the Express application

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //was true

/**
 * -------------- SESSION SETUP ----------------
 */

app.use(
  cookieSession({
    maxAge: 30 * 24 * 40 * 60 * 1000,
    keys: [process.env.COOKIE_KEY], // key used to encrypt our cookie.
  })
);

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

app.use(passport.initialize()); //Refreshes the passport middleware every time a route is loaded. So the session doesn't expire.
app.use(passport.session());
app.use(express.static("public"));

//

/**
 * -------------- ROUTES ----------------
 */
// Imports all of the routes from ./routes/index.js
app.use(routes);

/**
 * -------------- SERVER ----------------
 */

app.listen(PORT, () => console.log("Listening on port:", PORT));
