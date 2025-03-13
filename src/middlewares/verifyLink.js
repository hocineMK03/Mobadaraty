const jwt = require("jsonwebtoken");
const config = require("../config/config");
function verifyLink(req, res, next) {
  const { token } = req.query;

  jwt.verify(token, config.accessTokenJWT, (err, decoded) => {
    if (err) {
      console.log(err);
      const error = new Error("Failed to authenticate token", err);
      error.statusCode = 403;
      error.status = "fail";
      return next(error);
    } else {
      req.user = decoded;

      next();
    }
  });
}

module.exports = verifyLink;
