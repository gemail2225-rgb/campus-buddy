import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  club: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: String,
  date: Date,
  time: String,
  location: String,
  registeredCount: { type: Number, default: 0 },
  max: Number,
  registerBy: Date,
  type: String,
  image: String,
  registeredStudents: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    registeredAt: { type: Date, default: Date.now }
  }],
}, { timestamps: true });

const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);
export default Event;