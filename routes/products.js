var express = require('express');
var router = express.Router();
var Product= require('../models/productsModel');

router.get('/', (req,res)=>{
    res.send('product')
});

module.exports = router;

var express = require('express');
var router = express.Router();

router.get('/createproduct', (req,res)=>{
    res.render('./create', {error: null})
});

router.post('/createproduct', (req, res) => {
    const { name, description, price } = req.body;
    const product = new Product({
        name,
        description,
        price
    });
    const validationError = product.validateSync();
    if (validationError) {
        res.render('./create', { error: validationError.errors});
    } else {
        product.save().then(() => {
                res.redirect('/');
            }).catch((error) => {
                console.error(error);
                
            });
   }
}) 
module.exports = router;
router.get('/retrieve_product', (req, res) => {

    Product.find().then(data => {
      res.render('./retrieve',{data:data})
  
    }).catch(error => {
  
      console.error(error);
      
    });
  
  });
  module.exports = router;
  router.get('/:id',(req , res) =>{
    const productId = req.params.id;
   Product.findById(productId).lean().then(product =>{
        res.render('./',{product:product,error: null
})
    }).catch(error => {
        console.error(error);
      });
})
router.post('/:id', (req, res) => {
    const productId = req.params.id;
    const { name, description, price } = req.body;
    const product = new Product({ name, description, price })
    const validationError = product.validateSync();
    if (validationError) {
        // If there are validation errors, re-render the form with error messages
    res.render('./', {product:product, error: validationError.errors});


    } else {
    Product.findByIdAndUpdate(
        productId,
        { name, description, price }
      )
        .then(() => {
          res.redirect('/retrieve_product'); // Redirect to the product list after updating
        })
        .catch(error => {
          console.error(error);
        });
    }
})
module.exports = router;
router.get('/:id',(req , res) =>{
    const productId = req.params.id;
   Product.findById(productId).then(product =>{
        res.render('./',{product:product})
    }).catch(error => {
        console.error(error);
      });
})
router.post('/:id',(req, res) =>{
    const productId = req.params.id;
    Product.findByIdAndDelete(productId)
        .then(() => {
          res.redirect('/retrieve_product'); // Redirect to the product list after deleting
        })
        .catch(error => {
          console.error(error);
        });
})