import { connectDB } from '@/config/database';
import { Product } from '@/models/Product';
import dotenv from 'dotenv';

dotenv.config();

async function checkProducts() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Get all products
    const allProducts = await Product.find({});
    console.log(`\n📊 Total products in database: ${allProducts.length}`);

    // Get active products
    const activeProducts = await Product.find({ isActive: true });
    console.log(`📊 Active products: ${activeProducts.length}`);

    if (activeProducts.length > 0) {
      console.log('\n📋 Active Products List:');
      activeProducts.forEach(product => {
        console.log(`\n🆔 Product ID: ${product.productId}`);
        console.log(`📦 Name: ${product.name}`);
        console.log(`💰 Price: ₹${product.price}`);
        console.log(`📊 Stock: ${product.inventoryQuantity}`);
        console.log(`🔗 Alias: ${product.alias}`);
        console.log('----------------------------------------');
      });
    } else {
      console.log('\n❌ No active products found in the database.');
      console.log('\n💡 To fix this:');
      console.log('1. Run the product fetch service to populate products');
      console.log('2. Check if products are marked as active');
      console.log('3. Verify the database connection');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking products:', error);
    process.exit(1);
  }
}

checkProducts(); 