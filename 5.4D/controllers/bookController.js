const BookService = require('../services/bookService');

const DEVELOPER_ID = 's225665761';

const getAllBooks = async (req, res, next) => {
  try {
    const books = await BookService.getAllBooks();
    res.status(200).json({
      statusCode: 200,
      data: books,
      message: 'Success',
      developedBy: DEVELOPER_ID
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
        message: 'Book not found',
        developedBy: DEVELOPER_ID
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: book,
      message: 'Success',
      developedBy: DEVELOPER_ID
    });
  } catch (error) {
    next(error);
  }
};

const createBook = async (req, res, next) => {
  try {
    const createdBook = await BookService.createBook(req.body);

    res.status(201).json({
      statusCode: 201,
      message: 'Book created successfully',
      developedBy: DEVELOPER_ID,
      data: createdBook
    });
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const updatedBook = await BookService.updateBook(req.params.id, req.body);

    if (!updatedBook) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Book not found',
        developedBy: DEVELOPER_ID
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Book updated successfully',
      developedBy: DEVELOPER_ID,
      data: updatedBook
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook
};