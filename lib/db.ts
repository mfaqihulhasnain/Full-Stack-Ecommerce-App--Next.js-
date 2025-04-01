import mongoose from 'mongoose';

// Log the MongoDB URI without sensitive information
function getRedactedUri(uri: string): string {
  try {
    // Create a URL object from the MongoDB URI
    const url = new URL(uri);
    
    // If there's a username and password, redact them
    if (url.username || url.password) {
      return uri.replace(`${url.username}:${url.password}@`, '[REDACTED]@');
    }
    
    return uri;
  } catch (error) {
    // If the URI is not a valid URL, return a safe version
    return uri.includes('@') ? 
      uri.replace(/\/\/([^@]+)@/, '//[REDACTED]@') : 
      uri;
  }
}

// Get the MongoDB URI from environment variables or use a default
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/novabuy';

// Log the connection attempt (without credentials)
console.log(`Attempting to connect to MongoDB: ${getRedactedUri(MONGODB_URI)}`);

// Define the interface for our cached mongoose connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declare the global namespace augmentation
declare global {
  var mongoose: MongooseCache | undefined;
}

// Initialize the cache
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

// Save the cache to the global object
if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect() {
  if (cached.conn) {
    console.log('Using existing MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Set server timeout to 60 seconds
      serverSelectionTimeoutMS: 60000,
      // Add retry logic
      maxPoolSize: 10,
    };

    console.log('Establishing new MongoDB connection');
    
    try {
      cached.promise = mongoose.connect(MONGODB_URI, opts)
        .then((mongoose) => {
          console.log('Connected to MongoDB successfully');
          return mongoose;
        })
        .catch((error) => {
          console.error('========== MONGODB CONNECTION ERROR ==========');
          console.error('Error connecting to MongoDB:', error.message);
          console.error('Error details:', JSON.stringify(error, null, 2));
          console.error('Error name:', error.name);
          console.error('Error code:', error.code);
          console.error('Error type:', typeof error);
          
          // Check for specific error types
          if (error.name === 'MongoServerSelectionError') {
            console.error('MongoDB server selection error. Is MongoDB running?');
            console.error('Make sure your MongoDB server is running on the specified host and port.');
          } else if (error.name === 'MongoParseError') {
            console.error('MongoDB connection string parse error. Check your MONGODB_URI format.');
            console.error('Current URI (redacted):', getRedactedUri(MONGODB_URI));
          } else if (error.message.includes('ECONNREFUSED')) {
            console.error('Connection refused. Make sure MongoDB is running on the specified host and port.');
          }
          
          console.error('==============================================');
          throw error;
        });
    } catch (error) {
      console.error('Uncaught error during MongoDB connection setup:', error);
      throw error;
    }
  } else {
    console.log('Using pending MongoDB connection promise');
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error: any) {
    console.error('Failed to resolve MongoDB connection promise:', error.message);
    throw error;
  }
}

export default dbConnect; 