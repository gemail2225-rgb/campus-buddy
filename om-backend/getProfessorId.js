import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
const user = await User.findOne({ email: 'anjali@prof.com' });
if (user) {
  console.log('Professor ID:', user._id.toString());
} else {
  console.log('Professor not found. Did you run seed?');
}
await mongoose.disconnect();