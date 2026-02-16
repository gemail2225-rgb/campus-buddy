import mongoose from 'mongoose';

const StudyMaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  fileUrl: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const StudyMaterial = mongoose.models.StudyMaterial || mongoose.model('StudyMaterial', StudyMaterialSchema);
export default StudyMaterial;