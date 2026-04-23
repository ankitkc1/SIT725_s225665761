const Book = require('../models/bookModel');

const getAllBooks = async () => Book.find({});
const getBookById = async (id) => Book.findOne({ id });
const createBook = async (data) => Book.create(data);
const updateBook = async (id, data) =>
  Book.findOneAndUpdate(
    { id },
    data,
    { new: true, runValidators: true, context: 'query', strict: 'throw' }
  );

module.exports = { getAllBooks, getBookById, createBook, updateBook };