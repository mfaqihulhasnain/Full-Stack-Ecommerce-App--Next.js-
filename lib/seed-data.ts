import dbConnect from './db';
import Product from '@/models/Product';
import { categories, products as mockProducts } from './data';
import fs from 'fs';
import path from 'path';

// Function to log to a file in case console logs aren't visible
function logToFile(message: string) {
  try {
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    const logFile = path.join(logDir, 'mongodb-debug.log');
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFile, `${timestamp}: ${message}\n`);
  } catch (err) {
    console.error('Error writing to log file:', err);
  }
}

export async function seedProducts() {
  logToFile('Starting database seeding process...');
  
  try {
    console.log('Starting database seeding process...');
    logToFile('Attempting to connect to database...');
    
    await dbConnect();
    console.log('Database connected successfully');
    logToFile('Database connected successfully');
    
    // Check if there are already products in the database
    const count = await Product.countDocuments();
    console.log(`Current product count in database: ${count}`);
    logToFile(`Current product count in database: ${count}`);
    
    if (count > 0) {
      console.log(`Database already has ${count} products. Skipping seed.`);
      logToFile(`Database already has ${count} products. Skipping seed.`);
      return { success: true, message: 'Seed skipped - products already exist', count };
    }
    
    // Map the mock products to match our MongoDB schema
    const productsToInsert = mockProducts.map(product => ({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      inStock: product.inStock,
      featured: product.featured || false,
      colors: product.colors || [],
      ratings: product.ratings || 0,
      reviewCount: product.reviewCount || 0,
    }));
    
    console.log(`Preparing to insert ${productsToInsert.length} products`);
    logToFile(`Preparing to insert ${productsToInsert.length} products`);
    
    // Insert products
    const result = await Product.insertMany(productsToInsert);
    
    console.log(`Successfully seeded ${result.length} products`);
    logToFile(`Successfully seeded ${result.length} products`);
    return { success: true, count: result.length };
  } catch (error) {
    console.error('Error seeding products:', error);
    logToFile(`ERROR seeding products: ${error.message}`);
    logToFile(`ERROR stack: ${error.stack}`);
    
    // Add more specific error logging
    if (error.name === 'MongoServerSelectionError') {
      console.error('MongoDB server selection error. Is MongoDB running?');
      logToFile('MongoDB server selection error. Is MongoDB running?');
    } else if (error.name === 'MongoParseError') {
      console.error('MongoDB connection string parse error. Check your MONGODB_URI format.');
      logToFile('MongoDB connection string parse error. Check your MONGODB_URI format.');
    } else if (error.message && error.message.includes('ECONNREFUSED')) {
      console.error('Connection refused. Make sure MongoDB is running on the specified host and port.');
      logToFile('Connection refused. Make sure MongoDB is running on the specified host and port.');
    }
    
    return { success: false, error: error.message };
  }
} 