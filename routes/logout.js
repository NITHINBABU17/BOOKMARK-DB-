var express = require('express');
var router = express.Router();
//route for logout


router.get('/logout' ,(req,res)=>{
    req.session.destroy((err) =>{
      if (err){
        console.log(err);
        res.send('Error')
      }else{
        res.redirect('/login')
      }
    });
    });
    module.exports = router;
