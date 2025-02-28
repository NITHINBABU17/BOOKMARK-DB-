var express = require('express');
var router = express.Router();
const Product = require('../models/productsModel')
const bcrypt = require('bcrypt');
const User = require('../models/UserModel');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


// router.get('/simpleapi', (req,res) => {
//     res.status(200).send({'text': 'Hello world, This is your first api call'})
// })


router.get('/create_product', (req,res)=>{
    res.render('./product/create', {error: null})
});
module.exports = router;


//for product create api

 router.post('/create_product_api', (req, res) => {
   const { name, description, price } = req.body;
   const product = new Product({ name, description, price });

   const validationError = product.validateSync();

   // If there are validation errors, return the error messages
   if (validationError) {
       const errors = {
           name: validationError.errors.name ? validationError.errors.name.properties.message : undefined,
           description: validationError.errors.description ? validationError.errors.description.properties.message : undefined,
           price: validationError.errors.price ? validationError.errors.price.properties.message : undefined,
       };
       return res.status(400).json({ errors });
   }

   // Save the product to the database using promises
   product.save()
       .then(() => {
           res.status(201).json({ message: 'Product created successfully' });
        })
       .catch((error) => {
           console.error(error);
           res.status(500).json({ message: 'Server Error' });
       });
});
//for getting products


router.get('/retrieve_product_api', (req, res) => {
    Product.find()
        .then(data => {
            const serializedData = data.map(product => ({
                id: product._id,
                name: product.name,
            
            }));
            res.status(200).json({ data: serializedData });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
});
// for updating products


router.put('/update_product_api/:id', (req, res) => {
    const productId = req.params.id;
    const { name, description, price } = req.body;


    const product = new Product({ name, description, price });
    const validationError = product.validateSync();


    // If there are validation errors, return the error messages
    if (validationError) {
        const errors = {
            name: validationError.errors.name ? validationError.errors.name.properties.message : undefined,
            description: validationError.errors.description ? validationError.errors.description.properties.message : undefined,
            price: validationError.errors.price ? validationError.errors.price.properties.message : undefined,
        };
        return res.status(400).json({ errors });
    }


    // Update the product in the database
    Product.findByIdAndUpdate(productId, { name, description, price })
        .then(() => {
            res.status(200).json({ message: 'Product updated successfully' });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
});
//for deleting product


router.delete('/delete_product_api/:id', (req, res) => {
    const productId = req.params.id;


    Product.findByIdAndDelete(productId)
        .then(() => {
            res.status(200).json({ message: 'Product deleted successfully' });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
});


// route for signup

router.post('/signupapi', (req, res) => {
    const { email, password, confirmPassword } = req.body;
 
    // Check if the password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Password and Confirm Password do not match' });
    }
 
    // Check all fields are not empty
    const user = new User({ email, password });
    const validationError = user.validateSync();
 
    if (validationError) {
      return res.status(400).json({ error: validationError.errors });
    }
 
    // Check if the email is already taken
    User.findOne({ email })
      .then(existingUser => {
        if (existingUser) {
          return res.status(400).json({ message: 'Email already taken' });
        }
 
        // Hash the password using bcrypt
        return bcrypt.hash(password, 10);
      })
      .then(hashedPassword => {
        // Create a new user in MongoDB
        const newUser = new User({ email, password: hashedPassword });
        return newUser.save();
      })
      .then(() => {
        // Respond with success
        res.status(201).json({ message: 'Account created successfully' });
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      });
  });


// for generating  secret key


const generateSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
};
// console.log(generateSecretKey());

// Initialize JWT secret key once at the application startup
const secretKey = generateSecretKey();
process.env.JWT_SECRET = secretKey;

router.post('/loginapi', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the token in the response
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - Missing token' });
  }

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET , (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }

    req.userId = decoded.userId;
    next();
  });
};
 //added verifyToken for securing the route


 router.post('/create_product_api',verifyToken, (req, res) => {
  // your code......
});
module.exports = router;