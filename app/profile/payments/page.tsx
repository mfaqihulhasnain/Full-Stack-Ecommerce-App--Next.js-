'use client';

import { Container } from "@/components/ui/container";
import Link from "next/link";
import { User, ShoppingBag, Heart, CreditCard, Settings, LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentsPage() {
  // Mock user data for demonstration
  const mockUser = {
    fullName: "Demo User",
    emailAddress: "user@example.com",
    imageUrl: null
  };

  // Mock payment methods - in a real app, you would fetch this from a secure payment service
  const paymentMethods = [
    {
      id: "pm_1",
      type: "visa",
      last4: "4242",
      expMonth: 12,
      expYear: 2025,
      isDefault: true
    },
    {
      id: "pm_2",
      type: "mastercard",
      last4: "5555",
      expMonth: 8,
      expYear: 2026,
      isDefault: false
    }
  ];

  return (
    <div className="py-12">
      <Container>
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Payment Methods</h1>
          
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
                  <Link href="/profile/wishlist" className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-700 hover:text-gray-900">
                    <Heart size={16} className="mr-3 text-gray-500" />
                    Wishlist
                  </Link>
                  <Link href="/profile/payments" className="flex items-center px-3 py-2 text-sm rounded-md bg-gray-100 font-medium text-gray-900">
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
                <div className="p-6 border-b flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">Your Payment Methods</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Manage your saved payment methods
                    </p>
                  </div>
                  <Button className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </div>
                
                {paymentMethods.length > 0 ? (
                  <div className="divide-y">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-8 flex items-center justify-center bg-gray-100 rounded border">
                              {method.type === 'visa' && (
                                <svg className="h-5" viewBox="0 0 32 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M11.5959 1L9.96027 9H7.28722L8.92284 1H11.5959Z" fill="#00579F"/>
                                  <path d="M19.6322 1.17134C19.0717 0.956346 18.2126 0.728027 17.1741 0.728027C14.7786 0.728027 13.0511 1.9749 13.0379 3.81223C13.0115 5.17134 14.288 5.93799 15.2607 6.38614C16.2598 6.84696 16.5929 7.14229 16.5929 7.55447C16.5797 8.19564 15.7735 8.49096 15.031 8.49096C14.0056 8.49096 13.4583 8.32763 12.6125 7.95642L12.2398 7.78041L11.8276 10.0417C12.4936 10.3371 13.7436 10.5918 15.0442 10.6051C17.5981 10.6051 19.2868 9.37224 19.3132 7.40382C19.3264 6.30866 18.6366 5.46756 17.2218 4.80382C16.3628 4.36835 15.848 4.08569 15.848 3.65022C15.8612 3.25073 16.3232 2.85123 17.3091 2.85123C18.1285 2.83855 18.73 3.0368 19.1951 3.23315L19.4487 3.35807L19.8478 1.18401L19.6322 1.17134Z" fill="#00579F"/>
                                  <path d="M22.5624 6.14173C22.7649 5.61461 23.5052 3.61461 23.5052 3.61461C23.4919 3.64029 23.7123 3.03245 23.8355 2.66391L23.9983 3.51235C23.9983 3.51235 24.4503 5.68051 24.5471 6.14173C24.0393 6.14173 23.1672 6.14173 22.5624 6.14173ZM25.9884 1H23.8487C23.2439 1 22.7913 1.16332 22.5361 1.76582L19.5 9H22.0811C22.0811 9H22.4933 7.89217C22.6693 7.89217 24.8747 7.89217 25.105 7.89217C25.2414 8.34032 25.4571 9 25.4571 9H28L25.9884 1Z" fill="#00579F"/>
                                  <path d="M7.13653 1L4.3125 6.4636L4.10529 5.42939C3.75248 4.12366 2.53125 2.72771 2.53125 2.72771L4.96155 9H7.57337L11.125 1H7.13653Z" fill="#00579F"/>
                                </svg>
                              )}
                              {method.type === 'mastercard' && (
                                <svg className="h-6" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M11.1876 3.125H20.8124V16.875H11.1876V3.125Z" fill="#FF5F00"/>
                                  <path d="M11.719 10C11.719 7.0875 13.1565 4.51 15.3752 3.125C13.8127 1.8875 11.814 1.1375 9.6252 1.1375C4.9377 1.1375 1.1252 5.0875 1.1252 10C1.1252 14.9125 4.9377 18.8625 9.6252 18.8625C11.814 18.8625 13.8127 18.1125 15.3752 16.875C13.1565 15.49 11.719 12.9125 11.719 10Z" fill="#EB001B"/>
                                  <path d="M30.8752 10C30.8752 14.9125 27.0627 18.8625 22.3752 18.8625C20.1865 18.8625 18.1877 18.1125 16.6252 16.875C18.844 15.49 20.2815 12.9125 20.2815 10C20.2815 7.0875 18.844 4.51 16.6252 3.125C18.1877 1.8875 20.1865 1.1375 22.3752 1.1375C27.0627 1.1375 30.8752 5.0875 30.8752 10Z" fill="#F79E1B"/>
                                </svg>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center">
                                <p className="text-base font-medium text-gray-900 mr-2">
                                  {method.type.charAt(0).toUpperCase() + method.type.slice(1)} •••• {method.last4}
                                </p>
                                {method.isDefault && (
                                  <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mt-1">Expires {method.expMonth}/{method.expYear}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {!method.isDefault && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-xs"
                              >
                                Set as Default
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <CreditCard className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No payment methods</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      Add a payment method to make checkout faster.
                    </p>
                    <Button className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm border overflow-hidden mt-6">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Payment Security</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Your payment information is encrypted and stored securely. We use industry-standard security measures to protect your data.
                  </p>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Secure encryption
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
} 