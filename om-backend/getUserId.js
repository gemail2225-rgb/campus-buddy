import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
const user = await User.findOne({ email: 'arjun@club.com' });
console.log('Club user ID:', user._id.toString());
await mongoose.disconnect();