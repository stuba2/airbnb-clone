const express = require('express');
const bcrypt = require('bcryptjs');

const { requireAuth, restoreUser } = require('../../utils/auth');
const { Review, User, Spot, SpotImage, ReviewImage, sequelize } = require('../../db/models');
const { validateReview } = require('../../utils/validators/reviews');

const router = express.Router();

// Get all Reviews of Current User
router.get('/user', restoreUser, requireAuth, async (req, res) => {
  const user = req.user;

  const reviews = await Review.findAll({
    where: {
      userId: user.id
    },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: Spot,
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"]
      }
    ]
  });


  let arr = []
  for (let i = 0; i < reviews.length; i++) {
    let review = reviews[i]
    let reviewObject = review.toJSON()
    let spot = reviewObject.Spot

    const spotImage = await SpotImage.findOne({
      where: {
        spotId: spot.id,
        previewImage: true
      }
    })

    if (spotImage) {
      spot.previewImage = spotImage.url
    } else {
      spot.previewImage = null
    }

    arr.push(reviewObject)
  }
  
  res.json({Reviews: arr})
});

// Get all Reviews by a Spot's id
router.get('/:spotId/reviews', restoreUser, requireAuth, async (req, res) => {
  const { spotId } = req.params;
  // const user = req.user;
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

  res.json(reviews)
});

// Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', restoreUser, requireAuth, validateReview, async (req, res) => {
  const { spotId } = req.params;
  const { review, stars } = req.body;
  const user = req.user;

  const oldReview = await Review.findOne({
    where: {
      spotId: spotId,
      userId: user.id
    }
  });
  if (oldReview) {
    res.status(500);
    return res.json({
      message: "User already has a review for this spot"
    })
  }

  const newReview = await Review.create({
    userId: user.id,
    spotId: spotId,
    review: review,
    stars: stars
  });

  // Body validation errors

  // Couldn't find spot
  const doesSpotExist = await Spot.findByPk(+spotId)
  if (!doesSpotExist) {
    res.status(404);
    res.json({
      message: "Spot couldn't be found"
    })
  }

  // Review from User already exists
  // const oldReview =


  res.json(newReview)

});

// Add an Image to a Review based on the Review's id
router.post('/:reviewId/image', restoreUser, requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const { url } = req.body
  const oldReview = await Review.findByPk(+reviewId);
  const reviewImages = await ReviewImage.findAll({
    where: {
      reviewId: reviewId
    }
  });

  // No Review with specified id
  if (!oldReview) {
    res.status(404);
    return res.json({
      message: "Review couldn't be found"
    })
  };

  // Images at max
  if (reviewImages.length > 10) {
    res.status(403)
    return res.json({
      message: "Maximum number of images for this resource was reached"
    })
  }

  const newReviewPic = await ReviewImage.scope("idAndUrlOnly").create({
    reviewId: reviewId,
    url: url
  })

  const resReviewPic = await ReviewImage.scope("idAndUrlOnly").findByPk(newReviewPic.id)

  res.json(resReviewPic)
});

// Edit a Review
router.put('/:spotId/reviews/:reviewId', restoreUser, requireAuth, async (req, res) => {
  const { spotId, reviewId } = req.params;
  const { review, stars } = req.body;

  const spot = await Spot.findByPk(+spotId);
  const revvy = await Review.findByPk(+reviewId);

  // Review validation errors
  let errors = {}
  if (!review) {
    errors.review = "Review text is required"
  }
  if (+stars < 1 || +stars > 5) {
    errors.stars = "Stars must be an integer from 1 to 5"
  }

  if (errors.review || errors.stars) {
    res.status(400)
    return res.json({
      message: "Bad Request",
      errors
    })
  }

  // No review found error
  if (!revvy) {
    res.status(404)
    return res.json({
      message: "Review couldn't be found"
    })
  }

  revvy.review = review;
  revvy.stars = stars;

  await revvy.save()

  res.json(revvy)
});



module.exports = router;
