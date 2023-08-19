const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { validateSignup, validateLogin } = require('../../utils/validators/users');

const router = express.Router();



// Sign up
router.post('/signup', validateSignup, async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ email, username, hashedPassword, firstName, lastName });

    const safeUser = user.toSafeUser();

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  }
);


// Log in
router.post('/login', validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;

  const user = await User.unscoped().findOne({
      // allows either username or password to log in
      where: {
        [Op.or]: {
          username: credential,
          email: credential
        }
      }
    });

    if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
      // const err = new Error('Login failed');
      // err.status = 401;
      // err.title = 'Login failed';
      // err.errors = { credential: 'The provided credentials were invalid.' };
      // err.message = "Invalid credentials"
      // return next(err);
      res.status(401)
      return res.json({
        message: "Invalid credentials"
      })
    }

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  }
);

// Get Current User
router.get('/', requireAuth, restoreUser, async (req, res) => {
  const user = req.user
  const currentUser = await User.findOne({
    where: {
      id: user.id
    },
    attributes: ['id','firstName','lastName','email','username']
  });

  res.json(currentUser)
})

module.exports = router;
