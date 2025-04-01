# Troubleshooting Guide for MongoDB and Clerk Webhooks

This guide provides solutions for common issues with MongoDB connectivity and Clerk webhook integration.

## MongoDB Connection Issues

### Common Problems:

1. **MongoDB not running**
   - **Symptoms**: Error messages containing "connection refused" or "server selection timeout"
   - **Solution**: 
     - Ensure MongoDB is installed and running on your system
     - For Windows: Check Services or Task Manager
     - For macOS/Linux: Run `ps aux | grep mongo` to check if MongoDB process is running
     - Start MongoDB if needed:
       - Windows: `net start MongoDB`
       - macOS: `brew services start mongodb-community`
       - Linux: `sudo systemctl start mongod`

2. **Incorrect connection string**
   - **Symptoms**: "Invalid connection string" or similar errors
   - **Solution**:
     - Check your `.env.local` file
     - Ensure `MONGODB_URI` is properly formatted (e.g., `mongodb://localhost:27017/eccomerceapp`)
     - If using Atlas or other remote MongoDB, confirm the username, password, and connection parameters

3. **Database name inconsistencies**
   - **Symptoms**: Data appears in a different database than expected
   - **Solution**:
     - Ensure the database name in the connection string matches throughout your application
     - Default local connection should be: `mongodb://localhost:27017/eccomerceapp`

### Testing MongoDB Connection:

1. Visit `http://localhost:3000/api/test-db` in your browser
2. You should see a JSON response with a test user if the connection is successful
3. Check your application logs for detailed error messages if the connection fails

## Clerk Webhook Issues

### Common Problems:

1. **Invalid webhook URL**
   - **Symptoms**: Users sign up, but their data doesn't appear in the database
   - **Solution**:
     - Ensure your webhook URL in Clerk dashboard is correct
     - For local development, use a properly configured ngrok URL
     - The URL should end with `/api/webhook` for the main webhook or `/api/webhook/debug` for the debug webhook

2. **Webhook secret mismatch**
   - **Symptoms**: 400 errors or signature verification failures in logs
   - **Solution**:
     - Check that `CLERK_WEBHOOK_SECRET` in `.env.local` matches the secret in Clerk dashboard
     - Regenerate the webhook secret if needed and update both places

3. **ngrok issues**
   - **Symptoms**: Unable to receive webhook events from Clerk
   - **Solution**:
     - Ensure ngrok is running with `npx ngrok http 3000`
     - Copy the current forwarding URL (it changes each time you restart ngrok)
     - Update both your `.env.local` file and Clerk dashboard with the new URL

### Testing Webhooks:

1. Use the included test script:
   ```
   npm run test:webhook
   ```
   This will send a simulated webhook event to test your setup

2. Check the debug webhook:
   - Visit `http://localhost:3000/api/webhook/debug` to see all users in the database
   - This endpoint does not require signature verification, making it easier to test

3. Use the Clerk dashboard:
   - Go to the Webhooks section in your Clerk dashboard
   - Click "Test endpoint" to send a test event
   - Check your application logs for the result

## Checking Application Logs

Look for detailed error messages in your terminal where the Next.js application is running. Key things to look for:

- MongoDB connection errors
- Webhook verification failures
- Invalid user data errors

## Debugging Database with MongoDB Compass

1. Install [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to your MongoDB instance (default: `mongodb://localhost:27017`)
3. Browse to the `eccomerceapp` database
4. Examine the `users` collection to see if user data is being saved correctly

## Still Having Issues?

If you're still experiencing problems after trying the solutions above:

1. Check that all environment variables are correctly set in `.env.local`
2. Restart your Next.js development server
3. Clear your browser cache
4. Ensure all dependencies are installed with `npm install`
5. Check for any firewall or network restrictions that might block MongoDB or webhook connections 