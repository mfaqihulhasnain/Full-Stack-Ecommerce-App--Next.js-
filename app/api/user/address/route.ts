import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import { getAuth } from '@clerk/nextjs/server';

// Get the MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/novabuy';

// Helper function to get the current user ID
function getCurrentUserId(req: NextRequest): string | null {
  // Get user ID from Clerk
  const auth = getAuth(req);
  const userId = auth.userId;
  if (userId) return userId;
  
  // Fallback to header (set by middleware)
  return req.headers.get('x-clerk-user-id');
}

// GET endpoint to retrieve all addresses for a user
export async function GET(req: NextRequest) {
  const userId = getCurrentUserId(req);
  
  // If no user ID, return unauthorized
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    // Get database and collection
    const db = client.db('novabuy');
    const usersCollection = db.collection('users');
    
    // Find user by clerkId
    const user = await usersCollection.findOne({ clerkId: userId });
    
    // Close the connection
    await client.close();
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Return addresses
    return NextResponse.json(user.addresses || []);
  } catch (error: any) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST endpoint to add a new address
export async function POST(req: NextRequest) {
  const userId = getCurrentUserId(req);
  
  // If no user ID, return unauthorized
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Get address data from request body
    const addressData = await req.json();
    
    // Validate required fields
    const requiredFields = ['street', 'city', 'state', 'zipCode', 'country'];
    for (const field of requiredFields) {
      if (!addressData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    // Get database and collection
    const db = client.db('novabuy');
    const usersCollection = db.collection('users');
    
    // Generate a unique ID for the address
    const addressId = new ObjectId().toString();
    
    // Prepare address document
    const address = {
      id: addressId,
      street: addressData.street,
      city: addressData.city,
      state: addressData.state,
      zipCode: addressData.zipCode,
      country: addressData.country,
      isDefault: addressData.isDefault || false,
      createdAt: new Date()
    };
    
    // If this is set as default, run two separate operations to ensure it works correctly
    let result;
    
    if (address.isDefault) {
      // First, unset any existing default address
      await usersCollection.updateOne(
        { clerkId: userId },
        { $set: { "addresses.$[elem].isDefault": false } },
        { arrayFilters: [{ "elem.isDefault": true }] }
      );
    }
    
    // Then add the new address in a separate operation
    result = await usersCollection.updateOne(
      { clerkId: userId },
      { $push: { addresses: address } }
    );
    
    // Close the connection
    await client.close();
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Address added successfully',
      addressId
    });
  } catch (error: any) {
    console.error('Error adding address:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PUT endpoint to update an address
export async function PUT(req: NextRequest) {
  const userId = getCurrentUserId(req);
  
  // If no user ID, return unauthorized
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Get address data from request body
    const { addressId, ...addressData } = await req.json();
    
    if (!addressId) {
      return NextResponse.json(
        { error: 'Address ID is required' },
        { status: 400 }
      );
    }
    
    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    // Get database and collection
    const db = client.db('novabuy');
    const usersCollection = db.collection('users');
    
    // If this is set as default, unset any existing default address
    let operations = [];
    if (addressData.isDefault) {
      operations.push({
        updateOne: {
          filter: { 
            clerkId: userId, 
            "addresses.isDefault": true 
          },
          update: { 
            $set: { "addresses.$.isDefault": false } 
          }
        }
      });
    }
    
    // Update the specific address
    operations.push({
      updateOne: {
        filter: { 
          clerkId: userId, 
          "addresses.id": addressId 
        },
        update: { 
          $set: Object.fromEntries(
            Object.entries(addressData).map(([key, value]) => [`addresses.$.${key}`, value])
          ) 
        }
      }
    });
    
    // Execute bulk operations
    const result = await usersCollection.bulkWrite(operations);
    
    // Close the connection
    await client.close();
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Address updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating address:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove an address
export async function DELETE(req: NextRequest) {
  const userId = getCurrentUserId(req);
  
  // If no user ID, return unauthorized
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Get address ID from URL
  const { searchParams } = new URL(req.url);
  const addressId = searchParams.get('id');
  
  if (!addressId) {
    return NextResponse.json(
      { error: 'Address ID is required' },
      { status: 400 }
    );
  }
  
  try {
    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    // Get database and collection
    const db = client.db('novabuy');
    const usersCollection = db.collection('users');
    
    // Remove address from user document
    const result = await usersCollection.updateOne(
      { clerkId: userId },
      { $pull: { addresses: { id: addressId } } }
    );
    
    // Close the connection
    await client.close();
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Address removed successfully'
    });
  } catch (error: any) {
    console.error('Error removing address:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 