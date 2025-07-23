const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: [true, 'Exam ID is required']
  },
  questionText: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true,
    maxlength: [1000, 'Question text cannot exceed 1000 characters']
  },
  options: [{
    text: {
      type: String,
      required: [true, 'Option text is required'],
      trim: true,
      maxlength: [200, 'Option text cannot exceed 200 characters']
    },
    value: {
      type: String,
      required: [true, 'Option value is required'],
      enum: ['A', 'B', 'C', 'D']
    }
  }],
  correctOption: {
    type: String,
    required: [true, 'Correct option is required'],
    enum: ['A', 'B', 'C', 'D']
  },
  questionNumber: {
    type: Number,
    required: [true, 'Question number is required'],
    min: [1, 'Question number must be at least 1']
  },
  marks: {
    type: Number,
    default: 1,
    min: [0.5, 'Marks must be at least 0.5'],
    max: [10, 'Marks cannot exceed 10']
  }
}, {
  timestamps: true
});

// Validate that we have exactly 4 options
questionSchema.pre('save', function(next) {
  if (this.options.length !== 4) {
    return next(new Error('Each question must have exactly 4 options'));
  }
  
  // Validate that options have unique values
  const values = this.options.map(opt => opt.value);
  const uniqueValues = [...new Set(values)];
  if (uniqueValues.length !== 4) {
    return next(new Error('Options must have unique values (A, B, C, D)'));
  }
  
  // Validate that correct option exists in options
  const hasCorrectOption = this.options.some(opt => opt.value === this.correctOption);
  if (!hasCorrectOption) {
    return next(new Error('Correct option must match one of the provided options'));
  }
  
  next();
});

// Compound index for exam and question number
questionSchema.index({ examId: 1, questionNumber: 1 }, { unique: true });

module.exports = mongoose.model('Question', questionSchema);