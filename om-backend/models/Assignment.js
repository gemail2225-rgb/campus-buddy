import mongoose from 'mongoose';

const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  dueDate: Date,
  totalMarks: Number,
  submissions: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    submittedAt: Date,
    fileUrl: String,
    marks: Number,
    feedback: String,
  }],
}, { timestamps: true });

const Assignment = mongoose.models.Assignment || mongoose.model('Assignment', AssignmentSchema);
export default Assignment;