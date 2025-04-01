import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@clerk/nextjs/server';
import { getOrderById, getOrderStatusColor, formatOrderDate, formatCurrency } from '@/lib/order-helpers';
import { ArrowLeft, Clock, CreditCard, MapPin, CheckCircle, Truck, AlertCircle, XCircle } from 'lucide-react';

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { userId } = auth();
  
  // Redirect to sign in if not authenticated
  if (!userId) {
    redirect('/sign-in');
  }
  
  // Get order ID from params
  const orderId = params.id;
  
  // Log for debugging
  console.log("Fetching order with ID:", orderId);
  
  // Fetch the order
  const order = await getOrderById(orderId);
  
  // Log for debugging
  console.log("Order found:", order ? "Yes" : "No");
  
  // If order not found or doesn't belong to current user
  if (!order) {
    notFound();
  }
  
  // Helper function to get status icon
  function getStatusIcon(status: string) {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-6">
        <Link 
          href="/account/orders" 
          className="inline-flex items-center text-sm text-gray-600 hover:text-primary mr-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Orders
        </Link>
        <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Order Status and Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Order Status</h2>
              
              <div className="flex items-center mb-4">
                {getStatusIcon(order.status)}
                <span 
                  className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium mb-2">Order Timeline</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">Order Placed</p>
                      <p className="text-sm text-gray-500">{formatOrderDate(order.createdAt)}</p>
                    </div>
                  </li>
                  
                  {order.isPaid && (
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">Payment Confirmed</p>
                        <p className="text-sm text-gray-500">{order.paidAt ? formatOrderDate(order.paidAt) : ''}</p>
                      </div>
                    </li>
                  )}
                  
                  {order.status === 'shipped' || order.status === 'delivered' ? (
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">Order Shipped</p>
                        <p className="text-sm text-gray-500">Your order is on the way</p>
                      </div>
                    </li>
                  ) : order.status !== 'cancelled' ? (
                    <li className="flex items-start opacity-50">
                      <div className="flex-shrink-0">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">Order Shipped</p>
                        <p className="text-sm text-gray-500">Pending</p>
                      </div>
                    </li>
                  ) : null}
                  
                  {order.status === 'delivered' ? (
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">Order Delivered</p>
                        <p className="text-sm text-gray-500">{order.deliveredAt ? formatOrderDate(order.deliveredAt) : ''}</p>
                      </div>
                    </li>
                  ) : order.status !== 'cancelled' ? (
                    <li className="flex items-start opacity-50">
                      <div className="flex-shrink-0">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">Order Delivered</p>
                        <p className="text-sm text-gray-500">Pending</p>
                      </div>
                    </li>
                  ) : null}
                  
                  {order.status === 'cancelled' && (
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <XCircle className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">Order Cancelled</p>
                        <p className="text-sm text-gray-500">Your order has been cancelled</p>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Order Items */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Order Items ({order.items.length})</h2>
              
              <ul className="divide-y divide-gray-200">
                {order.items.map((item, index) => (
                  <li key={index} className="py-4 flex">
                    <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden relative">
                      <Image
                        src={item.image || '/images/placeholder.png'}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1 flex flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium">
                          <h3>
                            <Link href={`/products/${item.product}`} className="hover:text-primary">
                              {item.name}
                            </Link>
                          </h3>
                          <p className="ml-4">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {formatCurrency(item.price)} x {item.quantity}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="space-y-6">
          {/* Payment Info */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Payment Information</h2>
              
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Payment Method</p>
                  <p className="text-sm text-gray-500">{order.paymentMethod}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {order.isPaid ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Payment Status</p>
                  <p className="text-sm text-gray-500">
                    {order.isPaid ? `Paid on ${formatOrderDate(order.paidAt || '')}` : 'Pending'}
                  </p>
                </div>
              </div>
              
              {order.paymentResult && (
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <p className="text-sm font-medium">Transaction ID</p>
                  <p className="text-sm text-gray-500 break-all">{order.paymentResult.id}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Shipping Address */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm">
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                    {order.shippingAddress.country}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>
              
              <div className="flow-root">
                <dl className="-my-4 text-sm divide-y divide-gray-200">
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-gray-600">Subtotal</dt>
                    <dd className="font-medium">{formatCurrency(order.itemsPrice)}</dd>
                  </div>
                  
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-gray-600">Shipping</dt>
                    <dd className="font-medium">{formatCurrency(order.shippingPrice)}</dd>
                  </div>
                  
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-gray-600">Tax</dt>
                    <dd className="font-medium">{formatCurrency(order.taxPrice)}</dd>
                  </div>
                  
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-base font-medium">Order Total</dt>
                    <dd className="text-base font-bold">{formatCurrency(order.totalPrice)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 