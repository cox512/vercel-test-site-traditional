const express = require("express");
const app = express();
const path = require("path");
const jwt = require("jsonwebtoken");
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

// Make environment variables available to all EJS templates
app.use((req, res, next) => {
  res.locals.env = process.env;
  next();
});

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

// JWT Generation API endpoint for local development
app.post("/api/generate-jwt", async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  try {
    // Get the API secret from environment variables
    const apiSecret = process.env.INTERCOM_JSON_SECRET;

    if (!apiSecret) {
      return res.status(500).json({
        error: "INTERCOM_JSON_SECRET environment variable is not set",
      });
    }

    // Extract user data from request body
    const userData = req.body || {};

    // Create the JWT payload
    const payload = {
      user_id: userData.user_id || "anonymous_user",
      email: userData.email || undefined,
      name: userData.name || undefined,
      // Add any other attributes that were passed
      ...userData,
    };

    // Remove undefined values from payload
    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });

    // Generate the JWT token
    const token = jwt.sign(payload, apiSecret, {
      expiresIn: "1h",
      algorithm: "HS256",
    });

    res.status(200).json({
      token,
      expires_in: 3600,
      payload: payload,
    });
  } catch (error) {
    console.error("JWT generation error:", error);
    res.status(500).json({
      error: "Failed to generate JWT token",
      details: error.message,
    });
  }
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
