const Tour = require('../models/tourModel');

const getAllTours = async (req, res) => {
  // console.log(req.query);
  try {
    let queryObject = { ...req.query };
    // excluding some fields
    const exludedFields = ['page', 'offset', 'sort', 'limit', 'fields'];
    exludedFields.forEach(exclude => delete queryObject[exclude]);

    // adv filtering
    const queryString = JSON.stringify(queryObject);
    queryObject = JSON.parse(queryString.replace(/\b([gl]te?)\b/gi, (match) => `$${ match }`));

    // create query
    let query = Tour.find(queryObject);

    // sorting
    if (req.query.sort) {
      query = query.sort(req.query.sort);
    }

    // exec query
    const tours = await query;

    res
      .status(200)
      .json({
        status: 'success',
        results: tours.length,
        data: tours,
      })
  } catch (err) {
    res
      .status(400)
      .json({
        status: 'fail',
        message: err.message,
      })
  }
};

const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res
      .status(200)
      .json({
        status: 'success',
        data: tour
      })
  } catch (err) {
    res
      .status(400)
      .json({
        status: 'fail',
        message: err.message,
      })
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res
      .status(201)
      .json({
        status: 'success',
        data: {
          tour: newTour
        }
      })
  } catch (err) {
    res
      .status(400)
      .json({
        status: 'error',
        message: err.message
      })
  }

};

const updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour: updatedTour,
      }
    })
  } catch (err) {
    res.status(200).json({
      status: 'fail',
      message: err.message,
    })
  }
};

const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) {
      throw Error('Tour not found');
    }
    res.status(204).json({
      status: 'success',
      data: null
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    })
  }
};

module.exports = { getAllTours, getTour, createTour, updateTour, deleteTour };

