const express = require('express');
const path = require('path');

const PORT = 3004;

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const bookRoutes = require('./routes/bookRoutes');
app.use('/api/books', bookRoutes);

app.get('/api/_integrity-check', (_req, res) => res.sendStatus(204));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((req, res) => res.status(404).json({ message: 'Not found' }));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});