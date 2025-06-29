const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    // Get the API secret from environment variables
    const apiSecret = process.env.INTERCOM_JSON_SECRET;

    if (!apiSecret) {
      return res.status(500).json({
        error: "INTERCOM_JSON_SECRET environment variable is not set",
      });
    }

    // Extract user data from request body or query params
    const userData = req.method === "POST" ? req.body : req.query;

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
};
