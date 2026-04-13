const mongoose = require('mongoose');

const currentYear = new Date().getFullYear();

const bookSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'id is required.'],
      unique: true,
      trim: true,
      match: [/^[A-Za-z0-9_-]{1,30}$/, 'id must be 1-30 characters and use only letters, numbers, hyphen or underscore.']
    },
    title: {
      type: String,
      required: [true, 'title is required.'],
      trim: true,
      minlength: [1, 'title must not be empty.'],
      maxlength: [200, 'title must be at most 200 characters.']
    },
    author: {
      type: String,
      required: [true, 'author is required.'],
      trim: true,
      minlength: [2, 'author must be at least 2 characters.'],
      maxlength: [120, 'author must be at most 120 characters.']
    },
    year: {
      type: Number,
      required: [true, 'year is required.'],
      min: [1450, 'year must be 1450 or later.'],
      max: [currentYear + 1, `year must be ${currentYear + 1} or earlier.`],
      validate: {
        validator: Number.isInteger,
        message: 'year must be a whole number.'
      }
    },
    genre: {
      type: String,
      required: [true, 'genre is required.'],
      trim: true,
      minlength: [2, 'genre must be at least 2 characters.'],
      maxlength: [60, 'genre must be at most 60 characters.']
    },
    summary: {
      type: String,
      required: [true, 'summary is required.'],
      trim: true,
      minlength: [10, 'summary must be at least 10 characters.'],
      maxlength: [2000, 'summary must be at most 2000 characters.']
    },
    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: [true, 'price is required.'],
      validate: {
        validator: function (value) {
          const str = value?.toString?.() ?? '';
          return /^(0|[1-9]\d{0,2})(\.\d{1,2})?$/.test(str) && Number(str) <= 1000;
        },
        message: 'price must be a valid AUD amount between 0.00 and 1000.00 with up to 2 decimal places.'
      }
    }
  },
  {
    strict: 'throw'
  }
);

module.exports = mongoose.model('Book', bookSchema);