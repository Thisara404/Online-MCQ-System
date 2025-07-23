const Result = require('../models/Result');
const Answer = require('../models/Answer');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const mongoose = require('mongoose');

// @desc    Submit exam answers and calculate result
// @route   POST /api/results/submit
// @access  Private
const submitExam = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { examId, answers, startTime, endTime } = req.body;
    const userId = req.user.id;

    // Validation
    if (!examId || !answers || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide examId, answers, startTime, and endTime'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(examId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid exam ID format'
      });
    }

    // Check if exam exists
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    // Check if user has already submitted this exam
    const existingResult = await Result.findOne({ userId, examId });
    if (existingResult) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted this exam'
      });
    }

    // Get all questions for this exam
    const questions = await Question.find({ examId }).sort({ questionNumber: 1 });
    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No questions found for this exam'
      });
    }

    // Calculate results
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unanswered = 0;
    let totalMarks = 0;
    let obtainedMarks = 0;

    const answerRecords = [];

    // Process each question
    for (const question of questions) {
      const userAnswer = answers.find(ans => ans.questionId === question._id.toString());
      const selectedOption = userAnswer ? userAnswer.selectedOption : null;
      
      const isCorrect = selectedOption === question.correctOption;
      const marks = isCorrect ? question.marks : 0;

      if (selectedOption === null) {
        unanswered++;
      } else if (isCorrect) {
        correctAnswers++;
        obtainedMarks += marks;
      } else {
        wrongAnswers++;
      }

      totalMarks += question.marks;

      // Create answer record
      answerRecords.push({
        questionId: question._id,
        selectedOption,
        correctOption: question.correctOption,
        isCorrect,
        marks,
        timeSpent: userAnswer ? userAnswer.timeSpent : 0
      });
    }

    // Calculate percentage score
    const score = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;
    const passed = score >= exam.passingScore;

    // Calculate time taken in minutes
    const timeTakenMs = new Date(endTime) - new Date(startTime);
    const timeTaken = Math.round(timeTakenMs / (1000 * 60)); // Convert to minutes

    // Create result record
    const result = await Result.create([{
      userId,
      examId,
      score,
      totalQuestions: questions.length,
      correctAnswers,
      wrongAnswers,
      unanswered,
      timeTaken,
      passed,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      status: 'completed'
    }], { session });

    // Create answer records
    const answersToCreate = answerRecords.map(answer => ({
      ...answer,
      resultId: result[0]._id
    }));

    await Answer.insertMany(answersToCreate, { session });

    await session.commitTransaction();

    // Populate and return result
    const populatedResult = await Result.findById(result[0]._id)
      .populate('userId', 'name email')
      .populate('examId', 'title description passingScore')
      .populate({
        path: 'answers',
        populate: {
          path: 'questionId',
          select: 'questionText options questionNumber'
        }
      });

    res.status(201).json({
      success: true,
      message: 'Exam submitted successfully',
      data: { result: populatedResult }
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Submit exam error:', error);
    
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
      message: 'Server error submitting exam'
    });
  } finally {
    session.endSession();
  }
};

// @desc    Get user's exam results
// @route   GET /api/results/my-results
// @access  Private
const getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user.id })
      .populate('examId', 'title description duration totalQuestions passingScore')
      .select('-__v')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: results.length,
      data: { results }
    });
  } catch (error) {
    console.error('Get my results error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting results'
    });
  }
};

// @desc    Get specific result by ID
// @route   GET /api/results/:id
// @access  Private
const getResultById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid result ID format'
      });
    }

    const result = await Result.findById(id)
      .populate('userId', 'name email')
      .populate('examId', 'title description duration totalQuestions passingScore')
      .populate({
        path: 'answers',
        populate: {
          path: 'questionId',
          select: 'questionText options questionNumber'
        }
      });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }

    // Check if user owns this result or is admin
    if (result.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own results'
      });
    }

    res.json({
      success: true,
      data: { result }
    });
  } catch (error) {
    console.error('Get result by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting result'
    });
  }
};

// @desc    Get all results (Admin only)
// @route   GET /api/results
// @access  Private/Admin
const getAllResults = async (req, res) => {
  try {
    const { page = 1, limit = 10, examId, userId } = req.query;
    
    // Build filter object
    const filter = {};
    if (examId && mongoose.Types.ObjectId.isValid(examId)) {
      filter.examId = examId;
    }
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      filter.userId = userId;
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        { path: 'userId', select: 'name email' },
        { path: 'examId', select: 'title description' }
      ]
    };

    const results = await Result.find(filter)
      .populate('userId', 'name email')
      .populate('examId', 'title description')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Result.countDocuments(filter);

    res.json({
      success: true,
      count: results.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: { results }
    });
  } catch (error) {
    console.error('Get all results error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting results'
    });
  }
};

// @desc    Get exam statistics (Admin only)
// @route   GET /api/results/exam/:examId/stats
// @access  Private/Admin
const getExamStats = async (req, res) => {
  try {
    const { examId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(examId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid exam ID format'
      });
    }

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    const stats = await Result.aggregate([
      { $match: { examId: new mongoose.Types.ObjectId(examId) } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          averageScore: { $avg: '$score' },
          highestScore: { $max: '$score' },
          lowestScore: { $min: '$score' },
          passedCount: {
            $sum: { $cond: ['$passed', 1, 0] }
          },
          averageTime: { $avg: '$timeTaken' }
        }
      }
    ]);

    const scoreDistribution = await Result.aggregate([
      { $match: { examId: new mongoose.Types.ObjectId(examId) } },
      {
        $bucket: {
          groupBy: '$score',
          boundaries: [0, 25, 50, 75, 90, 100],
          default: 'other',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalAttempts: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      passedCount: 0,
      averageTime: 0
    };

    res.json({
      success: true,
      data: {
        exam: {
          id: exam._id,
          title: exam.title,
          passingScore: exam.passingScore
        },
        stats: {
          ...result,
          passRate: result.totalAttempts > 0 ? 
            Math.round((result.passedCount / result.totalAttempts) * 100) : 0,
          averageScore: Math.round(result.averageScore || 0),
          averageTime: Math.round(result.averageTime || 0)
        },
        scoreDistribution
      }
    });
  } catch (error) {
    console.error('Get exam stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting exam statistics'
    });
  }
};

// @desc    Delete result (Admin only)
// @route   DELETE /api/results/:id
// @access  Private/Admin
const deleteResult = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid result ID format'
      });
    }

    const result = await Result.findById(id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }

    // Delete associated answers
    await Answer.deleteMany({ resultId: id });
    await Result.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Result deleted successfully'
    });
  } catch (error) {
    console.error('Delete result error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting result'
    });
  }
};

module.exports = {
  submitExam,
  getMyResults,
  getResultById,
  getAllResults,
  getExamStats,
  deleteResult
};