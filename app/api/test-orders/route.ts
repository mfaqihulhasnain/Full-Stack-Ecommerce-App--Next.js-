import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Order from '@/models/Order';

export async function GET(req: NextRequest) {
  try {
    // Get auth info
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ 
        status: 'unauthenticated', 
        message: 'No user is authenticated'
      }, { status: 401 });
    }
    
    // Connect to database
    try {
      await dbConnect();
    } catch (error: any) {
      return NextResponse.json({
        status: 'db_error',
        message: 'Failed to connect to database',
        error: error.message
      }, { status: 500 });
    }
    
    // Try to get user
    try {
      const user = await User.findOne({ clerkId: userId });
      
      if (!user) {
        return NextResponse.json({
          status: 'user_not_found',
          message: 'User not found in database',
          clerkUserId: userId
        }, { status: 404 });
      }
      
      // Try to get orders
      try {
        const orders = await Order.find({ user: user._id })
          .sort({ createdAt: -1 })
          .populate('items.product', 'name price image')
          .lean();
        
        return NextResponse.json({
          status: 'success',
          orderCount: orders.length,
          orders: orders.map(order => ({
            id: order._id.toString(),
            orderNumber: order.orderNumber,
            status: order.status,
            totalPrice: order.totalPrice,
            createdAt: order.createdAt
          }))
        });
      } catch (error: any) {
        return NextResponse.json({
          status: 'orders_error',
          message: 'Error fetching orders',
          error: error.message,
          userId: user._id.toString()
        }, { status: 500 });
      }
    } catch (error: any) {
      return NextResponse.json({
        status: 'user_error',
        message: 'Error fetching user',
        error: error.message,
        clerkUserId: userId
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      stack: error.stack
 