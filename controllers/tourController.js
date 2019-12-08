const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${ __dirname }/../dev-data/data/tours-simple.json`, 'utf-8'));

const getAllTours = (req, res) => {
  res.status(200).json({ status: 'success', results: tours.length, data: { tours } });
};

const getTour = (req, res) => {
  const tour = tours.find(tour => tour.id === +req.params.id);
  if (!tour) return res.status(404).send({ status: 'fail', message: 'no such tour' });
  res.status(200).json({ status: 'success', data: { tour } });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };

  tours.push(newTour);

  fs.writeFile(`${ __dirname }/../dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    if (err) return res.status(500).send({ status: 'error', message: 'db is cannot be access' });
    res.status(201).json({ status: 'success', data: { tours: newTour } })
  });
};

const updateTour = (req, res) => {
  res.status(200).json({
    status: 'success', data: { tour: '<Updated tour here>' }
  })
};

const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success', data: null
  })
};

const checkId = (req, res, next, val) => {
  if (val > tours.length) {
    return res.status(404).json({ status: 'error', message: 'No such ID' })
  }
  next();
};

const checkBody = (req, res, next) => {
  const { price, name } = req.body;
  if (!price || !name) {
    return res.status(400).json({ status: 'error', message: 'specify price and name' });
  }
  next();
};

module.exports = { getAllTours, getTour, createTour, updateTour, deleteTour, checkId, checkBody };
