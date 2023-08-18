const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, sequelize, Booking } = require('../../db/models');
const { settings } = require('../../app');
const { validateSpot } = require('../../utils/validators/spots');
const { validateBooking } = require('../../utils/validators/bookings');
const spotimage = require('../../db/models/spotimage');

const router = express.Router();

// Get all Spots
router.get('/', async (req, res) => {

  const spots = await Spot.scope("allInfo").findAll({
    include: [
      {
      model: Review,
      attributes: []
      },
      {
        model: SpotImage,
        where: {
          previewImage: true
        },
        required: false,
        attributes: []
      }
  ],
    attributes: {
      include: [
      [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating'],
      [sequelize.col('SpotImages.url'), 'previewImage']
    ]
  },
    group: ['Spot.id']
  });

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
    },
    include: [
      {
        model: Review,
        attributes: []
      },
      {
        model: SpotImage,
        where: {
          previewImage: true
        },
        required: false,
        attributes: []
      }
    ],
    attributes: {
      include: [
        [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating'],
        [sequelize.col('SpotImages.url'), 'previewImage']
      ]
    },
    group: ['Spot.id']
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
});

// Edit a spot
router.put('/:spotId', restoreUser, requireAuth, async (req, res) => {
  const { spotId } = req.params
  const { address, city, state, country, lat, lng, name, description, price } = req.body

  const spot = await Spot.scope('allInfo').findByPk(+spotId)

  // Body validation errors
  let errors = {}
  if (!address) {
    errors.address = "Street address is required"
  }
  if (!city) {
    errors.city = "City is required"
  }
  if (!state) {
    errors.state = "State is required"
  }
  if (!country) {
    errors.country = "Country is required"
  }
  if (!lat) {
    errors.lat = "Latitude is not valid"
  }
  if (!lng) {
    errors.lng = "Longitude is not valid"
  }
  if (name.length > 50) {
    errors.name = "Name must be less than 50 characters"
  }
  if (!name) {
    errors.name = "Name is required"
  }
  if (!description) {
    errors.description = "Description is required"
  }
  if (!price) {
    errors.price = "Price per day is required"
  }

  if (errors.address || errors.city || errors.state || errors.country || errors.lat || errors.lng || errors.name || errors.description || errors.price) {
    res.status(400)
    res.json({
      message: "Bad Request",
      errors
    })
  };

  // No spot found error
  if (!spot) {
    res.status(404)
    res.json({
      message: "Spot couldn't be found"
    })
  };

  spot.address = address;
  spot.city = city;
  spot.state = state;
  spot.country = country;
  spot.lat = lat;
  spot.lng = lng;
  spot.name = name;
  spot.description = description;
  spot.price = price;

  await spot.save()

  res.json(spot)
});

// Delete a spot
router.delete('/:spotId', restoreUser, requireAuth, async (req, res) => {
  const { spotId } = req.params;

  const spot = await Spot.findByPk(+spotId)

  if (!spot) {
    res.status(404);
    res.json({
      message: "Spot couldn't be found"
    })
  }

  await spot.destroy();

  res.json({
    message: "Successfully deleted"
  })
});

// Delete a Review
router.delete('/:spotId/reviews/:reviewId', restoreUser, requireAuth, async (req, res) => {
  const { spotId, reviewId } = req.params;
  const spot = await Spot.findByPk(+spotId)
  const review = await Review.findByPk(+reviewId)

  if (!review) {
    res.status(404);
    return res.json({
      message: "Review couldn't be found"
    });
  }

  await review.destroy();

  res.json({
    message: "Successfully deleted"
  })
});

// Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', restoreUser, requireAuth, async (req, res) => {
  const { spotId }= req.params;
  const spot = await Spot.findByPk(+spotId);
  const user = req.user;
  let arr = []
  let ret = {}

  // Error: no spot found
  if (!spot) {
    res.status(404)
    return res.json({
      message: "Spot couldn't be found"
    })
  }

  const bookings = await Booking.findAll({
    where: {
      spotId: spot.id,
      userId: {
        [Op.not]: user.id
      }
    },
    attributes: ['spotId','startDate','endDate']
  })

  for (let i = 0; i < bookings.length; i++) {
    let booking = bookings[i]
    if (user.id !== booking.userId) {
      arr.push(booking)
    }
  }

  const userBookings = await Booking.findAll({
    where: {
      spotId: spot.id,
      userId: user.id
    }
  });


  const paredUser = await User.findAll({
    where: {
      id: user.id
    },
    attributes: ['id','firstName','lastName']
  })

  for (let i = 0; i < userBookings.length; i++) {
    let booking = userBookings[i];
    if (user.id === booking.userId) {
      ret.User = paredUser[i]
      ret.id = booking.id
      ret.spotId = booking.spotId
      ret.userId = booking.userId
      ret.startDate = booking.startDate
      ret.endDate = booking.endDate
      ret.createdAt = booking.createdAt
      ret.updatedAt = booking.updatedAt
      arr.push(ret)
    }
  }

  res.json({Bookings: arr})
});

// Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', restoreUser, requireAuth, validateBooking, async (req, res) => {
  const { spotId } = req.params;
  const { startDate, endDate } = req.body;
  const user = req.user;
  const errors = {}

  const spot = Booking.findByPk(+spotId)

  // If spot doesn't exist error
  if (!spot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found"
    })
  };

  // Booking conflict error
  const conflictBookingQStart = await Booking.findAll({
    where: {
      startDate: {
        [Op.lte]: startDate
      },
      endDate: {
        [Op.gte]: startDate
      }
    }
  });

  const conflictBookingQEnd = await Booking.findAll({
    where: {
      startDate: {
        [Op.lte]: endDate
      },
      endDate: {
        [Op.gte]: endDate
      }
    }
  });

  if (conflictBookingQStart[0]) {
    errors.startDate = "Start date conflicts with an existing booking"
  }
  if (conflictBookingQEnd[0]) {
    errors.endDate = "End date conflicts with an existing booking"
  }

  if (errors.startDate || errors.endDate) {
    res.status(403)
    return res.json({
      message: "Sorry this spot is already booked for the specified dates",
      errors
    })
  }

  const newBookingCreation = await Booking.create({
    spotId: spotId,
    userId: user.id,
    startDate: startDate,
    endDate: endDate
  });
// console.log(newBookingCreation.id)
  const newBooking = await Booking.findAll({
    where: {
      id: newBookingCreation.id
    }
  })

  res.json(newBooking[0])
});

// Delete a Spot Image
router.delete('/:spotId/images/:imageId', restoreUser, requireAuth, async (req, res) => {
  const { spotId, imageId } = req.params;
  const spot = await Spot.findByPk(+spotId)
  const spotImage = await SpotImage.findAll({
    where: {
      spotId: spot.id
    }
  })

  // No Spot Image
  if (!spotImage) {
    res.status(404)
    return res.json({
      message: "Spot Image couldn't be found"
    })
  }

  await spotImage.destroy()

  res.json({
    message: "Successfully deleted"
  })
});


module.exports = router;
