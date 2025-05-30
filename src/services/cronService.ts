import cron from 'node-cron';
import { fetchAndUpdateProducts } from './productService';

export const startCronJobs = (): void => {
  // Check inventory every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    console.log('⏰ Running scheduled inventory check...');
    try {
      await fetchAndUpdateProducts();
    } catch (error) {
      console.error('❌ Scheduled inventory check failed:', error);
    }
  });
  
  console.log('✅ Cron jobs started successfully');
};
