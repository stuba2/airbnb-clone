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
