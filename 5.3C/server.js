const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const PORT = 3004;
const app = express();

// Hardcoded MongoDB URI as required
mongoose.connect('mongodb://127.0.0.1:27017/tasksheets');

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const bookRoutes = require('./routes/bookRoutes');

// Mount at /api so these work exactly:
// /api/books
// /api/books/:id
// /api/integrity-check42
app.use('/api', bookRoutes);

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((req, res) => res.status(404).json({ message: 'Not found' }));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});