var express = require('express');
var router = express.Router();


const { validationResult ,check } = require('express-validator');


router.get('/', function(req, res) {
  res.render("first", { errors: [] });
});


//route for handling form submission with validations
router.post('/createUser', [
  // Add validation rules here
  check('email').isEmail().withMessage('Invalid email address'),
  check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
], function(req, res) {
  // Validate the request
  const errors = validationResult(req);


  if (!errors.isEmpty()) {
    // There are validation errors, render the form with errors
    res.render('first', { errors: errors.array() });
  } else {
    // No validation errors, proceed with rendering the form data
    const email = req.body.email;
    res.render('form', {
      email: email,
      allData: req.body
    });
  }
});
module.exports = router;