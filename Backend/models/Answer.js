const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  resultId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Result',
    required: [true, 'Result ID is required']
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: [true, 'Question ID is required']
  },
  selectedOption: {
    type: String,
    enum: ['A', 'B', 'C', 'D', null],
    default: null // null means unanswered
  },
  correctOption: {
    type: String,
    required: [true, 'Correct option is required'],
    enum: ['A', 'B', 'C', 'D']
  },
  isCorrect: {
    type: Boolean,
    required: [true, 'Correct status is required'],
    default: false
  },
  marks: {
    type: Number,
    required: [true, 'Marks is required'],
    min: [0, 'Marks cannot be negative'],
    default: 0
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0,
    min: [0, 'Time spent cannot be negative']
  }
}, {
  timestamps: true
});

// Pre-save middleware to calculate isCorrect
answerSchema.pre('save', function(next) {
  this.isCorrect = this.selectedOption === this.correctOption;
  next();
});

// Compound index for result and question (one answer per question per result)
answerSchema.index({ resultId: 1, questionId: 1 }, { unique: true });

module.exports = mongoose.model('Answer', answerSchema);