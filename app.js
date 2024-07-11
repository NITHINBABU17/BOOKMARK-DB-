var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


const db = require('./database/db')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var arrayRouter=require('./routes/array');
var ecommerceRouter = require('./routes/ecommerce');
var entryRouter = require('./routes/entry');
var firstRouter = require('./routes/first')
var homeRouter = require('./routes/home')
var loginRouter = require('./routes/login')
var priceRouter = require('./routes/price')
var signupRouter = require('./routes/signup')
var contactUsRouter= require('./routes/contact-us')
var contactusformRouter= require('./routes/contact-us-form')
var logoutRouter= require('./routes/logout')
var syrupRouter=require('./routes/syrup')
var medlistRouter=require('./routes/medlist')
var apiRouter = require('./routes/api');
var bookmarkRouter = require('./routes/bookmark');
var urllistRouter= require('./routes/urllist');
var productsRouter = require('./routes/products');
var urlupdaterouter= require('./routes/urlupdate');
var productAjaxrouter= require('./routes/productAjax');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//layout setup
//app.use(expressLayouts);
//app.set('layout', 'layout');
//import the express-session
const session = require('express-session');

// session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret-key',
  resave: false,
  saveUninitialized: true,
}));
app.get('/favicon.ico', (req, res) => {
  // Send the favicon file
  res.sendFile(__dirname + '/public/favicon.ico');
});
// const searchRouter = require('./routes/search')(db);
// app.use('/search', searchRouter);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/array',arrayRouter);
app.use('/ecommerce', ecommerceRouter);
app.use('/entry', entryRouter);
app.use('/first', firstRouter);
app.use('/home', homeRouter);
app.use('/login', loginRouter);
app.use('/price', priceRouter);
app.use('/', signupRouter);
app.use('/contactus',contactUsRouter)
app.use('/contact-us-form',contactusformRouter)
app.use('/',logoutRouter)
app.use('/syrup',syrupRouter)
app.use('/medlist',medlistRouter)
app.use('/api', apiRouter);
app.use('/bookmark', bookmarkRouter);
app.use('/urllist',urllistRouter);
app.use('/',productsRouter);
app.use('/urlupdate',urlupdaterouter);
app.use('/productAjax',productAjaxrouter);
app.use(function(req, res, next) {
  next(createError(404));
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');

  
});


module.exports = app;
