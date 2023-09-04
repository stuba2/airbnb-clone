const express = require('express');
const { Op, DataTypes } = require('sequelize');

const { requireAuth, restoreUser, plsLogIn } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, sequelize, Booking, ReviewImage } = require('../../db/models');
const { validateSpot } = require('../../utils/validators/spots');
const { validateBooking } = require('../../utils/validators/bookings');
const { validateReview } = require('../../utils/validators/reviews');
const { validateSpotImage } = require('../../utils/validators/spotImages');

const router = express.Router();

// Get all Spots
router.get('/', async (req, res) => {
  let query = {
    where: {},
    include: []
  }

  // Pagination & Queries
  const { minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
  let page = req.query.page === undefined ? 1 : parseInt(req.query.page)
  let size = req.query.size === undefined ? 20 : parseInt(req.query.size)

  if (page > 10) page = 10
  if (size > 20) size = 20
  if (minPrice < 0) minPrice = 0
  if (maxPrice < 0) maxPrice = 0

  if (page >= 1 && size >= 1) {
    query.limit = size;
    query.offset = size * (page - 1)
  }

  if (minLat) {
    query.where.lat = { [Op.gte]: minLat }
  }
  if (maxLat) {
    if (query.where.lat) {
      query.where.lat = { [Op.between]: [minLat, maxLat] }
    } else {
      query.where.lat = { [Op.lte]: maxLat }
    }
  }
  if (minLng) {
    query.where.lng = { [Op.gte]: minLng }
  }
  if (maxLng) {
    if (query.where.lng) {
      query.where.lng = { [Op.between]: [minLng, maxLng] }
    } else {
      query.where.lng = { [Op.lte]: maxLng }
    }
  }
  if (minPrice) {
    query.where.price = { [Op.lte]: minPrice }
  }
  if (maxPrice) {
    if (query.where.price) {
      query.where.price = { [Op.between]: [minPrice, maxPrice] }
    } else {
      query.where.price = { [Op.gte]: maxPrice }
    }
  }


  // Query parameter validation errors
  let errors = {}
  if (page < 1) {
    errors.page = "Page must be greater than or equal to 1"
  }
  if (size < 1) {
    errors.size = "Size must be greater than or equal to 1"
  }
  if (maxLat > 90) {
    errors.maxLat = "Maximum latitude is invalid"
  }
  if (minLat < -90) {
    errors.minLat = "Minimum latitude is invalid"
  }
  if (minLng < -180) {
    errors.minLng = "Minimum longitude is invalid"
  }
  if (maxLng > 180) {
    errors.maxLng = "Maximum longitude is invalid"
  }
  if (minPrice < 0) {
    errors.minPrice = "Minimum price must be greater than or equal to 0"
  }
  if (maxPrice < 0) {
    errors.maxPrice = "Maximum price must be greater than or equal to 0"
  }

  if (errors.page || errors.size || errors.maxLat || errors.minLat || errors.minLng || errors.maxLng || errors.minPrice || errors.maxPrice) {
    res.status(400)
    return res.json({
      message: "Bad Request",
      errors
    })
  }

  // const spots = await Spot.scope("allInfo").findAll({
  //   where: query.where,
  //   include: [
  //     {
  //     model: Review,
  //     attributes: []
  //     },
  //     {
  //       model: SpotImage,
  //       where: {
  //         previewImage: true
  //       },
  //       required: false,
  //       attributes: []
  //     }
  // ],
  //   attributes: {
  //     include: [
  //     [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating'],
  //     [sequelize.col('SpotImages.url'), 'previewImage']
  //   ]
  // },
  //   group: [['Spot.id'], ['SpotImages.url']],
  //   offset: query.offset,
  //   limit: query.limit,
  //   subQuery: false
  // });

  // for (let i = 0; i < spots.length; i++) {
  //   let spotStr = JSON.stringify(spots[i])
  //   let spot = JSON.parse(spotStr)
  //   if (spot.avgRating) {
  //     let num = +spot.avgRating
  //     let newNum = Math.round(num * 100) / 100
  //     spot.avgRating = newNum
  //   }
  // }

  // res.json({
  //   Spots: spots,
  //   page: page,
  //   size: query.limit
  // })

  // lazy load attempt
  let spotsLazy = await Spot.scope("allInfo").findAll()
  let ret = []

  for (let i = 0; i < spotsLazy.length; i++) {
    let spotLazyStr = JSON.stringify(spotsLazy[i])
    let spotLazy = JSON.parse(spotLazyStr)

    // avgRating
    let reviewsLazyProm = await Review.findAll({
      where: {
        spotId: spotLazy.id
      },
      attributes: ['stars']
    })
    let reviewsLazy = JSON.parse(JSON.stringify(reviewsLazyProm))

    let sum = 0
    for (let i = 0; i < reviewsLazy.length; i++) {
      let reviewLazy = reviewsLazy[i]
      sum += reviewLazy.stars
    }
    let average = sum / reviewsLazy.length
    let shortAvg = parseInt(average.toFixed(2))
    spotLazy.avgRating = shortAvg

    // previewImage
    let imageLazyProm = await SpotImage.findAll({
      where: {
        spotId: spotLazy.id
      },
      attributes: ['previewImage', 'url']
    })
    let imageLazy = JSON.parse(JSON.stringify(imageLazyProm))


    for (let i = 0; i < imageLazy.length; i++) {
      if (imageLazy[i] === true) {
        spotLazy.previewImage = imageLazy.url
      }
    }
    if (!spotLazy.previewImage) {
      spotLazy.previewImage = null
    }

    // price
    if (typeof spotLazy.price === "string") {
      spotLazy.price = parseInt(spotLazy.price)
    }

    ret.push(spotLazy)
  }



  res.json({
    Spots: ret,
    page: page,
    size: query.limit
  })
});

// Create a Spot
router.post('/', restoreUser, requireAuth, plsLogIn, validateSpot, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  const user = req.user

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
  if (lat < -90 || lat > 90) {
    errors.lat = "Latitude is not valid"
  }
  if (!lng) {
    errors.lng = "Longitude is not valid"
  }
  if (lng < -180 || lng > 180) {
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

  const spotExistsQuestion = await Spot.findAll({
    where: {
      address: address
    }
  });
  if (spotExistsQuestion[0]) {
    res.status(400)
    return res.json({
      message: "Location already exists"
    })
  }

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


  res.status(201)
  res.json(newSpot)
});

// Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', restoreUser, requireAuth, plsLogIn, validateSpotImage, async (req, res) => {
  const { spotId } = req.params;
  const { url, preview } = req.body;
  const user = req.user;

  if (isNaN(parseInt(spotId))) {
    res.status(404)
    return res.json({
      message: "spotId needs to be a number"
    })
  }

  const spot = await Spot.findByPk(+spotId);

  // No spot error
  if (!spot) {
    res.status(404)
    return res.json({
      message: "Spot couldn't be found"
    })
  }

  // Restricts if user isn't the owner
  if (user.id !== spot.ownerId) {
    res.status(403)
    return res.json({
      message: "Forbidden"
    })
  }

  // Body validation errors
  let errors = {}
  if (!url) {
    errors.url = "Image URL is required"
  }
  if (preview !== true && preview !== false) {
    errors.previewImage = "true or false required"
  }
  if (errors.url || errors.previewImage) {
    res.status(400)
    return res.json({
      message: "Bad Request",
      errors
    })
  }

  const newSpotPic = await SpotImage.create({
    spotId: spotId,
    url: url,
    previewImage: preview
  });

  const retNewPic = await SpotImage.findAll({
    where: {
      id: newSpotPic.id
    },
    attributes: ['id', 'url', 'previewImage']
  })

  res.json(retNewPic[0])
});

// Get Spots owned by the Current User
router.get('/user', restoreUser, requireAuth, plsLogIn, async (req, res) => {
  const user = req.user;
  // const spots = await Spot.scope("allInfo").findAll({
  //   where: {
  //     ownerId: user.id
  //   },
  //   include: [
  //     {
  //       model: Review,
  //       attributes: []
  //     },
  //     {
  //       model: SpotImage,
  //       where: {
  //         previewImage: true
  //       },
  //       required: false,
  //       attributes: []
  //     }
  //   ],
  //   attributes: {
  //     include: [
  //       [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating'],
  //       [sequelize.col('SpotImages.url'), 'previewImage']
  //     ]
  //   },
  //   group: [['Spot.id'], ['SpotImages.url']]
  // });

  // for (let i = 0; i < spots.length; i++) {
  //   let spotStr = JSON.stringify(spots[i])
  //   let spot = JSON.parse(spotStr)
  //   if (spot.avgRating) {
  //     let num = +spot.avgRating
  //     let newNum = Math.round(num * 100) / 100
  //     spot.avgRating = newNum
  //   }
  // }

  // res.json({Spots: spots})

  // lazy load attempt
  const spotsLazy = await Spot.scope("allInfo").findAll({
    where: {
      ownerId: user.id
    }
  })
  let ret = []

  for (let i = 0; i < spotsLazy.length; i++) {
    let spotLazyStr = JSON.stringify(spotsLazy[i])
    let spotLazy = JSON.parse(spotLazyStr)

    // avgRating
    let reviewsLazyProm = await Review.findAll({
      where: {
        spotId: spotLazy.id
      },
      attributes: ['stars']
    })
    let reviewsLazy = JSON.parse(JSON.stringify(reviewsLazyProm))

    let sum = 0
    for (let i = 0; i < reviewsLazy.length; i++) {
      let reviewLazy = reviewsLazy[i]
      sum += reviewLazy.stars
    }
    let average = sum / reviewsLazy.length
    let shortAvg = parseInt(average.toFixed(2))
    spotLazy.avgRating = shortAvg

    // previewImage
    let imageLazyProm = await SpotImage.findAll({
      where: {
        spotId: spotLazy.id
      },
      attributes: ['previewImage', 'url']
    })
    let imageLazy = JSON.parse(JSON.stringify(imageLazyProm))

    for (let i = 0; i < imageLazy.length; i++) {
      if (imageLazy[i].previewImage === true) {
        spotLazy.previewImage = imageLazy[i].url
      }
    }
    if (!spotLazy.previewImage) {
      spotLazy.previewImage = null
    }

    // price
    if (typeof spotLazy.price === "string") {
      spotLazy.price = parseInt(spotLazy.price)
    }

    ret.push(spotLazy)
  }

  res.json({
    Spots: ret
  })

});

// Get details of a Spot from an id
router.get('/:spotId', restoreUser, async (req, res) => {
  const { spotId } = req.params;

  if (isNaN(parseInt(spotId))) {
    res.status(404)
    return res.json({
      message: "spotId needs to be a number"
    })
  }

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
router.put('/:spotId', restoreUser, requireAuth, plsLogIn, validateSpot, async (req, res) => {
  const { spotId } = req.params
  const { address, city, state, country, lat, lng, name, description, price } = req.body
  const user = req.user

  if (isNaN(parseInt(spotId))) {
    res.status(404)
    return res.json({
      message: "spotId needs to be a number"
    })
  }

  const spot = await Spot.scope('allInfo').findByPk(+spotId)


  // No spot found error
  if (!spot) {
    res.status(404)
    res.json({
      message: "Spot couldn't be found"
    })
  };

  // Restricts if user isn't the owner
  if (user.id !== spot.ownerId) {
    res.status(403)
    return res.json({
      message: "Forbidden"
    })
  }

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

  const spotExistsQuestion = await Spot.findAll({
    where: {
      address: address
    }
  });
  if (spotExistsQuestion[0] && spotExistsQuestion[0].id !== spot.id) {
    res.status(400)
    return res.json({
      message: "Location already exists"
    })
  }

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
router.delete('/:spotId', restoreUser, requireAuth, plsLogIn, async (req, res) => {
  const { spotId } = req.params;
  const user = req.user;

  if (isNaN(parseInt(spotId))) {
    res.status(404)
    return res.json({
      message: "spotId needs to be a number"
    })
  }

  const spot = await Spot.findByPk(+spotId)

  // Spot can't be found
  if (!spot) {
    res.status(404);
    res.json({
      message: "Spot couldn't be found"
    })
  }

  // Restricts if user isn't the owner
  if (user.id !== spot.ownerId) {
    res.status(403)
    return res.json({
      message: "Forbidden"
    })
  }

  // Restricts if user isn't the owner
  if (user.id !== spot.ownerId) {
    return res.json({
      message: "You do not have permission to add images to this spot"
    })
  }

  await spot.destroy();

  res.json({
    message: "Successfully deleted"
  })
});

// Get all Reviews by a Spot's id
router.get('/:spotId/reviews', restoreUser, async (req, res) => {
  const { spotId } = req.params;

  if (isNaN(parseInt(spotId))) {
    res.status(404)
    return res.json({
      message: "spotId needs to be a number"
    })
  }

  const spot = await Spot.findByPk(+spotId);

  if (!spot) {
    res.status(404);
    res.json({
      message: "Spot couldn't be found"
    })
  }

  const reviews = await Review.findAll({
    where: {
      spotId: spotId
    },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url']
      }
    ]
  });

  res.json({Reviews: reviews})
});

// Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', restoreUser, requireAuth, plsLogIn, validateReview, async (req, res) => {
  const { spotId } = req.params;
  const { review, stars } = req.body;
  const user = req.user;

  if (isNaN(parseInt(spotId))) {
    res.status(404)
    return res.json({
      message: "spotId needs to be a number"
    })
  }

  // Body validation errors
  let errors = {}
  if (!review) {
    errors.review = "Review text is required"
  }
  if (typeof stars !== "number" || stars < 1 || stars > 5) {
    errors.stars = "Stars must be an integer from 1 to 5"
  }
  if (errors.review || errors.stars) {
    res.status(400)
    return res.json({
      message: "Bad Request",
      errors
    })
  }

  const oldReview = await Review.findOne({
    where: {
      spotId: spotId,
      userId: user.id
    }
  });

  // Couldn't find spot
  const doesSpotExist = await Spot.findByPk(+spotId)
  if (!doesSpotExist) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found"
    })
  }

  // User is spot owner
  if (user.id === oldReview.userId) {
    res.status(403)
    return res.json({
      message: "Forbidden"
    })
  }

  // User already reviewed
  if (oldReview) {
    res.status(500);
    return res.json({
      message: "User already has a review for this spot"
    })
  }


  const newReview = await Review.create({
    userId: user.id,
    spotId: +spotId,
    review: review,
    stars: parseInt(stars)
  });

  // Body validation errors


  // Review from User already exists
  // const oldReview =


  res.json(newReview)

});

// Edit a Review
router.put('/:spotId/reviews/:reviewId', restoreUser, requireAuth, plsLogIn, validateReview, async (req, res) => {
  const { spotId, reviewId } = req.params;
  const { review, stars } = req.body;
  const user = req.user;

  if (isNaN(parseInt(spotId))) {
    res.status(404)
    return res.json({
      message: "spotId needs to be a number"
    })
  }
  if (isNaN(parseInt(reviewId))) {
    res.status(404)
    return res.json({
      message: "reviewId needs to be a number"
    })
  }

  const spot = await Spot.findByPk(+spotId);
  const revvy = await Review.findByPk(+reviewId);

  // No review found error
  if (!revvy) {
    res.status(404)
    return res.json({
      message: "Review couldn't be found"
    })
  }
  if (!spot) {
    res.status(404)
    return res.json({
      message: "Spot couldn't be found"
    })
  }

  // Restricts if user isn't the owner
  if (user.id !== revvy.userId) {
    res.status(403)
    return res.json({
      message: "Forbidden"
    })
  }

  // Review validation errors
  let errors = {}
  if (!review) {
    errors.review = "Review text is required"
  }
  if (typeof stars !== "number" || stars < 1 || stars > 5) {
    errors.stars = "Stars must be an integer from 1 to 5"
  }

  if (errors.review || errors.stars) {
    res.status(400)
    return res.json({
      message: "Bad Request",
      errors
    })
  }



  revvy.review = review;
  revvy.stars = parseInt(stars);

  await revvy.save()

  res.json(revvy)
});

// Delete a Review
router.delete('/:spotId/reviews/:reviewId', restoreUser, requireAuth, plsLogIn, async (req, res) => {
  const { spotId, reviewId } = req.params;
  const user = req.user

  if (isNaN(parseInt(spotId))) {
    res.status(404)
    return res.json({
      message: "spotId needs to be a number"
    })
  }
  if (isNaN(parseInt(reviewId))) {
    res.status(404)
    return res.json({
      message: "reviewId needs to be a number"
    })
  }

  const spot = await Spot.findByPk(+spotId)
  const review = await Review.findByPk(+reviewId)

  // If Review can't be found
  if (!review) {
    res.status(404);
    return res.json({
      message: "Review couldn't be found"
    });
  }

  // Restricts if user isn't the owner
  if (user.id !== review.userId) {
    res.status(403)
    return res.json({
      message: "Forbidden"
    })
  }



  await review.destroy();

  res.json({
    message: "Successfully deleted"
  })
});

// Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', restoreUser, requireAuth, plsLogIn, async (req, res) => {
  const { spotId }= req.params;

  if (isNaN(parseInt(spotId))) {
    res.status(404)
    return res.json({
      message: "spotId needs to be a number"
    })
  }

  const spot = await Spot.findByPk(+spotId);
  const user = req.user;
  let arr = []
  let ret = {}
  let bookingsUserNotOwnerOfSpot = []

  // Error: no spot found
  if (!spot) {
    res.status(404)
    return res.json({
      message: "Spot couldn't be found"
    })
  }

  // Bookings if you're NOT the owner of the spot
  const bookings = await Booking.findAll({
    where: {
      spotId: spot.id
    },
    attributes: ['spotId','startDate','endDate']
  })

  for (let i = 0; i < bookings.length; i++) {
    let booking = bookings[i]
    if (user.id !== spot.ownerId) {
      arr.push(booking)
    }
  }

  const userBookings = await Booking.findAll({
    where: {
      spotId: spot.id
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
    if (user.id === spot.ownerId) {
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
router.post('/:spotId/bookings', restoreUser, requireAuth, plsLogIn, validateBooking, async (req, res) => {
  const { spotId } = req.params;
  const { startDate, endDate } = req.body;
  const user = req.user;


  if (isNaN(parseInt(spotId))) {
    res.status(404)
    return res.json({
      message: "spotId needs to be a number"
    })
  }

  // Body validation errors
  let errors = {}
  if (!startDate) {
    errors.startDate = "Please provide a valid start date"
  }
  if (!endDate) {
    errors.endDate = "Please provide a valid end date"
  }
  if (new Date(startDate) < new Date()) {
    errors.startDate = "Start date must be in the future"
  }
  if (new Date(endDate) < new Date()) {
    errors.endDate = "End date must be in the future"
  }
  if (endDate < startDate) {
    errors.endDate = "endDate cannot be on or before startDate"
  }
  if (errors.startDate || errors.endDate) {
    res.status(400)
    return res.json({
      message: "Bad Request",
      errors
    })
  }
  delete errors.startDate
  delete errors.endDate

  const spot = await Spot.findByPk(+spotId)

  // If spot doesn't exist error
  if (!spot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found"
    })
  };


  // Restricts if user is the owner
  if (user.id === spot.ownerId) {
    res.status(403)
    return res.json({
      message: "Forbidden"
    })
  }

  // Booking conflict error
  const conflictBookingQStart = await Booking.findAll({
    where: {
      startDate: {
        [Op.lte]: startDate
      },
      endDate: {
        [Op.gte]: startDate
      },
      spotId: spotId
    }
  });

  const conflictBookingQEnd = await Booking.findAll({
    where: {
      startDate: {
        [Op.lte]: endDate
      },
      endDate: {
        [Op.gte]: endDate
      },
      spotId: spotId
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

  const newBooking = await Booking.findAll({
    where: {
      id: newBookingCreation.id
    }
  })

  res.json(newBooking[0])
});

// Delete a Spot Image
router.delete('/:spotId/images/:imageId', restoreUser, requireAuth, plsLogIn, async (req, res) => {
  const { spotId, imageId } = req.params;
  const user = req.user;

  if (isNaN(parseInt(spotId))) {
    res.status(404)
    return res.json({
      message: "spotId needs to be a number"
    })
  }
  if (isNaN(parseInt(imageId))) {
    res.status(404)
    return res.json({
      message: "imageId needs to be a number"
    })
  }

  const spot = await Spot.findByPk(+spotId)
  const spotImage = await SpotImage.findAll({
    where: {
      spotId: spot.id,
      id: imageId
    }
  })

  // Restricts if user isn't the owner
  if (user.id !== spot.ownerId) {
    res.status(403)
    return res.json({
      message: "Forbidden"
    })
  }

  // No Spot Image
  if (!spotImage[0]) {
    res.status(404)
    return res.json({
      message: "Spot Image couldn't be found"
    })
  }

  await spotImage[0].destroy()

  res.json({
    message: "Successfully deleted"
  })
});


module.exports = router;
