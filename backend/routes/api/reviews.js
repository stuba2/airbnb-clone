const express = require('express');
const bcrypt = require('bcryptjs');

const { requireAuth, restoreUser } = require('../../utils/auth');
const { Review, User, Spot, SpotImage, sequelize } = require('../../db/models');
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
})

module.exports = router;
