// Test MongoDB Connection
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/novabuy';

async function main() {
  console.log('Testing MongoDB connection...');
  console.log('URI:', MONGODB_URI.replace(/:([^:@]+)@/, ':****@')); // Hide password in logs
  
  let client;
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Successfully connected to MongoDB');
    
    // Test database access
    const db = client.db('novabuy');
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Count users
    const usersCount = await db.collection('users').countDocuments();
    console.log(`There are ${usersCount} users in the database`);
    
    console.log('Database connection test completed successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('Stack trace:', err.stack);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

main(); 