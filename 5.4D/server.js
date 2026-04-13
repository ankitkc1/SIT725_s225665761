const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const PORT = 3004;
const app = express();

//Hardcoded MongoDB URI as required
mongoose.connect('mongodb://127.0.0.1:27017/tasksheets');

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const bookRoutes = require('./routes/bookRoutes');

app.use('/api', bookRoutes);

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/integrity-check42', (req, res) => {
  res.status(204).send();
});

app.use((req, res) => {
  res.status(404).json({
    statusCode: 404,
    message: 'Not found'
  });
});

app.use((error, _req, res, _next) => {
  const statusCode = error.status || 500;
  const response = {
    statusCode,
    message: error.message || 'Internal server error',
  };

  if (error.details) {
    response.details = error.details;
  }

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json(response);
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});