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

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Basic test routes (temporary)
app.get('/api/exams', (req, res) => {
  res.json({ message: 'Exams route working!' });
});

app.get('/api/results', (req, res) => {
  res.json({ message: 'Results route working!' });
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
  console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN}`);
});

module.exports = app;