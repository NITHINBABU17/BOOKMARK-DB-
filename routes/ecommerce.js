var express= require('express');
var router= express.Router();
router.get('/',function(req,res,next)
{
    var usrname='NITHIN'
    res.render('ecommerce',{usrname:usrname})
});
module.exports=router;