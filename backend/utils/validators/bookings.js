const { check } = require('express-validator');
const { handleValidationErrors } = require('../validation');

const validateBooking = [
  check('startDate')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid start date'),
  check('endDate')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid end date'),
    handleValidationErrors
]

module.exports = { validateBooking }
