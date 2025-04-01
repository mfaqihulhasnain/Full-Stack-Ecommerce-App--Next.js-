import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/user';

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no svix headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }

  // Get the event type
  const eventType = evt.type;

  // Connect to the database
  try {
    await dbConnect();
  } catch (error) {
    console.error('Failed to connect to database:', error);
    return new Response('Internal Server Error', { status: 500 });
  }

  // Handle the event
  console.log(`Webhook with type ${eventType}`);
  
  try {
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data);
        break;
      case 'user.updated':
        await handleUserUpdated(evt.data);
        break;
      case 'user.deleted':
        await handleUserDeleted(evt.data);
        break;
      // Add more cases for other event types you want to handle
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error handling ${eventType} event:`, error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

// Handler functions for different event types
async function handleUserCreated(userData: any) {
  try {
    // Extract relevant user data from Clerk's webhook payload
    const { id: clerkId, email_addresses, first_name, last_name, image_url } = userData;
    
    const primaryEmail = email_addresses?.[0]?.email_address;
    
    if (!primaryEmail) {
      console.error('No email address found for user:', clerkId);
      return;
    }
    
    // Prepare the user name
    const name = `${first_name || ''} ${last_name || ''}`.trim();
    
    // Create a new user record in our database
    const newUser = new User({
      clerkId,
      email: primaryEmail,
      name,
      firstName: first_name,
      lastName: last_name,
      imageUrl: image_url,
    });
    
    await newUser.save();
    console.log('User created in database:', clerkId);
  } catch (error) {
    console.error('Error creating user in database:', error);
    throw error;
  }
}

async function handleUserUpdated(userData: any) {
  try {
    // Extract relevant user data from Clerk's webhook payload
    const { id: clerkId, email_addresses, first_name, last_name, image_url } = userData;
    
    const primaryEmail = email_addresses?.[0]?.email_address;
    
    if (!primaryEmail) {
      console.error('No email address found for user:', clerkId);
      return;
    }
    
    // Prepare the user name
    const name = `${first_name || ''} ${last_name || ''}`.trim();
    
    // Update the user in our database
    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      {
        email: primaryEmail,
        name,
        firstName: first_name,
        lastName: last_name,
        imageUrl: image_url,
      },
      { new: true } // Return the updated document
    );
    
    if (!updatedUser) {
      // If the user doesn't exist yet, create them
      await handleUserCreated(userData);
      return;
    }
    
    console.log('User updated in database:', clerkId);
  } catch (error) {
    console.error('Error updating user in database:', error);
    throw error;
  }
}

async function handleUserDeleted(userData: any) {
  try {
    // Extract the Clerk ID from the webhook payload
    const { id: clerkId } = userData;
    
    // Delete the user from our database
    const deletedUser = await User.findOneAndDelete({ clerkId });
    
    if (!deletedUser) {
      console.warn('User not found in database for deletion:', clerkId);
      return;
    }
    
    console.log('User deleted from database:', clerkId);
  } catch (error) {
    console.error('Error deleting user from database:', error);
    throw error;
  }
} 