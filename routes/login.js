const express = require('express');
const router = express.Router();
const { validationResult, check } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../models/UserModel');

// Validation middleware
const validateEmail = [
  check('email').isEmail().withMessage('Please enter a valid email address')
];

const validatePassword = [
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];
router.get('/', function (req, res) {
  res.render('login', { errors: [], message: null }); // Pass message here
});



router.post('/login', [
  validateEmail,
  validatePassword
], function (req, cdres) {
  let errors = validationResult(req).array();

  if (!Array.isArray(errors)) {
    // If errors is not an array, initialize it as an empty array
    errors = [];
  }

  if (errors.length > 0) {
    // There are validation errors, render the form with errors
    return res.render('login', { errors: errors, message: null });
  } else {
    const { email, password } = req.body;
    let foundUser; // Declare foundUser here

    User.findOne({ email })
      .then(user => {
        if (!user) {
          return res.render('login', { message: 'Incorrect Email Address.', errors: [] });
        }
        foundUser = user; // Assign user to foundUser
        return bcrypt.compare(password, user.password);
      })
      .then(isPasswordValid => {
        if (!isPasswordValid) {
          return res.render('login', { message: 'Incorrect password.', errors: [] });
        }

        // Set user's ID and email in the session
        req.session.userId = foundUser._id;
        req.session.userEmail = foundUser.email;
        req.session.username = foundUser.username;
        res.render('index', { usrname: req.session.username, errors: [] }); // Pass errors here
      })
      .catch(error => {
        console.error(error);
        res.status(500).send('Internal Server Error');
      });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.send('Error');
    } else {
      res.redirect('/login');
    }
  });
});

module.exports = router;
