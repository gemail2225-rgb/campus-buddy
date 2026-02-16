import mongoose from 'mongoose';

const GrievanceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['academic', 'conduct', 'facilities', 'hostel', 'other'], 
    required: true 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'], 
    default: 'medium' 
  },
  status: { 
    type: String, 
    enum: ['open', 'in-progress', 'resolved', 'closed'], 
    default: 'open' 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  updates: [{
    comment: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: String,
    createdAt: { type: Date, default: Date.now }
  }],
}, { timestamps: true });

const Grievance = mongoose.models.Grievance || mongoose.model('Grievance', GrievanceSchema);
export default Grievance;
