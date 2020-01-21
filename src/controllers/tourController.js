const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures.js');

const aliasTopTours = async (req, res, next) => {
  req.query = {
    limit: '5',
    sort: 'price,-ratingsAverage',
    fields: 'name,price,ratingsAverage,summary,difficulty',
    ...req.query,
  };
  next();
};

const getAllTours = async (req, res) => {
  try {

    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // same
    // const tours = await features.query.exec();
    const tours = await features.query;

    // If no result on page throw error
    // if (req.query.page && tours.length === 0) {
    //   throw Error('This page does not exist');
    // }

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
        message: err.message || err,
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

const getTourStats = async (req, res) => {
  try {
    console.log('1');
    const pipeline = Tour.aggregate([
      {
        $match: {
          ratingsAverage: { $gte: 4.0 },
          // ratingsAverage: 4.7,
        }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        }
      },
      {
        $sort: { avgPrice: 1 }
      },
      // {
      //   $match: {
      //     _id: { $ne: 'EASY' },
      //   }
      // },
    ]);

    const stats = await pipeline;

    res.status(200).json({
      status: 'success',
      data: stats
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    })
  }
};

const getMonthlyPlan = async (req, res) => {
  try {
    const year = Number(req.params.year);
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      }
    ]);

    res.status(200).json({
      status: 'success',
      size: plan.length,
      data: plan,
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    })
  }
};
module.exports = { getAllTours, getTour, createTour, updateTour, deleteTour, aliasTopTours, getTourStats, getMonthlyPlan };

