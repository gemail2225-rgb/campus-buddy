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

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;