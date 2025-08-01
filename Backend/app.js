const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// Import models for testing
const User = require('./models/User');
const Exam = require('./models/Exam');
const Question = require('./models/Question');
const Result = require('./models/Result');
const Answer = require('./models/Answer');

// Import routes
const authRoutes = require('./routes/authRoutes');
const examRoutes = require('./routes/examRoutes');
const resultRoutes = require('./routes/resultRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration for production and development
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from these origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://exodinnary-online-mcq-system.onrender.com',
      process.env.CORS_ORIGIN
    ].filter(Boolean); // Remove any undefined values

    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/results', resultRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'MCQ System API is running!',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Test models route
app.get('/api/test-models', async (req, res) => {
  try {
    const modelTests = {
      User: !!User,
      Exam: !!Exam,
      Question: !!Question,
      Result: !!Result,
      Answer: !!Answer
    };
    
    res.json({
      message: 'All models loaded successfully!',
      models: modelTests,
      status: 'success'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error loading models',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 CORS Origins: ${corsOptions.origin ? 'Dynamic' : process.env.CORS_ORIGIN}`);
});

module.exports = app;