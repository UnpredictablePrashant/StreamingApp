const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000', // React app URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(cookieParser());
app.use(express.json());

// Database connection
require('./util/conn');

// Routes
const healthRoutes = require('./routes/health.route');
const streamingRoutes = require('./routes/streaming.route');
const adminRoutes = require('./routes/admin.route');

app.use('/api/health', healthRoutes);
app.use('/api/streaming', streamingRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong on the server'
  });
});

app.listen(PORT, () => {
  console.log(`Streaming service running on port ${PORT}`);
});