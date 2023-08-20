const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { requireAuth, restoreUser, plsLogIn } = require('../../utils/auth');
const { Booking, Spot, SpotImage, Sequelize } = require('../../db/models');
const { validateBooking } = require('../../utils/validators/bookings');
const spotimage = require('../../db/models/spotimage');
const { isEmpty } = require('../../utils/validation')

const router = express.Router();

// Get all of the Current User's Bookings
router.get('/', restoreUser, requireAuth, plsLogIn, async (req, res) => {
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

// Edit a Booking
router.put('/:bookingId', restoreUser, requireAuth, plsLogIn, async (req, res) => {
  if (isEmpty(req.body)) {
    res.status(400)
    return res.json({
      message: "Bad Request",
      errors: {
        startDate: "startDate is required",
        endDate: "endDate is required"
      }
    })
  }

  const { bookingId } = req.params;
  const { startDate, endDate } = req.body;
  const user = req.user;
  const errors = {}

  if (isNaN(parseInt(bookingId))) {
    res.status(404)
    return res.json({
      message: "bookingId needs to be a number"
    })
  }

  const booking = await Booking.findByPk(+bookingId);

  // Restricts if user isn't the owner
  if (user.id !== booking.userId) {
    res.status(403)
    return res.json({
      message: "Forbidden"
    })
  }

  // No booking found error
  if (!booking) {
    res.status(404);
    return res.json({
      message: "Booking couldn't be found"
    })
  }

  // Booking in the past error
  if (booking.endDate < new Date()) {
    res.status(403)
    return res.json({
      message: "Past bookings can't be modified"
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

  booking.startDate = startDate
  booking.endDate = endDate

  await booking.save()

  res.json(booking)
});

// Delete a Booking
router.delete('/:bookingId', restoreUser, requireAuth, plsLogIn, async (req, res) => {
  const { bookingId } = req.params;
  const user = req.user

  if (isNaN(parseInt(bookingId))) {
    res.status(404)
    return res.json({
      message: "bookingId needs to be a number"
    })
  }

  const booking = await Booking.findByPk(+bookingId)

  // No Booking found error
  if (!booking) {
    res.status(404);
    return res.json({
      message: "Booking couldn't be found"
    })
  };

  const spot = await Spot.findAll({
    where: {
      id: booking.spotId
    }
  })

  // Restricts if user isn't the owner OR if user booked the spot
  if (user.id !== booking.userId && user.id !== spot.ownerId) {
    res.status(403)
    return res.json({
      message: "Forbidden"
    })
  }

  // Booking already started error
  const conflictBookingQStart = await Booking.findAll({
    where: {
      startDate: {
        [Op.lte]: booking.startDate
      },
      endDate: {
        [Op.gte]: booking.BookingstartDate
      }
    }
  });
  if (conflictBookingQStart[0]) {
    res.status(403)
    return res.json({
      message: "Bookings that have ben started can't be deleted"
    })
  }

  await booking.destroy();

  res.json({
    message: "Successfully deleted"
  })
});



module.exports = router;
