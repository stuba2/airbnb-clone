const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, sequelize } = require('../../db/models');
const { settings } = require('../../app');

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
  // console.log(req.user)

  // get previewImage
  // if SpotImage.previewImage === true, include the SpotImage.url, else don't include previewImage in the res.json

  res.json(spots)
});

// Create a Spot
router.post('/', requireAuth, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  const user = await User.findOne({
    where: {
      username: 'Demo-lition'
    }
  })

  // try {
  //   setTokenCookie(req, user)

  // } catch {
  //   const error = new Error('You need to be logged in to do that')
  //   res.json(err)
  // }
  // console.log('----------',user.id)

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

  // {
  //   "ownerId": 1,
  //   "address": "1201 S Main St",
  //   "city": "Ann Arbor",
  //   "state": "MI",
  //   "country": "USA",
  //   "lat": 42.265777,
  //   "lng": -83.748849,
  //   "name": "Michigan Stadium",
  //   "description": "This is the Big House",
  //   "price": 45.23
  // }

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


module.exports = router;
