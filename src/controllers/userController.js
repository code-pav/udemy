const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/appError.js');
const APIFeatures = require('../utils/apiFeatures.js');


const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res
    .status(200)
    .json({
      status: 'success',
      results: users.length,
      data: users,
    })
});

const getUser = (req, res) => {
  res.status(500).json({
    status: 'fail', message: 'This route not yet implemeted',
  });
};

const createUser = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  res
    .status(201)
    .json({
      status: 'success',
      data: {
        user,
      }
    })
});

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'fail', message: 'This route not yet implemeted',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'fail', message: 'This route not yet implemeted',
  });
};

exports.getAllUsers = getAllUsers;
exports.getUser = getUser;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
