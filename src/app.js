const express = require('express');
const morgan = require('morgan');
const app = express();

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const routes = require('./api/v1/');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app
  .use(express.json())
  .use(express.static(`${ __dirname }/public`))
  .use('/api/v1', routes)

  .all('*', (req, res, next) => {
    next(new AppError(`Can't find ${ req.originalUrl } on this server!`, 404));
  })
  .use(globalErrorHandler);

module.exports = app;
