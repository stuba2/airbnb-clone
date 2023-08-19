const { check } = require('express-validator');
const { handleValidationErrors } = require('../validation');

const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Review text is required'),
  check('stars')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isInt()
    .isFloat({ min: 1, max: 5})
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
]

module.exports = { validateReview }
