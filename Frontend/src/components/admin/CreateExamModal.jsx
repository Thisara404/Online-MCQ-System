import React, { useState } from 'react';
import { examAPI } from '../../services/api';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';

const CreateExamModal = ({ onClose, onSuccess }) => {
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    duration: 30,
    passingScore: 60,
    questions: [
      {
        questionText: '',
        options: [
          { text: '', value: 'A' },
          { text: '', value: 'B' },
          { text: '', value: 'C' },
          { text: '', value: 'D' }
        ],
        correctOption: 'A'
      }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExamChange = (e) => {
    setExamData({
      ...examData,
      [e.target.name]: e.target.value
    });
  };

  const handleQuestionChange = (questionIndex, field, value) => {
    const updatedQuestions = [...examData.questions];
    updatedQuestions[questionIndex][field] = value;
    setExamData({
      ...examData,
      questions: updatedQuestions
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...examData.questions];
    updatedQuestions[questionIndex].options[optionIndex].text = value;
    setExamData({
      ...examData,
      questions: updatedQuestions
    });
  };

  const addQuestion = () => {
    setExamData({
      ...examData,
      questions: [
        ...examData.questions,
        {
          questionText: '',
          options: [
            { text: '', value: 'A' },
            { text: '', value: 'B' },
            { text: '', value: 'C' },
            { text: '', value: 'D' }
          ],
          correctOption: 'A'
        }
      ]
    });
  };

  const removeQuestion = (index) => {
    if (examData.questions.length > 1) {
      const updatedQuestions = examData.questions.filter((_, i) => i !== index);
      setExamData({
        ...examData,
        questions: updatedQuestions
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await examAPI.createExam({
        ...examData,
        totalQuestions: examData.questions.length
      });

      if (response.data.success) {
        onSuccess();
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Create New Exam</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Exam Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exam Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={examData.title}
                onChange={handleExamChange}
                className="input"
                placeholder="e.g., JavaScript Fundamentals"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes) *
              </label>
              <input
                type="number"
                name="duration"
                required
                min="1"
                max="300"
                value={examData.duration}
                onChange={handleExamChange}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              required
              rows="3"
              value={examData.description}
              onChange={handleExamChange}
              className="input"
              placeholder="Brief description of the exam..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passing Score (%) *
            </label>
            <input
              type="number"
              name="passingScore"
              required
              min="0"
              max="100"
              value={examData.passingScore}
              onChange={handleExamChange}
              className="input w-32"
            />
          </div>

          {/* Questions */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
              <button
                type="button"
                onClick={addQuestion}
                className="btn btn-secondary flex items-center space-x-2"
              >
                <FaPlus />
                <span>Add Question</span>
              </button>
            </div>

            <div className="space-y-6">
              {examData.questions.map((question, questionIndex) => (
                <div key={questionIndex} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">
                      Question {questionIndex + 1}
                    </h4>
                    {examData.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(questionIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question Text *
                      </label>
                      <textarea
                        required
                        rows="2"
                        value={question.questionText}
                        onChange={(e) => handleQuestionChange(questionIndex, 'questionText', e.target.value)}
                        className="input"
                        placeholder="Enter your question here..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Option {option.value} *
                          </label>
                          <input
                            type="text"
                            required
                            value={option.text}
                            onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                            className="input"
                            placeholder={`Option ${option.value}`}
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correct Answer *
                      </label>
                      <select
                        required
                        value={question.correctOption}
                        onChange={(e) => handleQuestionChange(questionIndex, 'correctOption', e.target.value)}
                        className="input w-32"
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-red-800">{error}</div>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Creating...' : 'Create Exam'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExamModal;