'use client';

import { Container } from "@/components/ui/container";
import Link from "next/link";
import { User, ShoppingBag, Heart, CreditCard, Settings, LogOut, Package } from "lucide-react";

export default function OrdersPage() {
  // Mock user data for demonstration
  const mockUser = {
    fullName: "Demo User",
    emailAddress: "user@example.com",
    imageUrl: null
  };

  // In a real app, you would fetch orders from your database
  const mockOrders = [
    {
      id: "ORD-12345",
      date: "May 15, 2023",
      total: "$129.99",
      status: "Delivered",
      items: 3
    },
    {
      id: "ORD-12346",
      date: "June 22, 2023",
      total: "$89.50",
      status: "Shipped",
      items: 2
    },
    {
      id: "ORD-12347",
      date: "July 10, 2023",
      total: "$215.75",
      status: "Processing",
      items: 4
    }
  ];

  return (
    <div className="py-12">
      <Container>
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Orders</h1>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-64 shrink-0">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="relative w-20 h-20 rounded-full bg-gray-100 mb-3 overflow-hidden">
                    {mockUser.imageUrl ? (
                      <img 
                        src={mockUser.imageUrl} 
                        alt={mockUser.fullName || "Profile"} 
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-primary/10 text-primary">
                        <User size={30} />
                      </div>
                    )}
                  </div>
                  <h2 className="font-semibold text-lg">
                    {mockUser.fullName}
                  </h2>
                  <p className="text-sm text-gray-500">{mockUser.emailAddress}</p>
                </div>

                <nav className="space-y-1">
                  <Link href="/profile" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-700 hover:text-gray-900">
                    <User size={16} className="mr-3 text-gray-500" />
                    Personal Info
                  </Link>
                  <Link href="/profile/orders" className="flex items-center px-3 py-2 text-sm rounded-md bg-gray-100 font-medium text-gray-900">
                    <ShoppingBag size={16} className="mr-3 text-gray-500" />
                    Orders
                  </Link>
                  <Link href="/profile/wishlist" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-700 hover:text-gray-900">
                    <Heart size={16} className="mr-3 text-gray-500" />
                    Wishlist
                  </Link>
                  <Link href="/profile/payments" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-700 hover:text-gray-900">
                    <CreditCard size={16} className="mr-3 text-gray-500" />
                    Payment Methods
                  </Link>
                  <Link href="/profile/settings" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-700 hover:text-gray-900">
                    <Settings size={16} className="mr-3 text-gray-500" />
                    Account Settings
                  </Link>
                  <Link 
                    href="/sign-out" 
                    className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-red-50 text-red-600 hover:text-red-700"
                  >
                    <LogOut size={16} className="mr-3" />
                    Sign Out
                  </Link>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Order History</h2>
                </div>
                
                {mockOrders.length > 0 ? (
                  <div className="divide-y">
                    {mockOrders.map((order) => (
                      <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-semibold text-lg">{order.id}</h3>
                              <span className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium 
                                ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                                  order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                                  'bg-yellow-100 text-yellow-800'}`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Placed on {order.date}</p>
                            <p className="text-sm text-gray-500 mt-1">{order.items} items</p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{order.total}</div>
                            <Link 
                              href={`/profile/orders/${order.id}`}
                              className="text-primary hover:text-primary/80 text-sm font-medium mt-2 inline-flex items-center"
                            >
                              View Details
                              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      When you place your first order, it will appear here.
                    </p>
                    <Link 
                      href="/shop"
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                    >
                      Start Shopping
                    </Link>
                  </div>
                )}
              </div>
              
              <div className="mt-6 bg-amber-50 text-amber-700 p-4 rounded-lg text-center">
                <p className="text-sm">
                  Authentication is temporarily disabled. Order management will be available in a future update.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
} 