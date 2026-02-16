import mongoose from 'mongoose';

const ResearchInternshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  professor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  duration: String,
  stipend: String,
  requiredSkills: [String],
  deadline: Date,
  applicants: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    appliedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
  }],
}, { timestamps: true });

const ResearchInternship = mongoose.models.ResearchInternship || mongoose.model('ResearchInternship', ResearchInternshipSchema);
export default ResearchInternship;