const Tour = require('../models/tourModel');

const getAllTours = (req, res) => {
  res
    .status(200)
    .json({
      status: 'success',
      data: {}
    })
};

const getTour = (req, res) => {
  res
    .status(200)
    .json({
      status: 'success',
      data: {}
    })
};

const createTour = (req, res) => {
  res
    .status(201)
    .json({
      status: 'success',
      data: {}
    })
};

const updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here>'
    }
  })
};

const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  })
};


const checkBody = (req, res, next) => {
  next();
};

module.exports = { getAllTours, getTour, createTour, updateTour, deleteTour, checkBody };

