var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var profesorRouter = require('./routes/profesores');
var gruposRouter = require('./routes/grupos');
var estudianteRouter = require('./routes/estudiantes');
var awsRouter = require('./amazon_s3')
var evaluacionRoutes = require('./routes/evaluacion');
var cursosRoutes = require('./routes/cursos');
var horariosRoutes = require('./routes/horarios');
var nivelesRoutes = require('./routes/nivel');
var correoRoutes = require('./routes/correo');
const cors = require('cors');

var app = express();

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use(correoRoutes);
app.use(usersRouter);
app.use(profesorRouter);
app.use(gruposRouter);
app.use(awsRouter);
app.use(estudianteRouter);
app.use(evaluacionRoutes);
app.use(cursosRoutes);
app.use(horariosRoutes);
app.use(nivelesRoutes);
// catch 404 and forward to error handler
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
