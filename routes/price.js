var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var  ecom = [
        {'name': 'laptop', 'price': 35000, 'availability': 'true'},
        {'name': 'mobile', 'price': 30000, 'availability': 'true'},
        {'name': 'bike', 'price': 100000, 'availability': 'false'},
        {'name': 'bag', 'price': 1000, 'availability': 'true'},
        {'name': 'pen', 'price': 10, 'availability': 'true'},
        {'name': 'table', 'price': 1500, 'availability': 'true'},
        {'name': 'LED bulb', 'price': 60, 'availability': 'true'},
        {'name': 'chair', 'price': 700, 'availability': 'false'},
        {'name': 'mango fruit', 'price': 100, 'availability': 'true'},
        {'name': 'pineapple fruit', 'price': 80, 'availability': 'false'},
    ]
  res.render('price', { ecom:ecom});
});

module.exports = router;
