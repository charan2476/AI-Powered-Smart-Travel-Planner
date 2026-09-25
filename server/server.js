import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import destinationRoutes from './routes/destinationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import Destination from './models/Destination.js';
import { seedDestinations } from './utils/seedDestinations.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB().then(async () => {
  // Auto-seed destinations if empty so user has immediate demo data
  try {
    const count = await Destination.countDocuments();
    if (count === 0) {
      console.log('No destinations found. Auto-seeding default destinations...');
      await seedDestinations();
    }
  } catch (err) {
    console.log('Skipping auto-seed check (DB not ready or initialized)');
  }
});

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: '*', // Allow all origins for seamless local development
    credentials: true,
  })
);

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'TripGenie API',
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key'),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/ai', aiRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 TripGenie Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
