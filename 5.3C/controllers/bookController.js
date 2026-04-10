const BookService = require('../services/bookService');

const getAllBooks = async (req, res, next) => {
  try {
    const books = await BookService.getAllBooks();
    res.json({
      statusCode: 200,
      data: books,
      message: 'Success'
    });
  } catch (error) {
    next(error);
  }
};

const getBookById = async (req, res, next) => {
  try {
    const book = await BookService.getBookById(req.params.id);

    if (!book) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Book not found'
      });
    }

    res.json({
      statusCode: 200,
      data: book,
      message: 'Success'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBooks,
  getBookById
};