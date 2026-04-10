const express = require('express');
const router = express.Router();
const Controllers = require('../controllers');

router.get('/books', Controllers.booksController.getAllBooks);
router.get('/books/:id', Controllers.booksController.getBookById);


module.exports = router;