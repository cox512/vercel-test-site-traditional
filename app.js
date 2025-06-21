const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const PORT = process.env.PORT || 3000;

console.log(
  "DEBUG: Server starting with latest code -",
  new Date().toISOString()
);
console.log("My port:", PORT);

const routes = require("./routes");

/**
 * -------------- GENERAL SETUP ----------------
 */

// Create the Express application
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Direct route for CSS
app.get("/styles.css", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "styles.css"));
});

// Set up view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/**
 * -------------- ROUTES ----------------
 */
// Imports all of the routes from ./routes/index.js
app.use(routes);

app.get("/new-tab", (req, res) => {
  res.render("new-tab");
});

app.get("/page-two", (req, res) => {
  res.render("page-two");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

/**
 * -------------- SERVER ----------------
 */

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log("Listening on port:", PORT));
}

// Export the Express API
module.exports = app;
