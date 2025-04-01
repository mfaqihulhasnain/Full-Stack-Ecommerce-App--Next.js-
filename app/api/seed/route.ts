import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { products as mockProducts } from '@/lib/data';

export async function POST(req: NextRequest) {
  // Only allow this endpoint in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development mode' },
      { status: 403 }
    );
  }
  
  try {
    console.log('Seed API route called');
    
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
    const collection = db.collection('products');
    
    // Check if products already exist
    const count = await collection.countDocuments();
    console.log(`Current product count in database: ${count}`);
    
    if (count > 0) {
      console.log(`Database already has ${count} products. Skipping seed.`);
      await client.close();
      return NextResponse.json({ 
        success: true, 
        message: 'Seed skipped - products already exist', 
        count 
      });
    }
    
    // Map the mock products to match our schema
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
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    console.log(`Preparing to insert ${productsToInsert.length} products`);
    
    // Insert products
    const result = await collection.insertMany(productsToInsert);
    console.log(`Successfully seeded ${result.insertedCount} products`);
    
    // Close the connection
    await client.close();
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      count: result.insertedCount
    });
  } catch (error: any) {
    console.error('Seed Error:', error);
    
    // Return error response
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        name: error.name
      },
      { status: 500 }
    );
  }
} 