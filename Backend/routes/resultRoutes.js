const express = require('express');
const {
  submitExam,
  getMyResults,
  getResultById,
  getAllResults,
  getExamStats,
  deleteResult
} = require('../controllers/resultController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Protected routes (require authentication)
router.post('/submit', auth, submitExam);
router.get('/my-results', auth, getMyResults);
router.get('/:id', auth, getResultById);

// Admin only routes
router.get('/', auth, adminAuth, getAllResults);
router.get('/exam/:examId/stats', auth, adminAuth, getExamStats);
router.delete('/:id', auth, adminAuth, deleteResult);

module.exports = router;