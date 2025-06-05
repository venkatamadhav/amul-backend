import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from '@/config/database';
import { startCronJobs } from '@/services/cronService';
import { fetchAndUpdateProducts } from '@/services/productService';
import productRoutes from '@/routes/productRoutes';
import subscriptionRoutes from '@/routes/subscriptionRoutes';
import healthRoutes from '@/routes/healthRoutes';
import testEmailRoutes from '@/routes/testEmailRoutes';
import telegramRoutes from './routes/telegramRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api', testEmailRoutes);
app.use('/api/products', productRoutes);
app.use('/api', subscriptionRoutes);
app.use('/api/telegram', telegramRoutes);
app.use('/', healthRoutes);

// Serve the frontend
app.get('/', (_req: Request, res: Response) => {
  res.send('Testing Route');
});

// Initialize server
async function startServer(): Promise<void> {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Initial data fetch
    console.log('Fetching initial product data...');
    await fetchAndUpdateProducts();
    console.log('Initial data fetch completed');
    
    // Start cron jobs
    startCronJobs();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🌐 Backend: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;