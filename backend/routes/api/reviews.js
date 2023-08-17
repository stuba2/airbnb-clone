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
        model: Spot,
        include: [
          {
            model: SpotImage,
            where: {
              previewImage: true
            },
            required: false,
            attributes: ['url']
          }
        ],
        // attributes: {
        //   include: [
        //     [sequelize.col('SpotImage.url'), 'previewImage']
        //   ]
        // },
        group: ['Spot.id']
      }
    ]
  });

  res.json(reviews)
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

module.exports = router;
