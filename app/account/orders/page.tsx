import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { getCurrentUserOrders, getOrderStatusColor, formatOrderDate, formatCurrency } from '@/lib/order-helpers';
import { ArrowLeft, ExternalLink, ShoppingBag, ChevronRight, Eye } from 'lucide-react';

export const metadata = {
  title: 'Your Orders | NovaBuy',
  description: 'View and manage your order history',
};

// Helper function to ensure ObjectId is stringified correctly
function getOrderIdString(id: any): string {
  return id && typeof id.toString === 'function' ? id.toString() : String(id);
}

export default async function OrdersPage() {
  const authResult = auth();
  const { userId } = authResult;
  
  // Add debugging
  console.log("Auth result:", JSON.stringify(authResult));
  console.log("User ID from auth:", userId);
  
  // Redirect to sign in if not authenticated
  if (!userId) {
    console.log("No user ID found, redirecting to /sign-in");
    redirect('/sign-in');
  }
  
  let orders = [];
  let error = null;
  
  try {
    orders = await getCurrentUserOrders();
    console.log(`Successfully loaded ${orders?.length || 0} orders`);
  } catch (err: any) {
    console.error("Error loading orders:", err);
    error = err.message || "Failed to load orders";
  }
  
  // For debugging
  if (orders && orders.length > 0) {
    console.log("First order ID in list:", getOrderIdString(orders[0]._id));
  } else {
    console.log("No orders found");
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-6">
        <Link 
          href="/account" 
          className="inline-flex items-center text-sm text-gray-600 hover:text-primary mr-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Account
        </Link>
        <h1 className="text-2xl font-bold">Your Orders</h1>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md mb-6">
          <p className="font-medium">Error loading orders</p>
          <p className="text-sm">{error}</p>
          <p className="text-sm mt-2">
            Please try again later or contact support if the problem persists.
          </p>
        </div>
      )}
      
      {!error && orders && orders.length > 0 ? (
        <div className="space-y-6">
          {/* Orders list */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <ul className="divide-y divide-gray-200">
              {orders.map((order) => {
                const orderId = getOrderIdString(order._id);
                return (
                <li key={orderId} className="hover:bg-gray-50">
                  <div className="px-4 py-5 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Order basic info */}
                    <div>
                      <div className="flex items-center">
                        <ShoppingBag className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="font-medium">#{order.orderNumber}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Placed on {formatOrderDate(order.createdAt)}
                      </p>
                    </div>
                    
                    {/* Status */}
                    <div className="flex items-center">
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    
                    {/* Total */}
                    <div>
                      <p className="text-sm font-medium">Total</p>
                      <p className="text-lg font-bold">{formatCurrency(order.totalPrice)}</p>
                      <p className="text-xs text-gray-500">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center justify-end">
                      <Link 
                        href={`/account/orders/${orderId}`}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        <Eye size={16} className="mr-1.5" />
                        View Details
                        <ChevronRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 p-8 text-center">
          <div className="flex flex-col items-center">
            <ShoppingBag className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
            <div className="space-y-4">
              <Link 
                href="/shop" 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Start Shopping
                <ExternalLink size={16} className="ml-2" />
              </Link>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
                <p className="font-medium mb-1">Need to create sample orders?</p>
                <p>For development and testing, run the seed script to create sample orders:</p>
                <pre className="bg-gray-800 text-gray-100 p-2 rounded mt-2 text-xs overflow-x-auto">node scripts/seed-orders.js</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 