const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const linkRoutes = require('./routes/linkRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'BridgeBio API çalışıyor.' });
});

app.get('/api/health', (req, res) => {
  res.json({ message: 'BridgeBio API çalışıyor.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});