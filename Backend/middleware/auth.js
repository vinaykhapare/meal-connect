const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    // console.log("Received token:", token);

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access Denied. No token provided." });
    }

    const verified = jwt.verify(token, "yourSecretKey");
    // console.log('Verified token data:', verified);

    req.user = verified;
    next();
  } catch (error) {
    // console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
}

module.exports = { authMiddleware };
