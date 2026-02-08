require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const counterRoutes = require('./routes/counter');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/counter', counterRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server běží na portu ${PORT}`);
});
