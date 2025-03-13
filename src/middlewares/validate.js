const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    let theerror = "";
    for (let error of errors.array()) {
      theerror += error.msg + ", ";
    }
    const error = new Error(theerror);
    error.statusCode = 422;
    error.status = "fail";
    next(error);
  }
  next();
};

module.exports = { validate };
