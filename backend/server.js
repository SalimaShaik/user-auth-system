require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Import auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes); // All auth routes will start with /api/auth

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running successfully 🚀');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
