import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['student', 'professor', 'club', 'admin'], required: true },
  department: String,
  club: String,
  phone: String,
  status: { type: String, default: 'active' },
  lastActive: Date,
}, { timestamps: true });

export default mongoose.model('User', UserSchema);