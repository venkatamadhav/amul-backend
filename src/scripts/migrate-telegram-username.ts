// scripts/migrate-telegram-username.ts
import mongoose from 'mongoose';
import { connectDB } from '@/config/database'; // Adjust path as needed
import { Subscription } from '@/models/Subscription'; // Adjust path as needed
import dotenv from 'dotenv';

dotenv.config();

async function migrateTelegramUsername() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Update all existing subscriptions to add telegramUsername field
    const result = await Subscription.updateMany(
      { telegramUsername: { $exists: false } },
      { $set: { telegramUsername: null } }
    );

    console.log(`✅ Migration completed successfully`);
    console.log(`📊 Documents matched: ${result.matchedCount}`);
    console.log(`📝 Documents modified: ${result.modifiedCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateTelegramUsername();
}

export { migrateTelegramUsername };