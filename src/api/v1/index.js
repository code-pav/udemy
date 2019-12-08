const express = require('express');
const usersRoute = require('./routes/userRoutes');
const toursRoute = require('./routes/tourRoutes');

const router = express.Router();



router
  .use('/users', usersRoute)
  .use('/tours', toursRoute);

module.exports = router;
