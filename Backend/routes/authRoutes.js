const express = require('express');
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  getAllUsers
} = require('../controllers/userController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (require authentication)
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);

// Admin only routes
router.get('/users', auth, adminAuth, getAllUsers);

module.exports = router;