import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import issueRoutes from './routes/issueRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Check if MONGO_URI is defined
if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not defined in the .env file');
  process.exit(1);
}

// Connect to MongoDB
console.log('Connecting to MongoDB with URI:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI as string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api/issues', issueRoutes);

// Fallback route for 404 errors
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the server
try {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
} catch (error) {
  console.error('Error starting the server:', error);
}