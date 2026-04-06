const BookService = require('../services/bookService');

const getAllBooks = (req, res) => {
  const books = BookService.getAllBooks();
  res.json({ statusCode: 200, data: books, message: 'Success' });
};

const getBookById = (req, res) => {
  const book = BookService.getBookById(req.params.id);

  if (!book) {
    return res.status(404).json({
      statusCode: 404,
      message: 'Book not found'
    });
  }

  res.json({ statusCode: 200, data: book, message: 'Success' });
};

module.exports = {
  getAllBooks,
  getBookById
};