var express = require('express');
var router = express.Router();
const Medicine = require('../models/medicine');
/* GET home page. */
router.get('/', function(req, res, next) {
    
    Medicine.find({}).then(data => {
        
        res.render('medlist',{data:data})
    
      }).catch(error => {
    
        console.error(error);
        
      });
    
    });
    module.exports = router;