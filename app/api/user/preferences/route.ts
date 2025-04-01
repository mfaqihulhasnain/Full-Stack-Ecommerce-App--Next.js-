import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
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

// GET endpoint to retrieve user preferences
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
    
    // Return preferences or default empty object
    return NextResponse.json(user.preferences || {});
  } catch (error: any) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST endpoint to update user preferences
export async function POST(req: NextRequest) {
  const userId = getCurrentUserId(req);
  
  // If no user ID, return unauthorized
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Get preferences data from request body
    const preferencesData = await req.json();
    
    // Validate preferences data
    if (!preferencesData || typeof preferencesData !== 'object') {
      return NextResponse.json(
        { error: 'Invalid preferences data format' },
        { status: 400 }
      );
    }
    
    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    // Get database and collection
    const db = client.db('novabuy');
    const usersCollection = db.collection('users');
    
    // Update user document with new preferences
    // We use $set with dot notation to update specific fields without overwriting the entire preferences object
    const updateFields = {};
    
    // Process each preference field
    for (const [key, value] of Object.entries(preferencesData)) {
      updateFields[`preferences.${key}`] = value;
    }
    
    // Add last updated timestamp
    updateFields['preferences.lastUpdated'] = new Date();
    
    // Update user document
    const result = await usersCollection.updateOne(
      { clerkId: userId },
      { $set: updateFields }
    );
    
    // Close the connection
    await client.close();
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Preferences updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 