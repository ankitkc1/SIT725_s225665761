const Book = require('../models/bookModel');

const getAllBooks = () => {
  return Book.find({}).lean();
};

const getBookById = (id) => {
  return Book.findOne({ id: id }).lean();
};

module.exports = {
  getAllBooks,
  getBookById
};