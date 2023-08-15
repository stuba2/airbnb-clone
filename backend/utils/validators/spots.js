const { check } = require('express-validator');
const { handleValidationErrors } = require('../validation');

const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid address'),
  check('city')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid city'),
  check('state')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isLength({ min: 2, max: 2 })
    .withMessage('Please provide a valid state with only 2 characters'),
  check('country')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isLength({ min: 3, max: 3})
    .withMessage('Please provide a valid country with only 3 characters'),
  check('lat')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a latitude'),
  check('lng')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a longitude'),
  check('name')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a name'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a description'),
  check('price')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a price'),
  handleValidationErrors
];

module.exports = { validateSpot }
