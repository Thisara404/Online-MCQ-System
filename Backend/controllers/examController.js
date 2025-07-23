const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Result = require('../models/Result');
const mongoose = require('mongoose');

// @desc    Get all active exams
// @route   GET /api/exams
// @access  Public
const getAllExams = async (req, res) => {
  try {
    const exams = await Exam.find({ isActive: true })
      .populate('createdBy', 'name email')
      .select('-__v')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: exams.length,
      data: { exams }
    });
  } catch (error) {
    console.error('Get all exams error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting exams'
    });
  }
};

// @desc    Get single exam by ID
// @route   GET /api/exams/:id
// @access  Public
const getExamById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid exam ID format'
      });
    }

    const exam = await Exam.findById(id)
      .populate('createdBy', 'name email')
      .select('-__v');

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    if (!exam.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This exam is not active'
      });
    }

    res.json({
      success: true,
      data: { exam }
    });
  } catch (error) {
    console.error('Get exam by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting exam'
    });
  }
};

// @desc    Get exam questions
// @route   GET /api/exams/:id/questions
// @access  Private
const getExamQuestions = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid exam ID format'
      });
    }

    // Check if exam exists and is active
    const exam = await Exam.findById(id);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    if (!exam.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This exam is not active'
      });
    }

    // Check if user has already attempted this exam
    const existingResult = await Result.findOne({
      userId: req.user.id,
      examId: id
    });

    if (existingResult) {
      return res.status(400).json({
        success: false,
        message: 'You have already attempted this exam',
        resultId: existingResult._id
      });
    }

    // Get questions without correct answers for security
    const questions = await Question.find({ examId: id })
      .select('-correctOption -__v')
      .sort({ questionNumber: 1 });

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No questions found for this exam'
      });
    }

    res.json({
      success: true,
      data: {
        exam: {
          id: exam._id,
          title: exam.title,
          description: exam.description,
          duration: exam.duration,
          totalQuestions: exam.totalQuestions,
          passingScore: exam.passingScore
        },
        questions
      }
    });
  } catch (error) {
    console.error('Get exam questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting exam questions'
    });
  }
};

// @desc    Create new exam (Admin only)
// @route   POST /api/exams
// @access  Private/Admin
const createExam = async (req, res) => {
  try {
    const { title, description, duration, totalQuestions, passingScore, questions } = req.body;

    // Validation
    if (!title || !description || !duration || !totalQuestions || !passingScore) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required exam fields'
      });
    }

    if (!questions || !Array.isArray(questions) || questions.length !== totalQuestions) {
      return res.status(400).json({
        success: false,
        message: `Please provide exactly ${totalQuestions} questions`
      });
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.questionText || !question.options || !question.correctOption) {
        return res.status(400).json({
          success: false,
          message: `Question ${i + 1} is missing required fields`
        });
      }

      if (question.options.length !== 4) {
        return res.status(400).json({
          success: false,
          message: `Question ${i + 1} must have exactly 4 options`
        });
      }
    }

    // Create exam
    const exam = await Exam.create({
      title: title.trim(),
      description: description.trim(),
      duration,
      totalQuestions,
      passingScore,
      createdBy: req.user.id
    });

    // Create questions
    const questionPromises = questions.map((question, index) => {
      return Question.create({
        examId: exam._id,
        questionText: question.questionText.trim(),
        options: question.options.map((opt, optIndex) => ({
          text: opt.text.trim(),
          value: ['A', 'B', 'C', 'D'][optIndex]
        })),
        correctOption: question.correctOption,
        questionNumber: index + 1,
        marks: question.marks || 1
      });
    });

    await Promise.all(questionPromises);

    // Populate and return the created exam
    const populatedExam = await Exam.findById(exam._id)
      .populate('createdBy', 'name email')
      .populate('questions');

    res.status(201).json({
      success: true,
      message: 'Exam created successfully',
      data: { exam: populatedExam }
    });
  } catch (error) {
    console.error('Create exam error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error creating exam'
    });
  }
};

// @desc    Update exam (Admin only)
// @route   PUT /api/exams/:id
// @access  Private/Admin
const updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, duration, passingScore, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid exam ID format'
      });
    }

    const exam = await Exam.findById(id);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    // Build update object
    const updateData = {};
    if (title) updateData.title = title.trim();
    if (description) updateData.description = description.trim();
    if (duration) updateData.duration = duration;
    if (passingScore !== undefined) updateData.passingScore = passingScore;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedExam = await Exam.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    res.json({
      success: true,
      message: 'Exam updated successfully',
      data: { exam: updatedExam }
    });
  } catch (error) {
    console.error('Update exam error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error updating exam'
    });
  }
};

// @desc    Delete exam (Admin only)
// @route   DELETE /api/exams/:id
// @access  Private/Admin
const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid exam ID format'
      });
    }

    const exam = await Exam.findById(id);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    // Delete associated questions and results
    await Question.deleteMany({ examId: id });
    await Result.deleteMany({ examId: id });
    await Exam.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Exam and associated data deleted successfully'
    });
  } catch (error) {
    console.error('Delete exam error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting exam'
    });
  }
};

module.exports = {
  getAllExams,
  getExamById,
  getExamQuestions,
  createExam,
  updateExam,
  deleteExam
};