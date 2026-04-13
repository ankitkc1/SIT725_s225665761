const express = require('express');
const router = express.Router();
const Controllers = require('../controllers');

router.get('/books', Controllers.booksController.getAllBooks);
router.get('/books/:id', Controllers.booksController.getBookById);
router.post('/books', Controllers.booksController.createBook);
router.put('/books/:id', Controllers.booksController.updateBook);

module.exports = router;