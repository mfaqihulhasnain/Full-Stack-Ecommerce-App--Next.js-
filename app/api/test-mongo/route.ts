import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    console.log('Test MongoDB API route called');
    
    // Get MongoDB URI from environment
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/novabuy';
    console.log('Using MongoDB URI:', uri);
    
    // Create a MongoDB client
    const client = new MongoClient(uri);
    
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Successfully connected to MongoDB!');
    
    // Get database and collection
    const db = client.db('novabuy');
    const collection = db.collection('test_connection');
    
    // Insert a test document
    const result = await collection.insertOne({
      test: true,
      message: 'API route MongoDB test',
      timestamp: new Date()
    });
    
    console.log('Test document inserted with ID:', result.insertedId);
    
    // Close the connection
    await client.close();
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      documentId: result.insertedId.toString()
    });
  } catch (error: any) {
    console.error('MongoDB Error:', error);
    
    // Return error response
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        name: error.name,
        stack: error.stack
      },
      { status: 500 }
    );
  }
} 