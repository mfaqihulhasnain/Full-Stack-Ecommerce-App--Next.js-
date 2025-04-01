import dbConnect from './db';
import Order, { IOrder } from '@/models/Order';
import { auth } from '@clerk/nextjs/server';

export async function getCurrentUserOrders() {
  const { userId } = auth();
  
  if (!userId) return [];
  
  await dbConnect();
  
  try {
    // Find the user's MongoDB ID from the Clerk ID
    const User = (await import('@/models/User')).default;
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      console.error(`User with clerk ID ${userId} not found in database`);
      return [];
    }
    
    console.log("Looking for orders for user:", user._id);
    
    // Check if Orders collection exists
    try {
      const mongoose = (await import('mongoose')).default;
      const collections = await mongoose.connection.db.listCollections().toArray();
      const collectionNames = collections.map(c => c.name);
      
      if (!collectionNames.includes('orders')) {
        console.log("Orders collection doesn't exist in the database yet");
        return [];
      }
      
      // Get orders for this user, sorted by most recent first
      const orders = await Order.find({ user: user._id })
        .sort({ createdAt: -1 })
        .populate('items.product', 'name price image')
        .lean();
      
      console.log(`Found ${orders.length} orders for user`);
      
      // Check if orders are returned properly
      if (orders.length > 0) {
        // Test stringify an ID to validate it works for routes
        console.log("Sample order ID format:", orders[0]._id.toString());
      }
      
      return orders;
    } catch (error) {
      console.error("Error checking collections or fetching orders:", error);
      return [];
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export async function getOrderById(orderId: string): Promise<IOrder | null> {
  const { userId } = auth();
  
  if (!userId) return null;
  
  await dbConnect();
  
  // Find the user's MongoDB ID from the Clerk ID
  const User = (await import('@/models/User')).default;
  const user = await User.findOne({ clerkId: userId });
  
  if (!user) {
    console.error(`User with clerk ID ${userId} not found in database`);
    return null;
  }
  
  try {
    console.log("Looking for order with ID:", orderId);
    
    // Clean up the ID and ensure it's a valid ObjectId
    let validOrderId;
    try {
      const mongoose = (await import('mongoose')).default;
      validOrderId = new mongoose.Types.ObjectId(orderId);
    } catch (error) {
      console.error("Invalid ObjectId format:", error);
      return null;
    }
    
    // Get order, ensuring it belongs to the current user
    const order = await Order.findOne({
      _id: validOrderId,
      user: user._id
    })
    .populate('items.product', 'name price image')
    .lean();
    
    console.log("Order found:", !!order);
    
    return order;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

export function getOrderStatusColor(status: string) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function formatOrderDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
} 