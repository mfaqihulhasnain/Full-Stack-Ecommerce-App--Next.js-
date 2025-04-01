import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import User from '@/models/user';

export async function GET() {
  try {
    console.log('Test DB endpoint called');
    
    // Check MongoDB connection status first
    const connectionStatus = mongoose.connection.readyState;
    const statusLabels = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
      99: 'uninitialized'
    };
    
    console.log(`Current MongoDB connection status: ${connectionStatus} (${statusLabels[connectionStatus as keyof typeof statusLabels]})`);
    
    try {
      // Connect to MongoDB
      console.log('Attempting to connect to MongoDB...');
      await dbConnect();
      console.log('MongoDB connection successful');
    } catch (dbError: any) {
      console.error('MongoDB connection error:', dbError);
      return NextResponse.json({
        success: false,
        message: 'Failed to connect to MongoDB',
        error: dbError.message,
        errorName: dbError.name,
        connectionStatus: statusLabels[connectionStatus as keyof typeof statusLabels]
      }, { status: 500 });
    }
    
    try {
      // Create a test user with random data
      const randomId = Math.floor(Math.random() * 10000);
      const testUser = new User({
        clerkId: `test_clerk_id_${randomId}`,
        email: `test_user_${randomId}@example.com`,
        name: `Test User ${randomId}`,
        firstName: 'Test',
        lastName: `User ${randomId}`,
        imageUrl: 'https://via.placeholder.com/150',
      });
      
      console.log('Saving test user to database...');
      await testUser.save();
      console.log('Test user saved successfully');
      
      // Get some users for verification
      const users = await User.find().sort({ createdAt: -1 }).limit(5);
      
      // Return success response
      return NextResponse.json({
        success: true,
        message: 'MongoDB connection successful',
        connectionDetails: {
          uri: process.env.MONGODB_URI ? 'Set in environment' : 'Not set (using default)',
          status: statusLabels[mongoose.connection.readyState as keyof typeof statusLabels],
        },
        testUser: {
          id: testUser._id,
          clerkId: testUser.clerkId,
          email: testUser.email,
          name: testUser.name,
          createdAt: testUser.createdAt
        },
        recentUsers: users.map(user => ({
          id: user._id,
          clerkId: user.clerkId,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt
        }))
      });
    } catch (userError: any) {
      console.error('Error creating test user:', userError);
      return NextResponse.json({
        success: false,
        message: 'MongoDB connection successful but failed to create test user',
        error: userError.message,
        errorName: userError.name,
        connectionStatus: statusLabels[mongoose.connection.readyState as keyof typeof statusLabels]
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Unexpected error in test-db endpoint:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to test database connection',
      error: error.message
    }, { status: 500 });
  }
} 