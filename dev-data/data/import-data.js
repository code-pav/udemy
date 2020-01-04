require('dotenv').config({ path: '../../config.env' });
const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('../../src/models/tourModel');

const dbConnect = process.env.DB
  .replace('<PASSWORD>', process.env.DB_PASSWORD)
  .replace('<USERNAME>', process.env.DB_USER);

mongoose
  .connect(dbConnect,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
  .then(() => {
    console.log('Connection to db successful.')
  })
  .catch((err) => {
    console.log('Cannot connect to db', err)
  });

const data = JSON.parse(fs.readFileSync('./tours-simple.json', 'utf-8'));

async function loadData() {
  try {
    await Tour.create(data);
    console.log('Data loaded.')
  } catch (e) {
    console.log(e)
  }
  process.exit();

}

async function deleteData() {
  try {
    await Tour.deleteMany();
    console.log('Data deleted.')
  } catch (e) {
    console.log(e)
  }
  process.exit();

}

if (process.argv[2] === '--delete') {
  deleteData();
} else if (process.argv[2] === '--insert') {
  loadData();
} else {
  console.log('Please specify --delete or --insert flag and restart');
  process.exit();
}

