import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  date: { type: Date, default: Date.now }
});

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  club: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: String,
  pinned: { type: Boolean, default: false },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  views: { type: Number, default: 0 },
  comments: [CommentSchema],
}, { timestamps: true });

const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema);
export default Announcement;