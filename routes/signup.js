var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/UserModel');

router.get('/signup', (req, res)=>{
  res.render('signup',{message:null,error:null})
})

router.post('/signup', (req, res)=>{
  const { username, email, password, confirmPassword } = req.body;
  const user = new User({ username,email,password })
  const validationError = user.validateSync();
  if (!username) {
    return res.status(400).json({ error: { username: { message: 'Username field is required' } } });
  }
 
  // Check if the password and confirm password match
  if (password !== confirmPassword) {
    return res.render('signup',{message:'Password and Confirm Password do not match',error:null});
  }


   // Check all fields are not empty
  if (validationError){


    return res.render('signup',{message:null,error:validationError.errors});


  }
  // Check if the username is already taken
  User.findOne({ email })
    .then(existingUser => {
      if (existingUser) {
        return res.render('signup',{message:'Email already taken',error:null});
      }else{
          //hash the password using bcrypt
         return bcrypt.hash(password,10)
      }
    }).then(hashedPassword => {


     // Create a signup user in MongoDB
      const signupUser = new User({ username, email, password:hashedPassword });
     return signupUser.save();


    }).then(() => {
      // Redirect to a success page or login page
      res.redirect('/login');
    }).catch(error => {
      console.error(error);
   
    });


})
module.exports = router;