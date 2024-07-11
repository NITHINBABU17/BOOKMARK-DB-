var express = require('express');
var router = express.Router();
const Medicine = require('../models/medicine');
/* GET home page. */
router.get('/', function(req, res, next) {
    const val =req.query.value
    console.log(req.query.value)
    Medicine.find({"description":val}).then(data => {
        
        res.render('./syrup',{data:data})
    
      }).catch(error => {
    
        console.error(error);
        
      });
    
    });
    module.exports = router;