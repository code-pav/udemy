const express = require('express');
const morgan = require('morgan');
const app = express();

const routes = require('./api/v1/');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app
  .use(express.json())
  .use(express.static(`${ __dirname }/public`))
  .use((err, req, res, next) => {
    err ? res.status(400).send({ status: "error", message: "Bad request" }) : next();
  });

app.use('/api/v1', routes);

module.exports = app;
