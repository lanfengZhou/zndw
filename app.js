var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var eletag = require('./routes/eletag');
var locobj = require('./routes/locobj');
var loctype = require('./routes/loctype');
var gps = require('./routes/gps');
var gpsobj = require('./routes/gpsobj');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname,'views')));

app.use('/', index);
app.use('/',eletag);
app.use('/eletag/query',eletag);
app.use('/eletag/add',eletag);
app.use('/eletag/delete',eletag);
app.use('/eletag/edit',eletag);
app.use('/eletag/checkTagnum',eletag);
app.use('/eletag/getTagnum',eletag);

app.use('/',locobj);
app.use('/locobj/query',locobj);
app.use('/locobj/add',locobj);
app.use('/locobj/delete',locobj);
app.use('/locobj/edit',locobj);
app.use('/locobj/unbind',locobj);
app.use('/locobj/getBindObj',locobj);
app.use('/locobj/getValue',locobj);
app.use('/locobj/saveArc',locobj);

app.use('/',loctype);
app.use('/loctype/query',loctype);
// app.use('/users', users);

app.use('/',gps);
app.use('/gps/query',gps);
app.use('/gps/add',gps);
app.use('/gps/delete',gps);
app.use('/gps/edit',gps);
app.use('/gps/checkTagnum',gps);
app.use('/gps/getTagnum',gps);

app.use('/',gpsobj);
app.use('/gpsobj/query',gpsobj);
app.use('/gpsobj/add',gpsobj);
app.use('/gpsobj/delete',gpsobj);
app.use('/gpsobj/edit',gpsobj);
app.use('/gpsobj/unbind',gpsobj);
app.use('/gpsobj/savepoint',gpsobj);
app.use('/gpsobj/getValue',gpsobj);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
app.listen(3000);
module.exports = app;
