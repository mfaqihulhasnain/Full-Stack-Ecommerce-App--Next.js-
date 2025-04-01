#!/usr/bin/env node

/**
 * Test script for simulating Clerk webhook events
 * 
 * Usage:
 *   node scripts/test-webhook.js
 */

const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');
const readline = require('readline');

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask user for webhook URL
rl.question('Enter the webhook URL (default: http://localhost:3000/api/webhook/debug): ', async (webhookUrl) => {
  // Use default URL if none provided
  const url = webhookUrl || 'http://localhost:3000/api/webhook/debug';
  console.log(`Testing webhook at: ${url}`);

  // Ask for event type
  rl.question('Enter event type (1: user.created, 2: user.updated, 3: user.deleted): ', async (eventTypeChoice) => {
    let eventType;
    switch (eventTypeChoice) {
      case '2':
        eventType = 'user.updated';
        break;
      case '3':
        eventType = 'user.deleted';
        break;
      case '1':
      default:
        eventType = 'user.created';
        break;
    }

    // Generate test user data
    const userId = uuidv4();
    const email = `test.user.${Math.floor(Math.random() * 10000)}@example.com`;
    const firstName = 'Test';
    const lastName = 'User';

    // Create webhook payload based on Clerk's format
    const payload = {
      data: {
        id: userId,
        email_addresses: [
          {
            email_address: email,
            id: uuidv4()
          }
        ],
        first_name: firstName,
        last_name: lastName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      object: 'event',
      type: eventType
    };

    console.log(`\nSending ${eventType} webhook with user ID: ${userId}`);
    console.log(`User email: ${email}`);

    try {
      // Send the webhook request
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add mock Svix headers for the main webhook endpoint
          'svix-id': uuidv4(),
          'svix-timestamp': new Date().toISOString(),
          'svix-signature': 'mock_signature_for_testing'
        },
        body: JSON.stringify(payload)
      });

      // Parse and display the response
      const responseText = await response.text();
      console.log(`\nResponse status: ${response.status}`);
      try {
        const responseJson = JSON.parse(responseText);
        console.log('Response body:', JSON.stringify(responseJson, null, 2));
      } catch (e) {
        console.log('Response body:', responseText);
      }

      // Check status
      if (response.ok) {
        console.log('\n✅ Webhook test completed successfully!');
      } else {
        console.log('\n❌ Webhook test failed.');
      }

      // Check if it's the debug webhook
      if (url.includes('/debug')) {
        console.log('\nNext steps:');
        console.log('1. Check your server logs for detailed information about the webhook processing');
        console.log('2. Visit http://localhost:3000/api/webhook/debug to see if the user was added to the database');
      }
    } catch (error) {
      console.error('\n❌ Error sending webhook request:', error.message);
      console.log('\nPossible reasons:');
      console.log('- Your Next.js server is not running');
      console.log('- The webhook URL is incorrect');
      console.log('- There are network connectivity issues');
    }

    rl.close();
  });
}); 