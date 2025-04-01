import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/user';

export async function POST(req: Request) {
  try {
    console.log('Debug webhook received');
    
    // Get the request body
    const payload = await req.json();
    console.log('Webhook payload:', JSON.stringify(payload, null, 2));
    
    // Log headers
    const headers = Object.fromEntries([...req.headers.entries()]);
    console.log('Webhook headers:', JSON.stringify(headers, null, 2));
    
    // Try to connect to MongoDB
    try {
      await dbConnect();
      console.log('Connected to MongoDB');
    } catch (dbError) {
      console.error('MongoDB connection error:', dbError);
      return NextResponse.json({
        success: false,
        error: 'Failed to connect to MongoDB',
        details: String(dbError)
      }, { status: 500 });
    }
    
    // Extract user data if this is a user event
    if (payload.type?.startsWith('user.')) {
      const userData = payload.data;
      
      if (!userData || !userData.id) {
        console.error('Invalid user data:', userData);
        return NextResponse.json({
          success: false,
          error: 'Invalid user data',
          payload
        }, { status: 400 });
      }
      
      const clerkId = userData.id;
      const email = userData.email_addresses?.[0]?.email_address || 'unknown@example.com';
      const firstName = userData.first_name || '';
      const lastName = userData.last_name || '';
      const name = `${firstName} ${lastName}`.trim();
      
      console.log(`Processing user: ${clerkId}, email: ${email}, name: ${name}`);
      
      // Create or update user
      const user = {
        clerkId,
        email,
        name,
        firstName,
        lastName,
        imageUrl: userData.image_url || '',
      };
      
      try {
        // Upsert the user (create if not exists, update if exists)
        const result = await User.findOneAndUpdate(
          { clerkId },
          user,
          { upsert: true, new: true }
        );
        
        console.log('User saved to database:', result);
      } catch (saveError) {
        console.error('Error saving user to database:', saveError);
        return NextResponse.json({
          success: false,
          error: 'Failed to save user',
          details: String(saveError),
          user
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({ success: true, message: 'Debug webhook processed' });
  } catch (error) {
    console.error('Debug webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Error processing webhook', details: String(error) },
      { status: 500 }
    );
  }
}

// GET handler to retrieve all users (for debugging)
export async function GET() {
  try {
    await dbConnect();
    const users = await User.find().sort({ createdAt: -1 }).limit(20);
    
    return NextResponse.json({
      success: true,
      message: "Debug webhook endpoint is active",
      users: users.map(user => ({
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unnamed User',
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    console.error("Error in webhook GET endpoint:", error);
    return NextResponse.json({
      success: false,
      message: `Error checking webhook status: ${String(error)}`
    }, { status: 500 });
  }
} 