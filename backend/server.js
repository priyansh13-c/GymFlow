import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

import authRoutes from './src/routes/authRoutes.js';
import gymRoutes from './src/routes/gymRoutes.js';
import memberRoutes from './src/routes/memberRoutes.js';
import workoutRoutes from './src/routes/workoutRoutes.js';
import noticeRoutes from './src/routes/noticeRoutes.js';
import paymentRoutes from './src/routes/paymentRoutes.js';
import calorieRoutes from './src/routes/calorieRoutes.js';
import trainerRoutes from './src/routes/trainerRoutes.js';

import { errorHandler } from './src/middleware/errorHandler.js';
import { setupSocketIO } from './src/config/socket.js';
import { startMembershipExpiryJob } from './src/crons/membershipExpiryJob.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static files
app.use('/uploads', express.static('uploads'));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gymflow', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✓ MongoDB connected'))
.catch((err) => {
  console.error('✗ MongoDB connection error:', err);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/gym', gymRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/calories', calorieRoutes);
app.use('/api/trainers', trainerRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Socket.io Setup
setupSocketIO(io);

// Error handling middleware
app.use(errorHandler);

// Start cron jobs
startMembershipExpiryJob();

// Start server
const PORT = process.env.PORT || 5001;
httpServer.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV}`);
});

export default app;
