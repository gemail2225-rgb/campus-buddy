import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, unique: true },
  courseName: { type: String, required: true },
  semester: String,
  credits: Number,
  professor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  attendance: { type: Number, default: 0 }, // average attendance
  grade: String, // maybe average grade
}, { timestamps: true });

const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);
export default Course;