const express = require('express');
const bcrypt = require('bcryptjs');

const { requireAuth, restoreUser } = require('../../utils/auth');
const { Booking } = require('../../db/models');
const { validateBooking } = require('../../utils/validators/bookings');

const router = express.Router();


module.exports = router;
