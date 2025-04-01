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

// GET endpoint to retrieve user profile
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
    
    // Return user profile data
    return NextResponse.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      bio: user.bio || '',
    });
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST endpoint to update user profile
export async function POST(req: NextRequest) {
  const userId = getCurrentUserId(req);
  
  // If no user ID, return unauthorized
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Get profile data from request body
    const profileData = await req.json();
    const { firstName, lastName, email, phone, bio } = profileData;
    
    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'First name, last name, and email are required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    // Get database and collection
    const db = client.db('novabuy');
    const usersCollection = db.collection('users');
    
    // Update user document with new profile data
    const result = await usersCollection.updateOne(
      { clerkId: userId },
      { 
        $set: { 
          firstName,
          lastName,
          email,
          phone: phone || '',
          bio: bio || '',
          updatedAt: new Date()
        } 
      }
    );
    
    // Close the connection
    await client.close();
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 