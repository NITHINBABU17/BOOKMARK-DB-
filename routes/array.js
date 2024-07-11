var express= require('express');
var router= express.Router();
router.get('/',function(req,res,next)
{   
    var numbers=[1,2,3,4,5,6,7,8,9]
    res.render('array',{number:numbers})
});
module.exports=router;