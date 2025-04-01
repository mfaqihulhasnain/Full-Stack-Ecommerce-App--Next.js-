'use client';

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import Link from "next/link";
import { User, ShoppingBag, Heart, CreditCard, Settings, LogOut, BellRing, Mail, Lock, Globe, Check, Trash2, ShieldAlert, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser, SignOutButton, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  
  // State for toggles
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Fallback while Clerk data is loading
  if (!isLoaded) {
    return (
      <div className="py-12">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="animate-pulse h-8 w-64 bg-gray-200 rounded mb-6"></div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-64 shrink-0">
                <div className="bg-white rounded-xl shadow-sm border p-6 h-80"></div>
              </div>
              <div className="flex-1 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border p-6 h-48"></div>
                <div className="bg-white rounded-xl shadow-sm border p-6 h-48"></div>
                <div className="bg-white rounded-xl shadow-sm border p-6 h-48"></div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }
  
  // Handle toggle changes
  const updatePreference = (preference, value) => {
    // In a real app, you would send this to your backend
    console.log(`Updating ${preference} to ${value}`);
    
    // For demo purposes, just update local state
    switch(preference) {
      case 'emailNotifications':
        setEmailNotifications(value);
        break;
      case 'orderUpdates':
        setOrderUpdates(value);
        break;
      case 'marketingEmails':
        setMarketingEmails(value);
        break;
      case 'darkMode':
        setDarkMode(value);
        break;
    }
  };
  
  // Function to handle account deletion
  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    
    try {
      setLoading(true);
      // In a real app, you would delete the user's account from your backend first
      
      // Then delete the user from Clerk
      // This is commented out because it would actually delete the user!
      // await user.delete();
      
      // Sign out the user
      await signOut(() => router.push('/'));
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to create a toggle switch
  const ToggleSwitch = ({ enabled, onChange }) => (
    <button 
      className={`h-6 w-11 rounded-full relative transition-colors ${enabled ? 'bg-primary' : 'bg-gray-300'}`}
      onClick={() => onChange(!enabled)}
    >
      <div 
        className={`absolute h-5 w-5 rounded-full bg-white transition-transform transform ${enabled ? 'translate-x-5' : 'translate-x-1'} top-0.5`}
      />
    </button>
  );

  return (
    <div className="py-12 bg-gray-50">
      <Container>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Account Settings</h1>
            <SignOutButton>
              <Button variant="outline" className="flex items-center gap-2">
                <LogOut size={16} />
                Sign Out
              </Button>
            </SignOutButton>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-72 shrink-0">
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <div className="flex flex-col items-center text-center px-6 pb-6">
                  <div className="relative w-24 h-24 rounded-full bg-white shadow-md border-4 border-white -mt-12 mb-3 overflow-hidden">
                    {user?.imageUrl ? (
                      <img 
                        src={user.imageUrl} 
                        alt={user.fullName || "Profile"} 
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-primary/10 text-primary">
                        <User size={34} />
                      </div>
                    )}
                  </div>
                  <h2 className="font-semibold text-xl">
                    {user?.fullName || user?.username || 'User'}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">{user?.primaryEmailAddress?.emailAddress}</p>
                  
                  <div className="border-t w-full pt-4 mt-2">
                    <nav className="space-y-1.5">
                      <Link href="/profile" className="flex items-center px-4 py-2.5 text-sm rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900">
                        <User size={18} className="mr-3 text-gray-500" />
                        Personal Info
                      </Link>
                      <Link href="/profile/orders" className="flex items-center px-4 py-2.5 text-sm rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900">
                        <ShoppingBag size={18} className="mr-3 text-gray-500" />
                        Orders
                      </Link>
                      <Link href="/profile/wishlist" className="flex items-center px-4 py-2.5 text-sm rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900">
                        <Heart size={18} className="mr-3 text-gray-500" />
                        Wishlist
                      </Link>
                      <Link href="/profile/payments" className="flex items-center px-4 py-2.5 text-sm rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900">
                        <CreditCard size={18} className="mr-3 text-gray-500" />
                        Payment Methods
                      </Link>
                      <Link href="/profile/settings" className="flex items-center px-4 py-2.5 text-sm rounded-lg bg-primary/10 font-medium text-primary">
                        <Settings size={18} className="mr-3" />
                        Account Settings
                      </Link>
                    </nav>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* Notifications Section */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 mr-3">
                    <BellRing className="h-4 w-4 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Notifications</h2>
                </div>
                
                <div className="space-y-5">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive emails about your account activity</p>
                    </div>
                    <ToggleSwitch 
                      enabled={emailNotifications} 
                      onChange={(value) => updatePreference('emailNotifications', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium text-gray-900">Order Updates</p>
                      <p className="text-sm text-gray-500">Receive notifications about your orders</p>
                    </div>
                    <ToggleSwitch 
                      enabled={orderUpdates}
                      onChange={(value) => updatePreference('orderUpdates', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-gray-900">Marketing Emails</p>
                      <p className="text-sm text-gray-500">Receive emails about new products and offers</p>
                    </div>
                    <ToggleSwitch 
                      enabled={marketingEmails}
                      onChange={(value) => updatePreference('marketingEmails', value)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Security Section */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 mr-3">
                    <Lock className="h-4 w-4 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Security</h2>
                </div>
                
                <div className="space-y-5">
                  <a 
                    href={user?.externalAccounts.find(acc => acc.provider === 'oauth_google')?.profileUrl || "https://dashboard.clerk.com/user"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-between items-center w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-100 rounded-full mr-3">
                        <Lock className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="font-medium">Manage Password</span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Clerk Dashboard</span>
                  </a>
                  
                  <div className="flex items-center justify-between py-4 px-4 border rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-full mr-3">
                        <Shield className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <a 
                      href="https://dashboard.clerk.com/user"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      Manage
                    </a>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-purple-100 rounded-full mr-3">
                        <Mail className="h-4 w-4 text-purple-600" />
                      </div>
                      <h3 className="font-medium">Email Verification</h3>
                    </div>
                    <div className="flex items-center pl-10 text-sm text-gray-600">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{user?.primaryEmailAddress?.emailAddress}</span>
                        {user?.primaryEmailAddress?.verification.status === 'verified' ? (
                          <div className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs flex items-center">
                            <Check size={12} className="mr-1" />
                            Verified
                          </div>
                        ) : (
                          <div className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs">
                            Not Verified
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Preferences Section */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 mr-3">
                    <Globe className="h-4 w-4 text-amber-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Preferences</h2>
                </div>
                
                <div className="space-y-5">
                  <div className="flex items-center justify-between py-3 border-b">
                    <div>
                      <p className="font-medium text-gray-900">Language</p>
                      <p className="text-sm text-gray-500">Select your preferred language</p>
                    </div>
                    <select 
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-gray-900">Dark Mode</p>
                      <p className="text-sm text-gray-500">Use dark theme</p>
                    </div>
                    <ToggleSwitch 
                      enabled={darkMode}
                      onChange={(value) => updatePreference('darkMode', value)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Danger Zone Section */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 mr-3">
                    <ShieldAlert className="h-4 w-4 text-red-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
                </div>
                
                {showDeleteConfirm ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="mb-4">
                      <h3 className="font-medium text-red-700 mb-2">Are you sure you want to delete your account?</h3>
                      <p className="text-red-700 text-sm">
                        This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowDeleteConfirm(false)}
                        className="border-gray-300 bg-white"
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={handleDeleteAccount}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {loading ? 'Deleting...' : 'Confirm Delete'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border border-red-100 rounded-lg p-4 bg-white">
                    <p className="text-gray-600 mb-4 text-sm">
                      Delete your account and all of your data. This action cannot be undone.
                    </p>
                    <Button 
                      variant="outline" 
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={handleDeleteAccount}
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete Account
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
} 