// scripts/migrate-telegram-username.ts
import mongoose from 'mongoose';
import { connectDB } from '@/config/database'; // Adjust path as needed
import { Subscription } from '@/models/Subscription'; // Adjust path as needed

async function migrateTelegramUsername() {
  try {
    // Connect to MongoDB using your existing connection function
    await connectDB();
    
    console.log('Connected to MongoDB');
    
    // Update all existing documents that don't have telegramUsername field
    const result = await Subscription.updateMany(
      { telegramUsername: { $exists: false } }, // Find docs without telegramUsername field
      { $set: { telegramUsername: null } }      // Set it to null
    );
    
    console.log(`Migration completed: ${result.modifiedCount} documents updated`);
    
    // Verify the migration
    const totalDocs = await Subscription.countDocuments();
    const docsWithTelegram = await Subscription.countDocuments({ telegramUsername: { $exists: true } });
    
    console.log(`Total documents: ${totalDocs}`);
    console.log(`Documents with telegramUsername field: ${docsWithTelegram}`);
    
    await mongoose.disconnect();
    console.log('Migration completed successfully');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateTelegramUsername();
}

export { migrateTelegramUsername };