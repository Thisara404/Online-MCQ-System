const mongoose = require('mongoose');
const Question = require('./models/Question');
const Exam = require('./models/Exam');
require('dotenv').config();

const testQuestionData = async () => {
  try {
    // Use the correct MongoDB URI from your .env file
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    // Get all questions and check their structure
    const questions = await Question.find().populate('examId');
    
    console.log('\n📝 Question Data Analysis:');
    console.log(`Total questions found: ${questions.length}`);
    
    if (questions.length === 0) {
      console.log('❌ No questions found in database. Run seeding first: npm run seed');
      process.exit(1);
    }
    
    questions.forEach((q, index) => {
      console.log(`\nQuestion ${index + 1}:`);
      console.log(`Text: ${q.questionText}`);
      console.log(`Correct Option: "${q.correctOption}"`);
      console.log(`Options:`, q.options.map(opt => `${opt.value}: ${opt.text}`));
      
      // Check if correct option exists in options
      const hasCorrectOption = q.options.find(opt => opt.value === q.correctOption);
      console.log(`Correct option exists: ${hasCorrectOption ? 'YES' : 'NO'}`);
      
      if (!hasCorrectOption) {
        console.log('❌ ISSUE FOUND: Correct option not in options array!');
      } else {
        console.log('✅ Question structure is correct');
      }
    });

    await mongoose.connection.close();
    console.log('\n✅ Analysis complete. Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

testQuestionData();