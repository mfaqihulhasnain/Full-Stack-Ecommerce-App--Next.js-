import { MongoClient, Db } from 'mongodb';

// Get the MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/novabuy';
const DB_NAME = 'novabuy';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections to grow exponentially
 * during API Route usage.
 */
let globalWithMongo = global as typeof globalThis & {
  mongo: {
    conn: MongoClient | null;
    promise: Promise<MongoClient> | null;
  };
};

// Initialize the global mongo connection cache
if (!globalWithMongo.mongo) {
  globalWithMongo.mongo = { conn: null, promise: null };
}

/**
 * Connect to MongoDB and return the client and database
 */
export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  // If we have cached connections, return them
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }
  
  // If a connection is already being established, wait for it
  if (globalWithMongo.mongo.promise) {
    try {
      cachedClient = await globalWithMongo.mongo.promise;
      cachedDb = cachedClient.db(DB_NAME);
      return { client: cachedClient, db: cachedDb };
    } catch (error) {
      // If the cached promise rejects, clear it and try again
      globalWithMongo.mongo.promise = null;
      throw error;
    }
  }

  // Start a new connection
  console.log(`🔄 Connecting to MongoDB: ${MONGODB_URI.replace(/:([^:@]+)@/, ':****@')}`);
  
  try {
    // Create a new promise to connect
    globalWithMongo.mongo.promise = new MongoClient(MONGODB_URI).connect();
    
    // Await the connection
    cachedClient = await globalWithMongo.mongo.promise;
    cachedDb = cachedClient.db(DB_NAME);
    
    console.log('✅ Connected to MongoDB');
    
    return { client: cachedClient, db: cachedDb };
  } catch (error: any) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Clear the promise cache on error
    globalWithMongo.mongo.promise = null;
    
    throw error;
  }
} 