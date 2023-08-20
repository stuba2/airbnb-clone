const express = require('express');
const bcrypt = require('bcryptjs');

const { requireAuth, restoreUser, plsLogIn } = require('../../utils/auth');
const { Review, User, Spot, SpotImage, ReviewImage, sequelize } = require('../../db/models');
const { validateReview } = require('../../utils/validators/reviews');
const { isEmpty } = require('../../utils/validation')

const router = express.Router();

// Get all Reviews of Current User
router.get('/user', restoreUser, requireAuth, plsLogIn, async (req, res) => {
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
router.post('/:reviewId/images', restoreUser, requireAuth, plsLogIn, async (req, res) => {
  if (isEmpty(req.body)) {
    res.status(400)
    return res.json({
      message: "Bad Request",
      errors: {
        url: "URL is required"
      }
    })
  }

  const { reviewId } = req.params;
  const { url } = req.body
  const user = req.user

  if (isNaN(parseInt(reviewId))) {
    res.status(404)
    return res.json({
      message: "reviewId needs to be a number"
    })
  }

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

  // Restricts if user isn't the owner
  if (user.id !== oldReview.userId) {
    res.status(403)
    return res.json({
      message: "Forbidden"
    })
  }

  if (oldReview && user.id !== oldReview.userId) {
    res.status(403)
    return res.json({
      message: "Forbidden"
    })
  }

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

// Delete a Review Image
router.delete('/:reviewId/images/:imageId', restoreUser, requireAuth, plsLogIn, async (req, res) => {
  const { reviewId, imageId } = req.params;
  const user = req.user;

  if (isNaN(parseInt(reviewId))) {
    res.status(404)
    return res.json({
      message: "reviewId needs to be a number"
    })
  }
  if (isNaN(parseInt(imageId))) {
    res.status(404)
    return res.json({
      message: "imageId needs to be a number"
    })
  }

  const review = await Review.findByPk(+reviewId)
  const reviewImage = await ReviewImage.findAll({
    where: {
      reviewId: review.id,
      id: imageId
    }
  })

  // Restricts if user isn't the owner
  if (user.id !== review.userId) {
    res.status(403)
    return res.json({
      message: "Forbidden"
    })
  }

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
