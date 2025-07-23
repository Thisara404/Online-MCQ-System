const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: [true, 'Exam ID is required']
  },
  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: [0, 'Score cannot be negative'],
    max: [100, 'Score cannot exceed 100']
  },
  totalQuestions: {
    type: Number,
    required: [true, 'Total questions is required'],
    min: [1, 'Total questions must be at least 1']
  },
  correctAnswers: {
    type: Number,
    required: [true, 'Correct answers count is required'],
    min: [0, 'Correct answers cannot be negative']
  },
  wrongAnswers: {
    type: Number,
    required: [true, 'Wrong answers count is required'],
    min: [0, 'Wrong answers cannot be negative']
  },
  unanswered: {
    type: Number,
    default: 0,
    min: [0, 'Unanswered cannot be negative']
  },
  timeTaken: {
    type: Number, // in minutes
    required: [true, 'Time taken is required'],
    min: [0, 'Time taken cannot be negative']
  },
  passed: {
    type: Boolean,
    required: [true, 'Pass status is required']
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required']
  },
  status: {
    type: String,
    enum: ['completed', 'abandoned', 'timeout'],
    default: 'completed'
  }
}, {
  timestamps: true
});

// Virtual for answers
resultSchema.virtual('answers', {
  ref: 'Answer',
  localField: '_id',
  foreignField: 'resultId'
});

// Compound index for user and exam (one result per user per exam)
resultSchema.index({ userId: 1, examId: 1 }, { unique: true });

// Ensure virtual fields are serialized
resultSchema.set('toJSON', { virtuals: true });
resultSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Result', resultSchema);