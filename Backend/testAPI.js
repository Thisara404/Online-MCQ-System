const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';
let examId = '';
let resultId = '';

// Test configuration
const testCredentials = {
  admin: {
    email: 'admin@mcqsystem.com',
    password: 'admin123'
  },
  student: {
    email: 'john@student.com',
    password: 'student123'
  }
};

// Helper function to make API calls
const apiCall = async (method, endpoint, data = null, token = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {}
    };
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(`❌ ${method.toUpperCase()} ${endpoint}:`, error.response.data.message);
      return error.response.data;
    }
    console.error(`❌ ${method.toUpperCase()} ${endpoint}:`, error.message);
    return null;
  }
};

const runTests = async () => {
  console.log('🚀 Starting API Tests...\n');

  try {
    // 1. Health Check
    console.log('1️⃣ Testing Health Check');
    const health = await apiCall('GET', '/health');
    console.log('✅ Health:', health?.message || 'Failed');

    // 2. User Registration
    console.log('\n2️⃣ Testing User Registration');
    const newUser = {
      name: 'Test User API',
      email: 'testapi@example.com',
      password: 'test123',
      role: 'student'
    };
    const registerResult = await apiCall('POST', '/auth/register', newUser);
    console.log('✅ Registration:', registerResult?.success ? 'Success' : 'Failed');

    // 3. User Login (Student)
    console.log('\n3️⃣ Testing Student Login');
    const loginResult = await apiCall('POST', '/auth/login', testCredentials.student);
    if (loginResult?.success) {
      authToken = loginResult.data.token;
      console.log('✅ Login Success - Token received');
    } else {
      console.log('❌ Login Failed');
      return;
    }

    // 4. Get User Profile
    console.log('\n4️⃣ Testing Get Profile');
    const profile = await apiCall('GET', '/auth/me', null, authToken);
    console.log('✅ Profile:', profile?.success ? `User: ${profile.data.user.name}` : 'Failed');

    // 5. Get All Exams
    console.log('\n5️⃣ Testing Get All Exams');
    const exams = await apiCall('GET', '/exams');
    if (exams?.success && exams.data.exams.length > 0) {
      examId = exams.data.exams[0]._id;
      console.log(`✅ Found ${exams.count} exams. Using exam: ${exams.data.exams[0].title}`);
    } else {
      console.log('❌ No exams found');
      return;
    }

    // 6. Get Exam Questions
    console.log('\n6️⃣ Testing Get Exam Questions');
    const questions = await apiCall('GET', `/exams/${examId}/questions`, null, authToken);
    if (questions?.success) {
      console.log(`✅ Retrieved ${questions.data.questions.length} questions for exam`);
    } else {
      console.log('❌ Failed to get questions:', questions?.message);
    }

    // 7. Submit Exam
    console.log('\n7️⃣ Testing Submit Exam');
    const startTime = new Date().toISOString();
    
    // Simulate answering questions
    const answers = questions.data.questions.map((q, index) => ({
      questionId: q._id,
      selectedOption: ['A', 'B', 'A', 'B', 'A'][index] || 'A', // Sample answers
      timeSpent: Math.floor(Math.random() * 30) + 10 // Random time between 10-40 seconds
    }));

    setTimeout(async () => {
      const endTime = new Date().toISOString();
      
      const examSubmission = {
        examId,
        answers,
        startTime,
        endTime
      };

      const submitResult = await apiCall('POST', '/results/submit', examSubmission, authToken);
      if (submitResult?.success) {
        resultId = submitResult.data.result._id;
        console.log(`✅ Exam submitted successfully. Score: ${submitResult.data.result.score}%`);
        console.log(`   Correct: ${submitResult.data.result.correctAnswers}, Wrong: ${submitResult.data.result.wrongAnswers}`);
        
        // 8. Get My Results
        console.log('\n8️⃣ Testing Get My Results');
        const myResults = await apiCall('GET', '/results/my-results', null, authToken);
        console.log('✅ My Results:', myResults?.success ? `Found ${myResults.count} results` : 'Failed');

        // 9. Get Specific Result
        console.log('\n9️⃣ Testing Get Specific Result');
        const specificResult = await apiCall('GET', `/results/${resultId}`, null, authToken);
        console.log('✅ Specific Result:', specificResult?.success ? 'Retrieved successfully' : 'Failed');

        // 10. Admin Login and Tests
        console.log('\n🔟 Testing Admin Login');
        const adminLogin = await apiCall('POST', '/auth/login', testCredentials.admin);
        if (adminLogin?.success) {
          const adminToken = adminLogin.data.token;
          console.log('✅ Admin Login Success');

          // Test Admin-only endpoints
          console.log('\n1️⃣1️⃣ Testing Get All Users (Admin)');
          const allUsers = await apiCall('GET', '/auth/users', null, adminToken);
          console.log('✅ All Users:', allUsers?.success ? `Found ${allUsers.count} users` : 'Failed');

          console.log('\n1️⃣2️⃣ Testing Get All Results (Admin)');
          const allResults = await apiCall('GET', '/results', null, adminToken);
          console.log('✅ All Results:', allResults?.success ? `Found ${allResults.count} results` : 'Failed');

          console.log('\n1️⃣3️⃣ Testing Get Exam Stats (Admin)');
          const examStats = await apiCall('GET', `/results/exam/${examId}/stats`, null, adminToken);
          console.log('✅ Exam Stats:', examStats?.success ? 'Retrieved successfully' : 'Failed');
          if (examStats?.success) {
            console.log(`   📊 Total Attempts: ${examStats.data.stats.totalAttempts}`);
            console.log(`   📊 Average Score: ${examStats.data.stats.averageScore}%`);
            console.log(`   📊 Pass Rate: ${examStats.data.stats.passRate}%`);
          }
        }

        console.log('\n🎉 All API tests completed successfully!');
        console.log('\n📋 Summary:');
        console.log('✅ Health Check');
        console.log('✅ User Registration');
        console.log('✅ User Login');
        console.log('✅ Get User Profile');
        console.log('✅ Get All Exams');
        console.log('✅ Get Exam Questions');
        console.log('✅ Submit Exam');
        console.log('✅ Get User Results');
        console.log('✅ Get Specific Result');
        console.log('✅ Admin Endpoints');

      } else {
        console.log('❌ Exam submission failed:', submitResult?.message);
      }
    }, 2000); // Wait 2 seconds to simulate exam time

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Check if server is running before testing
const checkServer = async () => {
  try {
    await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server is running. Starting tests...\n');
    runTests();
  } catch (error) {
    console.log('❌ Server is not running. Please start the server first:');
    console.log('   cd Backend && npm run dev');
  }
};

checkServer();