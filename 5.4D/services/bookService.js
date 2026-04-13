const mongoose = require('mongoose');
const Book = require('../models/bookModel');

const ALLOWED_FIELDS = ['id', 'title', 'author', 'year', 'genre', 'summary', 'price'];
const UPDATE_ALLOWED_FIELDS = ['title', 'author', 'year', 'genre', 'summary', 'price'];

const createHttpError = (status, message, details = null) => {
  const error = new Error(message);
  error.status = status;
  if (details) {
    error.details = details;
  }
  return error;
};

const serializeBook = (book) => {
  if (!book) return null;

  const plainBook =
    typeof book.toObject === 'function'
      ? book.toObject({ versionKey: false })
      : { ...book };

  delete plainBook._id;

  if (
    plainBook.price !== undefined &&
    plainBook.price !== null &&
    typeof plainBook.price.toString === 'function'
  ) {
    plainBook.price = plainBook.price.toString();
  }

  return plainBook;
};

const normaliseValue = (field, value) => {
  if (typeof value === 'string') {
    value = value.trim();
  }

  if (field === 'year' && value !== '' && value !== undefined && value !== null) {
    return Number(value);
  }

  if (field === 'price' && value !== '' && value !== undefined && value !== null) {
    return String(value).trim();
  }

  return value;
};

const buildSafePayload = (input, { isUpdate = false } = {}) => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw createHttpError(400, 'Request body must be a JSON object.');
  }

  const receivedFields = Object.keys(input);

  if (isUpdate && Object.prototype.hasOwnProperty.call(input, 'id')) {
    throw createHttpError(400, 'id is immutable and cannot be updated.');
  }

  const allowedFields = isUpdate ? UPDATE_ALLOWED_FIELDS : ALLOWED_FIELDS;

  const unexpectedFields = receivedFields.filter((field) => !allowedFields.includes(field));
  if (unexpectedFields.length > 0) {
    throw createHttpError(
      400,
      `Unexpected field(s): ${unexpectedFields.join(', ')}. Allowed fields: ${allowedFields.join(', ')}.`
    );
  }

  const payload = {};

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(input, field)) {
      payload[field] = normaliseValue(field, input[field]);
    }
  }

  if (!isUpdate) {
    const missingFields = ALLOWED_FIELDS.filter(
      (field) => !Object.prototype.hasOwnProperty.call(payload, field)
    );

    if (missingFields.length > 0) {
      throw createHttpError(
        400,
        `Missing required field(s): ${missingFields.join(', ')}.`
      );
    }
  }

  if (isUpdate && Object.keys(payload).length === 0) {
    throw createHttpError(
      400,
      `Provide at least one updatable field: ${UPDATE_ALLOWED_FIELDS.join(', ')}.`
    );
  }

  return payload;
};

const mapMongooseError = (error) => {
  if (error?.code === 11000) {
    throw createHttpError(409, 'A book with this id already exists.');
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const details = Object.values(error.errors).map((item) => item.message);
    throw createHttpError(400, 'Validation failed.', details);
  }

  if (error instanceof mongoose.Error.CastError) {
    throw createHttpError(400, `${error.path} is invalid.`);
  }

  throw error;
};

const getAllBooks = async () => {
  const books = await Book.find({}).sort({ title: 1 });
  return books.map(serializeBook);
};

const getBookById = async (id) => {
  const book = await Book.findOne({ id });
  return serializeBook(book);
};

const createBook = async (bookData) => {
  const safePayload = buildSafePayload(bookData);

  try {
    const createdBook = await Book.create(safePayload);
    return serializeBook(createdBook);
  } catch (error) {
    mapMongooseError(error);
  }
};

const updateBook = async (id, bookData) => {
  const safePayload = buildSafePayload(bookData, { isUpdate: true });

  try {
    const updatedBook = await Book.findOneAndUpdate(
      { id },
      { $set: safePayload },
      {
        new: true,
        runValidators: true,
        context: 'query',
      }
    );

    return serializeBook(updatedBook);
  } catch (error) {
    mapMongooseError(error);
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
};