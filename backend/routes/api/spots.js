const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, sequelize, Sequelize } = require('../../db/models');
const { settings } = require('../../app');
const { validateSpot } = require('../../utils/validators/spots');

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

// Get current user's spots
router.get('/user', restoreUser, requireAuth, async (req, res) => {
  const user = req.user;
  const spots = await Spot.findAll({
    where: {
      ownerId: user.id
    }
  });

  res.json(spots)
});

// Get details of a spot from an id
router.get('/:spotId', restoreUser, async (req, res) => {
  const { spotId } = req.params;
  const spot = await Spot.scope("allInfo").findByPk(+spotId)
  let ret = {}

  //error response (404) when spotId doesn't return anything

  if (!spot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found"
    })
  };

  ret.id = spot.id
  ret.ownerId = spot.ownerId
  ret.address = spot.address
  ret.city = spot.city
  ret.state = spot.state
  ret.country = spot.country
  ret.lat = spot.lat
  ret.lng = spot.lng
  ret.name = spot.name
  ret.description = spot.description
  ret.price = spot.price
  ret.createdAt = spot.createdAt
  ret.updatedAt = spot.updatedAt


  // aggregate data for: numReviews, avgStarRating
  const numReviews = await Review.count({
    where: {
      spotId: spotId
    }
  });
  ret.numReviews = numReviews

  const sumStarRating = await Review.sum('stars', {
    where: {
      spotId: spotId
    }
  });

  const avgStarRating = sumStarRating/numReviews
  ret.avgStarRating = avgStarRating

  // associated data for SpotImages: array of image data (id, url, preview)
  const spotImagesData = await SpotImage.scope("noSpotId").findAll({
    where: {
      spotId: spotId
    }
  });

  ret.SpotImages = spotImagesData

  // associated data for Owner: id, firstName, lastName
  const ownerDataArr = await User.findAll({
    where: {
      id: spot.ownerId
    }
  });
  ret.Owner = {}
  ret.Owner.id = ownerDataArr[0].id
  ret.Owner.firstName = ownerDataArr[0].firstName
  ret.Owner.lastName = ownerDataArr[0].lastName


  res.json(ret)
})


module.exports = router;
