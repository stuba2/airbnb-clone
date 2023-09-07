// backend/utils/validation.js
const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err1 = {}
    err1.message = "Bad Request"
    err1.errors = errors
    err1.status = 400
    // err1.title = 'hi'
    // delete err1.title

    // const err = Error("Bad request");
    // err.errors = errors;
    // err.status = 400;
    // err.title = "Bad request.";
    console.log('-------Title: ', err1.title)
    next(err1);
  }
  next();
};

const isEmpty = (obj) => {
  // for (let prop in obj) {
    if (Object.keys(obj).length === 0) {
      // return false
    // }
    return true
  }
  return false
};

module.exports = {
  handleValidationErrors,
  isEmpty
};
