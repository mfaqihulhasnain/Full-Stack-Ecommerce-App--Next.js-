import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import User from '@/models/user';

export async function POST(req: Request) {
  try {
    console.log('Manual user sync requested');
    
    // Verify authentication
    const { userId } = auth();
    if (!userId) {
      console.log('Unauthorized sync attempt');
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the request body
    const payload = await req.json();
    console.log('Sync payload:', payload);
    
    // Validate payload
    if (!payload.clerkId || !payload.email) {
      console.error('Invalid sync payload:', payload);
      return NextResponse.json(
        { success: false, message: 'Invalid user data' },
        { status: 400 }
      );
    }

    // Ensure the user is only syncing their own data
    if (payload.clerkId !== userId) {
      console.error('User attempted to sync another user\'s data', {
        authenticatedId: userId,
        requestedId: payload.clerkId,
      });
      return NextResponse.json(
        { success: false, message: 'You can only sync your own user data' },
        { status: 403 }
      );
    }

    // Connect to the database
    try {
      console.log('Connecting to MongoDB');
      await dbConnect();
      console.log('Connected to MongoDB successfully');
    } catch (dbError: any) {
      console.error('MongoDB connection error:', dbError);
      return NextResponse.json(
        { success: false, message: 'Database connection failed', error: dbError.message },
        { status: 500 }
      );
    }

    // Prepare user data
    const userData = {
      clerkId: payload.clerkId,
      email: payload.email,
      firstName: payload.firstName || '',
      lastName: payload.lastName || '',
      name: `${payload.firstName || ''} ${payload.lastName || ''}`.trim(),
      imageUrl: payload.imageUrl || '',
    };

    console.log('Syncing user data to MongoDB:', userData);

    try {
      // Upsert the user (create if not exists, update if exists)
      const result = await User.findOneAndUpdate(
        { clerkId: userData.clerkId },
        userData,
        { upsert: true, new: true }
      );
      
      console.log('User synced successfully:', {
        id: result._id,
        clerkId: result.clerkId,
        email: result.email,
      });
      
      return NextResponse.json({
        success: true,
        message: 'User data synced successfully',
        user: {
          id: result._id,
          clerkId: result.clerkId,
          email: result.email,
          name: result.name,
          firstName: result.firstName,
          lastName: result.lastName,
          imageUrl: result.imageUrl,
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
        }
      });
    } catch (dbError: any) {
      console.error('Error saving user to MongoDB:', dbError);
      return NextResponse.json(
        { success: false, message: 'Failed to save user data', error: dbError.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Unexpected error in user sync:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to sync user data', error: error.message },
      { status: 500 }
    );
  }
} 