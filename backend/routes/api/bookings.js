const express = require('express');
const bcrypt = require('bcryptjs');

const { requireAuth, restoreUser } = require('../../utils/auth');
const { Booking, Spot, SpotImage, Sequelize } = require('../../db/models');
const { validateBooking } = require('../../utils/validators/bookings');
const spotimage = require('../../db/models/spotimage');

const router = express.Router();

// Get all of the Current User's Bookings
router.get('/', restoreUser, requireAuth, async (req, res) => {
  const user = req.user;

  const bookings = await Booking.findAll({
    where: {
      userId: user.id
    },
    include: [
      {
        model: Spot,
        attributes: [
          'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'
        ]
      }
    ]
  });

  let arr = []
  for (let i = 0; i < bookings.length; i++) {
    let booking = bookings[i];
    let bookingObject = booking.toJSON()
    let spot = bookingObject.Spot

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

    let arrId = bookingObject.id
    let arrSpotId = bookingObject.spotId
    let arrUserId = bookingObject.userId
    let arrStartDate = bookingObject.startDate
    let arrEndDate = bookingObject.endDate
    let arrCreatedAt = bookingObject.createdAt
    let arrUpdatedAt = bookingObject.updatedAt

    retObject = {
      id: arrId,
      spotId: arrSpotId,
      Spot: spot,
      userId: arrUserId,
      startDate: arrStartDate,
      endDate: arrEndDate,
      createdAt: arrCreatedAt,
      updatedAt: arrUpdatedAt
    }


    arr.push(retObject)
    // console.log(bookingObject)
  }
// console.log({arr})
  res.json({Bookings: arr})
});

module.exports = router;
