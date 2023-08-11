const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, sequelize } = require('../../db/models');

const router = express.Router();

// Get all Spots
router.get('/', async (req, res) => {
  const spots = await Spot.findAll({
    include: {
      model: Review,
      attributes: []
    },
    attributes: [
      'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price',
      [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
    ],
    group: ['spotId']
  });

  // get previewImage
  // if SpotImage.previewImage === true, include the SpotImage.url, else don't include previewImage in the res.json

  res.json(spots)
});




module.exports = router;
