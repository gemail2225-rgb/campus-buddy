import mongoose from 'mongoose';
import User from './models/User.js';
import Event from './models/Event.js';
import Announcement from './models/Announcement.js';
import dotenv from 'dotenv';
import Course from './models/Course.js';
import Assignment from './models/Assignment.js';
import StudyMaterial from './models/StudyMaterial.js';
import ResearchInternship from './models/ResearchInternship.js';

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log('DB connected for seeding');

// Clear existing data
await User.deleteMany();
await Event.deleteMany();
await Announcement.deleteMany();

// Create users with specific IDs to match frontend mock data
const club = await User.create({
  _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439013'),
  name: 'Arjun Singh',
  email: 'arjun.singh@campus.edu',
  role: 'club',
  club: 'Programming Club',
  status: 'active'
});

const student = await User.create({
  _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
  name: 'Rahul Sharma',
  email: 'rahul.sharma@campus.edu',
  role: 'student',
  department: 'Computer Science',
  status: 'active'
});

const professor = await User.create({
  _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
  name: 'Prof. Anjali Verma',
  email: 'anjali.verma@campus.edu',
  role: 'professor',
  department: 'Computer Science',
  status: 'active'
});

const admin = await User.create({
  _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439014'),
  name: 'Admin User',
  email: 'admin@campus.edu',
  role: 'admin',
  status: 'active'
});

// Create events
await Event.create([
  {
    title: 'Hackathon 2026',
    club: club._id,
    description: '24-hour coding competition with prizes worth ₹50,000. Open to all branches.',
    date: new Date('2026-03-20'),
    time: '10:00 AM - 6:00 PM',
    location: 'CS Department Auditorium',
    registeredCount: 45,
    max: 100,
    registerBy: new Date('2026-03-15'),
    type: 'Technical'
  },
  {
    title: 'Cultural Night',
    club: club._id,
    description: 'Annual cultural fest featuring music, dance, and drama performances.',
    date: new Date('2026-03-25'),
    time: '7:00 PM - 11:00 PM',
    location: 'Open Air Theatre',
    registeredCount: 120,
    max: 300,
    registerBy: new Date('2026-03-20'),
    type: 'Cultural'
  }
]);

// Create announcements
await Announcement.create([
  {
    title: 'Coding Club Recruitment',
    club: club._id,
    content: "We're recruiting new members for the 2026 batch. Interested students can fill the Google form by March 20th. Open to all years.",
    pinned: true,
    priority: 'High',
    views: 234,
    comments: [
      {
        user: student._id,
        text: 'When is the deadline?',
        date: new Date('2026-02-14')
      }
    ]
  },
  {
    title: 'Hackathon Registration Open',
    club: club._id,
    content: 'Registrations for Hackathon 2026 are now open. Hurry!',
    pinned: false,
    priority: 'Medium',
    views: 156,
    comments: []
  }
]);

// ===== Professor Data =====
// Courses
const course1 = await Course.create({
  courseCode: 'CS201',
  courseName: 'Data Structures',
  semester: 'Spring 2026',
  credits: 4,
  professor: professor._id,
  students: [student._id], // add the student as enrolled
  attendance: 92,
});

const course2 = await Course.create({
  courseCode: 'CS301',
  courseName: 'Algorithms',
  semester: 'Spring 2026',
  credits: 4,
  professor: professor._id,
  students: [student._id],
  attendance: 85,
});

const course3 = await Course.create({
  courseCode: 'CS302',
  courseName: 'Database Systems',
  semester: 'Spring 2026',
  credits: 3,
  professor: professor._id,
  students: [student._id],
  attendance: 78,
});

// Assignments
await Assignment.create([
  {
    title: 'Binary Search Tree Implementation',
    description: 'Implement a BST with insert, delete, and search operations.',
    course: course1._id,
    dueDate: new Date('2026-03-15'),
    totalMarks: 100,
    submissions: [
      {
        student: student._id,
        submittedAt: new Date('2026-03-14'),
        fileUrl: 'https://example.com/submission1.pdf',
        marks: 85,
        feedback: 'Good work, but missing delete function.',
      },
    ],
  },
  {
    title: 'Algorithm Analysis Report',
    description: 'Analyze the time complexity of sorting algorithms.',
    course: course2._id,
    dueDate: new Date('2026-03-20'),
    totalMarks: 50,
    submissions: [],
  },
  {
    title: 'SQL Query Optimization',
    description: 'Write optimized SQL queries for given scenarios.',
    course: course3._id,
    dueDate: new Date('2026-03-10'),
    totalMarks: 75,
    submissions: [],
  },
]);

// Study Materials
await StudyMaterial.create([
  {
    title: 'Binary Trees Lecture Notes.pdf',
    description: 'Detailed notes on binary trees and traversal algorithms.',
    course: course1._id,
    fileUrl: '/uploads/binary-trees.pdf',
    uploadedBy: professor._id,
  },
  {
    title: 'Algorithm Design Patterns.pdf',
    description: 'Common algorithm design patterns with examples.',
    course: course2._id,
    fileUrl: '/uploads/algorithm-patterns.pdf',
    uploadedBy: professor._id,
  },
  {
    title: 'SQL Cheat Sheet.pdf',
    description: 'Quick reference for SQL commands and syntax.',
    course: course3._id,
    fileUrl: '/uploads/sql-cheatsheet.pdf',
    uploadedBy: professor._id,
  },
]);

// Research Internships
await ResearchInternship.create([
  {
    title: 'ML Research Assistant',
    description: 'Working on deep learning models for medical image analysis.',
    professor: professor._id,
    duration: '6 months',
    stipend: '₹15,000/month',
    requiredSkills: ['Python', 'PyTorch', 'ML Basics'],
    deadline: new Date('2026-03-15'),
    applicants: [
      {
        student: student._id,
        appliedAt: new Date('2026-02-10'),
        status: 'pending',
      },
    ],
  },
  {
    title: 'Quantum Computing Research',
    description: 'Research on quantum algorithms and their applications.',
    professor: professor._id,
    duration: '4 months',
    stipend: '₹12,000/month',
    requiredSkills: ['Quantum Mechanics', 'Python'],
    deadline: new Date('2026-02-28'),
    applicants: [],
  },
]);

console.log('Seeding completed');
await mongoose.disconnect();