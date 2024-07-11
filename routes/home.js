var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render("home", { usrname: "Guest" });
});


module.exports = router;


