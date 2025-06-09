import { connectDB } from '@/config/database';
import { Product } from '@/models/Product';
import dotenv from 'dotenv';

dotenv.config();

async function activateProducts() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Update all products to be active
    const result = await Product.updateMany(
      { isActive: { $ne: true } },
      { $set: { isActive: true } }
    );

    console.log(`✅ Products activation completed`);
    console.log(`📊 Documents matched: ${result.matchedCount}`);
    console.log(`📝 Documents modified: ${result.modifiedCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error activating products:', error);
    process.exit(1);
  }
}

activateProducts(); 