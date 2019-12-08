const fs = require('fs');

const users = JSON.parse(fs.readFileSync(`${ __dirname }/../dev-data/data/users.json`));

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'fail', message: 'This route not yet implemeted',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'fail', message: 'This route not yet implemeted',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'fail', message: 'This route not yet implemeted',
  });
};

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
