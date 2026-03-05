const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Streaming Backend Running!' });
});

app.get('/api/videos', (req, res) => {
  res.json({ videos: ['video1.mp4', 'video2.mp4'], message: 'Video list' });
});

app.post('/api/upload', (req, res) => {
  res.json({ message: 'Upload endpoint - ready for multer' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
