'use client';

import { Container } from "@/components/ui/container";
import Link from "next/link";
import { User, ShoppingBag, Heart, CreditCard, Settings, LogOut, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  // Mock user data for demonstration
  const mockUser = {
    fullName: "Demo User",
    emailAddress: "user@example.com",
    imageUrl: null
  };

  // Mock wishlist data - in a real app, you would fetch this from your database
  const wishlistItems = [
    {
      id: "1",
      name: "Wireless Noise-Cancelling Headphones",
      price: "$249.99",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop",
      color: "Black",
    },
    {
      id: "2",
      name: "Slim-Fit Cotton T-Shirt",
      price: "$24.99",
      image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=300&auto=format&fit=crop",
      color: "Navy Blue",
    },
    {
      id: "3",
      name: "Modern Coffee Table",
      price: "$149.50",
      image: "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?q=80&w=300&auto=format&fit=crop",
      color: "Walnut",
    }
  ];

  return (
    <div className="py-12">
      <Container>
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
          
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
                    {mockUser.fullName || 'User'}
                  </h2>
                  <p className="text-sm text-gray-500">{mockUser.emailAddress}</p>
                </div>

                <nav className="space-y-1">
                  <Link href="/profile" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-700 hover:text-gray-900">
                    <User size={16} className="mr-3 text-gray-500" />
                    Personal Info
                  </Link>
                  <Link href="/profile/orders" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-700 hover:text-gray-900">
                    <ShoppingBag size={16} className="mr-3 text-gray-500" />
                    Orders
                  </Link>
                  <Link href="/profile/wishlist" className="flex items-center px-3 py-2 text-sm rounded-md bg-gray-100 font-medium text-gray-900">
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
                  <h2 className="text-xl font-semibold">Saved Items</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Items you've saved for later
                  </p>
                </div>
                
                {wishlistItems.length > 0 ? (
                  <div className="divide-y">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-gray-100">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-medium text-gray-900 truncate">{item.name}</h3>
                            <p className="mt-1 text-sm text-gray-500">Color: {item.color}</p>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-2">
                            <p className="text-base font-medium text-gray-900">{item.price}</p>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex items-center"
                              >
                                <ShoppingCart className="h-4 w-4 mr-1" />
                                Add to Cart
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-gray-500"
                              >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <Heart className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      Save items you're interested in by clicking the heart icon on product pages.
                    </p>
                    <Link 
                      href="/shop"
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                    >
                      Explore Products
                    </Link>
                  </div>
                )}
              </div>
              
              <div className="mt-6 bg-amber-50 text-amber-700 p-4 rounded-lg text-center">
                <p className="text-sm">
                  Authentication is temporarily disabled. Wishlist management will be available in a future update.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
} 