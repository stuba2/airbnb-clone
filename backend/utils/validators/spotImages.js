const { check } = require('express-validator');
const { handleValidationErrors } = require('../validation');

const validateSpotImage = [
  check('url')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Url is not valid'),
  check('preview')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isBoolean()
    .withMessage('True or False required'),
  handleValidationErrors
]

module.exports = { validateSpotImage }
