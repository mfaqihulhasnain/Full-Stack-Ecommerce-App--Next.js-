// Simple script to test MongoDB connection
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Function to get MongoDB URI from .env.local file
function getMongoDBUri() {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const uriMatch = envContent.match(/MONGODB_URI=(.+)/);
    
    if (uriMatch && uriMatch[1]) {
      return uriMatch[1].trim();
    }
    
    return 'mongodb://localhost:27017/novabuy';
  } catch (err) {
    console.error('Error reading .env.local file:', err);
    return 'mongodb://localhost:27017/novabuy';
  }
}

async function testConnection() {
  // Get MongoDB URI from .env.local
  const uri = getMongoDBUri();
  console.log('Using connection string:', uri);
  
  const client = new MongoClient(uri);
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Successfully connected to MongoDB!');
    
    // List databases to verify connection
    const adminDb = client.db('admin');
    const dbList = await adminDb.admin().listDatabases();
    
    console.log('Available databases:');
    dbList.databases.forEach(db => {
      console.log(`- ${db.name}`);
    });
    
    // Create a test document in the 'novabuy' database
    const db = client.db('novabuy');
    const collection = db.collection('test_connection');
    
    // Insert a test document
    const result = await collection.insertOne({
      test: true,
      message: 'MongoDB connection test',
      timestamp: new Date()
    });
    
    console.log('Test document inserted with ID:', result.insertedId);
    console.log('MongoDB connection and write operations are working correctly!');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

// Run the test
testConnection().catch(console.error); 