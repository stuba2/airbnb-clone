const { check } = require('express-validator');
const { handleValidationErrors } = require('../validation');

const validateSpotImage = [
  check('url')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isURL()
    .withMessage('Url is not valid'),
  check('preview')
    .exists({ checkFalsy: false })
    .notEmpty()
    .isBoolean()
    .withMessage('True or False required'),
  handleValidationErrors
]

module.exports = { validateSpotImage }
