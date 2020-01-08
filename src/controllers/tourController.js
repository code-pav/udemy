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
      // Mongoose accepts string, -string, {field: 'acs/desc/accending/deccending/-1/1'}
      query = query.sort(req.query.sort.split(',').join(' '));
    } else {
      query = query.sort('-createdAt');
    }

    // fields limiting
    if (req.query.fields) {
      query = query.select('-__v ' + req.query.fields.split(',').join(' '));
    } else {
      query = query.select('-__v');
    }

    // same
    // const tours = await query.exec();
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
    // Saving model instance
    // const newTour = new Tour(req.body);
    // await newTour.save();
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

