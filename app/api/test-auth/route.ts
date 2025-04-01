import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    // Get auth info
    const authInfo = auth();
    const { userId } = authInfo;
    
    if (!userId) {
      return NextResponse.json({ 
        status: 'unauthenticated', 
        message: 'No user is authenticated',
        headers: Object.fromEntries(req.headers.entries())
      });
    }
    
    // Try to connect to the database
    let dbStatus = 'unknown';
    let dbError = null;
    
    try {
      await dbConnect();
      dbStatus = 'connected';
    } catch (error: any) {
      dbStatus = 'error';
      dbError = error.message;
    }
    
    // Return auth info
    return NextResponse.json({
      status: 'authenticated',
      userId,
      auth: authInfo,
      db: {
        status: dbStatus,
        error: dbError
      },
      headers: Object.fromEntries(req.headers.entries())
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 