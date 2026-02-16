import mongoose from 'mongoose';

const LostFoundItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['lost', 'found'], 
    required: true 
  },
  location: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['electronics', 'documents', 'keys', 'bag', 'clothing', 'other'], 
    required: true 
  },
  contact: {
    email: String,
    phone: String
  },
  status: { 
    type: String, 
    enum: ['active', 'resolved', 'closed'], 
    default: 'active' 
  },
  postedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  imageUrl: String,
  dateOfIncident: Date,
  matchedWith: { type: mongoose.Schema.Types.ObjectId, ref: 'LostFoundItem' }
}, { timestamps: true });

const LostFoundItem = mongoose.models.LostFoundItem || mongoose.model('LostFoundItem', LostFoundItemSchema);
export default LostFoundItem;
