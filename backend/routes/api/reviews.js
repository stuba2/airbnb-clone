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
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
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

// Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', restoreUser, requireAuth, async (req, res) => {
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

// Delete a Review Image
router.delete('/:reviewId/images/:imageId', restoreUser, requireAuth, async (req, res) => {
  const { reviewId, imageId } = req.params;
  const review = await Review.findByPk(+reviewId)
  const reviewImage = await ReviewImage.findAll({
    where: {
      reviewId: review.id,
      id: imageId
    }
  })

  // No Review Image
  if (!reviewImage[0]) {
    res.status(404);
    return res.json({
      message: "Review Image couldn't be found"
    })
  }

  await reviewImage[0].destroy();

  res.json({
    message: "Successfully deleted"
  })
})

module.exports = router;
