const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, sequelize, Sequelize } = require('../../db/models');
const { settings } = require('../../app');
const { validateSpot } = require('../../utils/validators/spots')

const router = express.Router();

// Get all Spots
router.get('/', async (req, res) => {

  const spots = await Spot.findAll({
    include: [
      {
        model: Review,
        attributes: []
      },
      // {
      //   model: SpotImage,
      //   attributes: []
      // }
    ],
    attributes: [
      'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt',
      [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
    ],
    // group: ['spotId']

    // attributes: {
    //   include: [sequelize.col('SpotImage'),'url']
    // }
  });


  // get previewImage
  // if SpotImage.previewImage === true, include the SpotImage.url, else don't include previewImage in the res.json

  res.json(spots)
});

// Create a Spot
router.post('/', requireAuth, restoreUser, validateSpot, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  const user = req.user

  const newSpot = await Spot.create({
    ownerId: user.id,
    address: address,
    city: city,
    state: state,
    country: country,
    lat: lat,
    lng: lng,
    name: name,
    description: description,
    price: price
  });

  const spotExistsQuestion = await Spot.findAll({
    where: {
      address: address
    }
  });

  if (spotExistsQuestion) {
    res.json(newSpot)
  } else {
    throw new Error('Location already exists')
  }
});

// Add image to spot
router.post('/:spotId/images', restoreUser, requireAuth,  async (req, res) => {
  const { spotId } = req.params;
  const { url, preview } = req.body;
  const user = req.user;
  const spot = await Spot.findByPk(+spotId);

  if (spot.id === user.id ) {
    try {
      if (spot !== undefined) {
        const newSpotPic = await SpotImage.create({
          spotId: spotId,
          url: url,
          previewImage: preview
        });

        res.json(newSpotPic)
      }
    } catch {
      res.status(404);
      res.json({
        message: "Spot couldn't be found"
      });
    }
  } else {
    res.json({
      message: "Only this spot's owner can add images"
    })
  }


});


module.exports = router;
