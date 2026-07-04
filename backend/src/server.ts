import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import authRoutes from './routes/authRoutes';
import entryRoutes from './routes/entryRoutes';

dotenv.config();

// Fail fast if critical env vars are missing
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set. Refusing to start with an insecure default.');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists for multer
const uploadsDir = path.join(__dirname, '../uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/entries', entryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'TearBag API is running' });
});

// Connect to DB and Start Server
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tearbag_test')
  .then(() => {
    console.log('Connected to MongoDB');
    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

export default app;
