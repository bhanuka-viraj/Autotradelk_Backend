import express, { Express } from 'express';
import { connectDB } from './config/database';
import authRoutes from './routes/auth';
import vehiclesRoutes from './routes/vehicles';
import auctionsRoutes from './routes/auctions';
import usersRoutes from './routes/users';

const app: Express = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/auctions', auctionsRoutes);
app.use('/api/users', usersRoutes);

// Start server
const PORT = process.env.PORT || 3000;
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
  }
};

startServer();