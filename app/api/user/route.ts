import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongodb';

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
    // Connect to MongoDB using the utility
    const { db } = await connectToDatabase();
    
    // Get users collection
    const usersCollection = db.collection('users');
    
    // Find user by clerkId
    const user = await usersCollection.findOne({ clerkId: userId });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Return user data (exclude sensitive information)
    return NextResponse.json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      addresses: user.addresses || [],
      preferences: user.preferences || {}
    });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    
    return NextResponse.json(
      { error: 'Database error: ' + error.message },
      { status: 500 }
    );
  }
}

// POST endpoint to create or update user profile
export async function POST(req: NextRequest) {
  const userId = getCurrentUserId(req);
  
  // If no user ID, return unauthorized
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Get request body
    const userData = await req.json();
    
    // Connect to MongoDB using the utility
    const { db } = await connectToDatabase();
    
    // Get users collection
    const usersCollection = db.collection('users');
    
    // Prepare user data with clerkId
    const userDocument = {
      clerkId: userId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      addresses: userData.addresses || [],
      preferences: userData.preferences || {},
      updatedAt: new Date()
    };
    
    // Upsert: Create if not exists, update if exists
    const result = await usersCollection.updateOne(
      { clerkId: userId },
      { $set: userDocument, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: result.upsertedCount > 0 ? 'User created' : 'User updated',
      userId
    });
  } catch (error: any) {
    console.error('Error updating user:', error);
    
    return NextResponse.json(
      { error: 'Database error: ' + error.message },
      { status: 500 }
    );
  }
} 