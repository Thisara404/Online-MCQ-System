const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Exam = require('./models/Exam');
const Question = require('./models/Question');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@mcqsystem.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@student.com',
    password: 'student123',
    role: 'student'
  },
  {
    name: 'Jane Smith',
    email: 'jane@student.com',
    password: 'student123',
    role: 'student'
  },
  {
    name: 'Test Student',
    email: 'test@student.com',
    password: 'test123',
    role: 'student'
  }
];

const sampleExams = [
  {
    title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of JavaScript basics including variables, functions, and DOM manipulation.',
    duration: 30,
    totalQuestions: 5,
    passingScore: 60
  },
  {
    title: 'React.js Basics',
    description: 'Assess your understanding of React components, props, state, and hooks.',
    duration: 25,
    totalQuestions: 5,
    passingScore: 70
  },
  {
    title: 'Node.js & Express',
    description: 'Evaluate your knowledge of server-side JavaScript, Express framework, and API development.',
    duration: 35,
    totalQuestions: 5,
    passingScore: 65
  }
];

const sampleQuestions = {
  'JavaScript Fundamentals': [
    {
      questionText: 'What is the correct way to declare a variable in JavaScript?',
      options: [
        { text: 'var myVar = 5;', value: 'A' },
        { text: 'variable myVar = 5;', value: 'B' },
        { text: 'v myVar = 5;', value: 'C' },
        { text: 'declare myVar = 5;', value: 'D' }
      ],
      correctOption: 'A',
      questionNumber: 1,
      marks: 1
    },
    {
      questionText: 'Which method is used to add an element to the end of an array?',
      options: [
        { text: 'append()', value: 'A' },
        { text: 'push()', value: 'B' },
        { text: 'insert()', value: 'C' },
        { text: 'add()', value: 'D' }
      ],
      correctOption: 'B',
      questionNumber: 2,
      marks: 1
    },
    {
      questionText: 'What does DOM stand for?',
      options: [
        { text: 'Document Object Model', value: 'A' },
        { text: 'Data Object Management', value: 'B' },
        { text: 'Dynamic Object Method', value: 'C' },
        { text: 'Document Oriented Model', value: 'D' }
      ],
      correctOption: 'A',
      questionNumber: 3,
      marks: 1
    },
    {
      questionText: 'Which operator is used for strict equality comparison?',
      options: [
        { text: '==', value: 'A' },
        { text: '===', value: 'B' },
        { text: '=', value: 'C' },
        { text: '!=', value: 'D' }
      ],
      correctOption: 'B',
      questionNumber: 4,
      marks: 1
    },
    {
      questionText: 'What is the output of: console.log(typeof [])?',
      options: [
        { text: 'array', value: 'A' },
        { text: 'object', value: 'B' },
        { text: 'list', value: 'C' },
        { text: 'undefined', value: 'D' }
      ],
      correctOption: 'B',
      questionNumber: 5,
      marks: 1
    }
  ],
  'React.js Basics': [
    {
      questionText: 'What is JSX in React?',
      options: [
        { text: 'JavaScript XML', value: 'A' },
        { text: 'Java Syntax Extension', value: 'B' },
        { text: 'JSON Extended', value: 'C' },
        { text: 'JavaScript eXtended', value: 'D' }
      ],
      correctOption: 'A',
      questionNumber: 1,
      marks: 1
    },
    {
      questionText: 'Which hook is used to manage state in functional components?',
      options: [
        { text: 'useEffect', value: 'A' },
        { text: 'useState', value: 'B' },
        { text: 'useContext', value: 'C' },
        { text: 'useReducer', value: 'D' }
      ],
      correctOption: 'B',
      questionNumber: 2,
      marks: 1
    },
    {
      questionText: 'How do you pass data from parent to child component?',
      options: [
        { text: 'Through props', value: 'A' },
        { text: 'Through state', value: 'B' },
        { text: 'Through context', value: 'C' },
        { text: 'Through refs', value: 'D' }
      ],
      correctOption: 'A',
      questionNumber: 3,
      marks: 1
    },
    {
      questionText: 'What is the Virtual DOM?',
      options: [
        { text: 'A copy of the real DOM kept in memory', value: 'A' },
        { text: 'A new type of DOM', value: 'B' },
        { text: 'A DOM for virtual reality', value: 'C' },
        { text: 'A DOM simulator', value: 'D' }
      ],
      correctOption: 'A',
      questionNumber: 4,
      marks: 1
    },
    {
      questionText: 'Which method is called after a component is mounted?',
      options: [
        { text: 'componentDidMount', value: 'A' },
        { text: 'componentWillMount', value: 'B' },
        { text: 'componentDidUpdate', value: 'C' },
        { text: 'componentWillUpdate', value: 'D' }
      ],
      correctOption: 'A',
      questionNumber: 5,
      marks: 1
    }
  ],
  'Node.js & Express': [
    {
      questionText: 'What is Node.js?',
      options: [
        { text: 'A JavaScript runtime built on Chrome\'s V8 engine', value: 'A' },
        { text: 'A web browser', value: 'B' },
        { text: 'A database', value: 'C' },
        { text: 'A CSS framework', value: 'D' }
      ],
      correctOption: 'A',
      questionNumber: 1,
      marks: 1
    },
    {
      questionText: 'Which command is used to initialize a new Node.js project?',
      options: [
        { text: 'npm start', value: 'A' },
        { text: 'npm init', value: 'B' },
        { text: 'npm create', value: 'C' },
        { text: 'npm new', value: 'D' }
      ],
      correctOption: 'B',
      questionNumber: 2,
      marks: 1
    },
    {
      questionText: 'What is Express.js?',
      options: [
        { text: 'A web application framework for Node.js', value: 'A' },
        { text: 'A database ORM', value: 'B' },
        { text: 'A testing framework', value: 'C' },
        { text: 'A CSS preprocessor', value: 'D' }
      ],
      correctOption: 'A',
      questionNumber: 3,
      marks: 1
    },
    {
      questionText: 'Which HTTP method is used to retrieve data?',
      options: [
        { text: 'POST', value: 'A' },
        { text: 'GET', value: 'B' },
        { text: 'PUT', value: 'C' },
        { text: 'DELETE', value: 'D' }
      ],
      correctOption: 'B',
      questionNumber: 4,
      marks: 1
    },
    {
      questionText: 'What is middleware in Express?',
      options: [
        { text: 'Functions that execute during the request-response cycle', value: 'A' },
        { text: 'Database connection functions', value: 'B' },
        { text: 'CSS styling functions', value: 'C' },
        { text: 'HTML template functions', value: 'D' }
      ],
      correctOption: 'A',
      questionNumber: 5,
      marks: 1
    }
  ]
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Question.deleteMany({});
    await Exam.deleteMany({});

    console.log('Cleared existing data...');

    // Create users one by one to trigger password hashing
    console.log('Creating users with encrypted passwords...');
    const users = [];
    
    for (const userData of sampleUsers) {
      try {
        const user = await User.create(userData);
        users.push(user);
        console.log(`✅ Created user: ${user.email} (${user.role})`);
      } catch (error) {
        console.error(`❌ Failed to create user ${userData.email}:`, error.message);
      }
    }

    console.log(`✅ Created ${users.length} users with encrypted passwords`);

    // Get admin user for creating exams
    const adminUser = users.find(user => user.role === 'admin');
    
    if (!adminUser) {
      throw new Error('Admin user not found');
    }

    // Create exams
    console.log('Creating exams...');
    const examPromises = sampleExams.map(examData => 
      Exam.create({
        ...examData,
        createdBy: adminUser._id
      })
    );

    const exams = await Promise.all(examPromises);
    console.log(`✅ Created ${exams.length} exams`);

    // Create questions for each exam
    console.log('Creating questions...');
    for (const exam of exams) {
      const questions = sampleQuestions[exam.title];
      if (questions) {
        const questionPromises = questions.map(questionData =>
          Question.create({
            ...questionData,
            examId: exam._id
          })
        );
        
        await Promise.all(questionPromises);
        console.log(`✅ Created ${questions.length} questions for ${exam.title}`);
      }
    }

    console.log('\n🎉 Sample data seeded successfully with encrypted passwords!');
    console.log('\n📋 Test Credentials:');
    console.log('Admin: admin@mcqsystem.com / admin123');
    console.log('Student: john@student.com / student123');
    console.log('Student: jane@student.com / student123');
    console.log('Student: test@student.com / test123');
    
    console.log('\n🔐 Password Verification:');
    // Verify password encryption worked
    const testUser = await User.findOne({ email: 'admin@mcqsystem.com' });
    console.log('Sample encrypted password (first 20 chars):', testUser.password.substring(0, 20) + '...');
    console.log('Password is encrypted:', testUser.password !== 'admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedDatabase();