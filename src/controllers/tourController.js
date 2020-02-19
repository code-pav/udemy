const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures.js');
const catchAsync = require('../utils/catchAsync.js');

const aliasTopTours = async (req, res, next) => {
  req.query = {
    limit: '5',
    sort: 'price,-ratingsAverage',
    fields: 'name,price,ratingsAverage,summary,difficulty',
    ...req.query,
  };
  next();
};

const getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // const tours = await features.query.exec();
  const tours = await features.query;

  res
    .status(200)
    .json({
      status: 'success',
      results: tours.length,
      data: tours,
    })
});

const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  res
    .status(200)
    .json({
      status: 'success',
      data: tour
    })
});

const createTour = catchAsync(async (req, res, next) => {
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
});

const updateTour = catchAsync(async (req, res, next) => {
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
});

const deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    throw Error('Tour not found');
  }
  res.status(204).json({
    status: 'success',
    data: null
  })
});

const getTourStats = catchAsync(async (req, res, next) => {
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
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = Number(req.params.year); // 2021
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${ year }-01-01`),
          $lte: new Date(`${ year }-12-31`),
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStart: { $sum: 1 },
        tours: { $push: '$name' },
      }
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      }
    },
    {
      $sort: { numToursStart: -1 },
    },
    // {
    //   $limit: 4,
    // }
  ]);

  res.status(200).json({
    status: 'success',
    size: plan.length,
    data: plan,
  })
});

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan
};

