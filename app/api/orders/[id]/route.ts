import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';

// GET: Fetch a specific order
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    await dbConnect();
    
    // Get the user from Clerk ID
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Get the order, ensuring it belongs to the current user
    const order = await Order.findOne({
      _id: params.id,
      user: user._id
    }).populate('items.product', 'name price image');
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Update order status (for admin or payment callback)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    await dbConnect();
    
    // Verify user is an admin for status updates
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Non-admins can only update their own orders with payment information
    if (user.role !== 'admin') {
      // Get the order and verify ownership
      const userOrder = await Order.findOne({
        _id: params.id,
        user: user._id
      });
      
      if (!userOrder) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      
      // For customers, only allow updating payment result
      const { paymentResult } = await req.json();
      
      if (!paymentResult) {
        return NextResponse.json({ error: 'Payment result is required' }, { status: 400 });
      }
      
      userOrder.paymentResult = paymentResult;
      userOrder.isPaid = true;
      userOrder.paidAt = new Date();
      
      const updatedOrder = await userOrder.save();
      return NextResponse.json(updatedOrder);
    }
    
    // Admin can update any field
    const { status, isDelivered, paymentResult, isPaid } = await req.json();
    const order = await Order.findById(params.id);
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    // Update fields if provided
    if (status) order.status = status;
    if (isDelivered !== undefined) {
      order.isDelivered = isDelivered;
      if (isDelivered) order.deliveredAt = new Date();
    }
    if (isPaid !== undefined) {
      order.isPaid = isPaid;
      if (isPaid && !order.isPaid) order.paidAt = new Date();
    }
    if (paymentResult) order.paymentResult = paymentResult;
    
    const updatedOrder = await order.save();
    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 