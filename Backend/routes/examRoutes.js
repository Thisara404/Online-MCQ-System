const express = require('express');
const {
  getAllExams,
  getExamById,
  getExamQuestions,
  createExam,
  updateExam,
  deleteExam,
  getAllExamsAdmin
} = require('../controllers/examController');
const { auth, adminAuth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllExams);
router.get('/:id', getExamById);

// Protected routes (require authentication)
router.get('/:id/questions', auth, getExamQuestions);

// Admin only routes
router.get('/admin/all', auth, adminAuth, getAllExamsAdmin); // New admin route
router.post('/', auth, adminAuth, createExam);
router.put('/:id', auth, adminAuth, updateExam);
router.delete('/:id', auth, adminAuth, deleteExam);

module.exports = router;