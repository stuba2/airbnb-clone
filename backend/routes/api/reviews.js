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
            attributes: []
          }
        ],
        attributes: {
          include: [
            [sequelize.col('SpotImage.url'), 'previewImage']
          ]
        },
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
})

module.exports = router;
