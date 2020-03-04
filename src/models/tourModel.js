const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour should have name."],
    unique: true,
    trim: true,
    maxlength: [40, "Tour max length is 40"],
    minlength: [5, "Tour min length is 5"],
  },
  duration: {
    type: Number,
    required: [true, "A tour must have a duration"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "Tour must have a groupSize"],
  },
  difficulty: {
    type: String,
    required: [true, "Tour should have difficulty"],
    // THE STRING ONLY
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Only easy, medium or difficult allowed',
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    // DATES TOO
    min: [1, 'Ratings must be above 1.0'],
    max: [5, 'Ratings must be below 5.0'],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "A tour should have price."],
    // hide from default select
    // select: false,
  },
  priceDiscount: {
    type: Number,
    validate: {
      message: 'Discount price ({VALUE}) should be below regular price.',
      validator: function (value) {
        // this pointing on document only on creation
        return value < this.price;
      }
    }
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
  slug: String,
  secretTour: {
    type: Boolean,
    default: false,
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOC MIDDLEWARE: runs before .save() and .create() but not 'insertMany()'
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('I am save...');
//   next();
// });
//
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// tourSchema.pre('find', function (next) {

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(Date.now() - this.start);
  next();
});

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
