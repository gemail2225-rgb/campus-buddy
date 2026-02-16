import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import eventRoutes from './routes/events.js';
import announcementRoutes from './routes/announcements.js';
import courseRoutes from './routes/courses.js';
import assignmentRoutes from './routes/assignments.js';
import studyMaterialRoutes from './routes/studyMaterials.js';
import researchRoutes from './routes/researchInternships.js';
import grievanceRoutes from './routes/grievances.js';
import lostfoundRoutes from './routes/lostfound.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Remove deprecated options
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/study-materials', studyMaterialRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/grievances', grievanceRoutes);
app.use('/api/lost-found', lostfoundRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));