const jwt = require("jsonwebtoken");
const config = require("../config/config");

const verifySpecialToken = (req, res, next) => {
  try {
    const { specialToken, email } = req.body; // Extract values

    if (!specialToken) {
      return res.status(400).json({ message: "Missing special token" });
    }

    // 🟢 Verify and decode token
    const decoded = jwt.verify(specialToken, config.accessTokenJWT);

    // 🟢 Extract values from the token
   const {inviteeEmail} = decoded;
  
    if (email !== inviteeEmail.inviteeEmail) {
      return res.status(400).json({ message: "Email mismatch. Invalid token." });
    }

    // 🟢 Attach token data to request object for later use
    req.invitationData = {
      inviteeEmail:inviteeEmail.inviteeEmail,
      inviterEmail:inviteeEmail.inviterEmail,
      specialToken1:inviteeEmail.specialToken, // No need to extract again, just use `specialToken`
    };

    next(); // Proceed to the next middleware
  } catch (error) {
    console.error("Invalid or expired special token:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifySpecialToken;
