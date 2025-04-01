'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useUserData } from '@/app/context/UserContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from 'next/link';
import { 
  User as UserIcon, 
  MapPin, 
  Settings, 
  Moon, 
  CreditCard, 
  Globe, 
  Bell, 
  Mail, 
  ShoppingBag,
  Plus,
  Edit,
  Trash,
  CheckCircle2,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

// Theme icon
const ThemeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

// Currency icon
const CurrencyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Language icon
const LanguageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
  </svg>
);

// Notification icon
const NotificationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

// Email icon
const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

// Orders icon
const OrderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const AccountPage = () => {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const { 
    userData, 
    loading: userDataLoading, 
    error, 
    updateUserPreferences, 
    refreshUserData,
    addAddress 
  } = useUserData();
  
  const [currentTab, setCurrentTab] = useState<string>("profile");
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [showAddressForm, setShowAddressForm] = useState<boolean>(false);
  const [defaultAddress, setDefaultAddress] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: string;
  }>({
    show: false,
    message: "",
    type: "success",
  });

  // Add missing state variables for form fields
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [theme, setTheme] = useState<string>("system");
  const [currency, setCurrency] = useState<string>("USD");
  const [language, setLanguage] = useState<string>("en");
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(false);
  
  // Address form fields
  const [street, setStreet] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [isDefault, setIsDefault] = useState<boolean>(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Add additional profile fields
  const [phone, setPhone] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  
  const showNotification = useCallback((message: string, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  }, []);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isSignedIn) return;
      
      setLoading(true);
      try {
        const response = await fetch("/api/user");
        if (response.ok) {
          const data = await response.json();
          const { firstName, lastName, email, phone, bio, preferences = {}, addresses = [] } = data;
          
          setFirstName(firstName || "");
          setLastName(lastName || "");
          setEmail(email || "");
          setPhone(phone || "");
          setBio(bio || "");
          setTheme(preferences.theme || "system");
          setCurrency(preferences.currency || "USD");
          setLanguage(preferences.language || "en");
          setNotificationsEnabled(preferences.notificationsEnabled || false);
          setEmailNotifications(preferences.emailNotifications || false);
          setAddresses(addresses);
          
          // Find default address
          const defaultAddr = addresses.find((addr: any) => addr.isDefault);
          setDefaultAddress(defaultAddr ? defaultAddr.id : null);
        }
      } catch (error) {
        console.error("Error fetching user data", error);
        showNotification("Failed to load your profile", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isSignedIn, showNotification]);

  const saveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const addressData = {
        id: editingAddressId,
        street,
        city,
        state,
        zipCode,
        country,
        isDefault
      };

      const method = editingAddressId ? 'PUT' : 'POST';
      const url = editingAddressId 
        ? `/api/user/address/${editingAddressId}` 
        : '/api/user/address';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });

      if (response.ok) {
        // Refresh the addresses
        const updatedResponse = await fetch('/api/user');
        if (updatedResponse.ok) {
          const data = await updatedResponse.json();
          setAddresses(data.addresses || []);
        }

        // Reset form and hide it
        resetAddressForm();
        setShowAddressForm(false);
        
        showNotification(
          editingAddressId 
            ? 'Address updated successfully!' 
            : 'Address added successfully!'
        );
      } else {
        const errorData = await response.json();
        showNotification(
          errorData.error || `Failed to ${editingAddressId ? 'update' : 'add'} address. Please try again.`, 
          'error'
        );
      }
    } catch (error) {
      console.error('Error saving address:', error);
      showNotification('An error occurred while saving the address.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      const preferencesData = {
        theme,
        currency,
        language,
        notificationsEnabled,
        emailNotifications
      };

      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferencesData),
      });

      if (response.ok) {
        showNotification('Preferences saved successfully!');
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || 'Failed to save preferences. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      showNotification('An error occurred while saving preferences.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const profileData = {
        firstName,
        lastName,
        email,
        phone,
        bio
      };
      
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      if (response.ok) {
        showNotification('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || 'Failed to update profile. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('An error occurred while updating your profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const resetAddressForm = () => {
    setStreet("");
    setCity("");
    setState("");
    setZipCode("");
    setCountry("");
    setIsDefault(false);
    setEditingAddressId(null);
  };

  const editAddress = (addressId: string) => {
    const address = addresses.find((addr) => addr.id === addressId);
    if (address) {
      setStreet(address.street || "");
      setCity(address.city || "");
      setState(address.state || "");
      setZipCode(address.zipCode || "");
      setCountry(address.country || "");
      setIsDefault(address.isDefault || false);
      setEditingAddressId(addressId);
      setShowAddressForm(true);
    }
  };

  const deleteAddress = async (addressId: string) => {
    try {
      const response = await fetch(`/api/user/address/${addressId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Remove the deleted address from the list
        setAddresses(addresses.filter((addr) => addr.id !== addressId));
        showNotification('Address deleted successfully!');
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || 'Failed to delete address. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      showNotification('An error occurred while deleting the address.', 'error');
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
        <Card className="w-full max-w-md shadow-xl border-0 overflow-hidden animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-50" />
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <CardHeader className="pb-6 relative">
            <div className="flex justify-center pb-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                <UserIcon size={36} />
              </div>
            </div>
            <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
              My Account
            </CardTitle>
            <CardDescription className="text-center text-gray-600 max-w-xs mx-auto mt-2">
              Sign in to view your profile, manage orders, and personalize your shopping experience.
            </CardDescription>
          </CardHeader>
          <CardFooter className="pb-8 pt-2 flex flex-col gap-4 relative">
            <Button size="lg" asChild className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-md hover:shadow-lg transition-all">
              <a href="/sign-in">Sign In</a>
            </Button>
            <div className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <a href="/sign-up" className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium">
                Create an account
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md w-full border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-indigo-100 animate-pulse"></div>
              <div className="h-16 w-16 border-t-4 border-indigo-600 border-solid rounded-full animate-spin absolute inset-0"></div>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2 animate-pulse">Loading your profile</h3>
          <p className="text-gray-500 max-w-xs mx-auto">
            We're getting your information ready. This will only take a moment...
          </p>
          <div className="flex gap-2 justify-center mt-6">
            <span className="h-2 w-2 bg-indigo-600 rounded-full animate-bounce"></span>
            <span className="h-2 w-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            <span className="h-2 w-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed top-20 right-4 z-50 max-w-md transition-all transform animate-slide-left ${
          notification.type === 'error' 
            ? 'bg-red-50 text-red-800 border-l-4 border-red-500'
            : 'bg-green-50 text-green-800 border-l-4 border-green-500'
        } shadow-lg rounded-lg p-4`}>
          <div className="flex items-center">
            {notification.type === 'error' ? (
              <AlertTriangle className="h-5 w-5 mr-3 text-red-500" />
            ) : (
              <CheckCircle2 className="h-5 w-5 mr-3 text-green-500" />
            )}
            <p className="font-medium">{notification.message}</p>
          </div>
        </div>
      )}
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-12 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="mr-6">
                <Avatar className="h-20 w-20 border-4 border-white/20 shadow-xl">
                  <AvatarImage src={user?.imageUrl || ''} alt={user?.firstName || 'User'} />
                  <AvatarFallback className="bg-white/10 text-white">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Welcome back, {user?.firstName || 'User'}!
                </h1>
                <p className="text-indigo-100 mt-1">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/account/orders">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  My Orders
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => setCurrentTab("preferences")}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Dashboard</h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar/Tabs for Desktop */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
              <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
                <TabsList className="flex lg:flex-col w-full p-0 bg-transparent gap-0 rounded-none">
                  <TabsTrigger 
                    value="profile"
                    onClick={() => setCurrentTab("profile")}
                    className={`flex w-full justify-start gap-3 rounded-none border-b lg:border-b border-gray-100 py-4 px-4 data-[state=active]:bg-gray-50 data-[state=active]:shadow-none ${currentTab === 'profile' ? 'border-l-4 border-l-indigo-600 bg-gradient-to-r from-indigo-50 to-transparent font-bold' : 'hover:bg-gray-50'}`}
                  >
                    <UserIcon className="w-5 h-5 flex-shrink-0 text-indigo-600" />
                    <span className="font-medium whitespace-nowrap">Profile</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="addresses"
                    onClick={() => setCurrentTab("addresses")}
                    className={`flex w-full justify-start gap-3 rounded-none border-b lg:border-b border-gray-100 py-4 px-4 data-[state=active]:bg-gray-50 data-[state=active]:shadow-none ${currentTab === 'addresses' ? 'border-l-4 border-l-indigo-600 bg-gradient-to-r from-indigo-50 to-transparent' : ''}`}
                  >
                    <MapPin className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium whitespace-nowrap">Addresses</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="preferences"
                    onClick={() => setCurrentTab("preferences")}
                    className={`flex w-full justify-start gap-3 rounded-none border-b lg:border-b border-gray-100 py-4 px-4 data-[state=active]:bg-gray-50 data-[state=active]:shadow-none ${currentTab === 'preferences' ? 'border-l-4 border-l-indigo-600 bg-gradient-to-r from-indigo-50 to-transparent' : ''}`}
                  >
                    <Settings className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium whitespace-nowrap">Preferences</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="pt-4 border-t border-gray-200 mt-2"></div>
              
              <Link 
                href="/account/orders"
                className="flex w-full items-center gap-3 py-3 px-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <ShoppingBag className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium whitespace-nowrap">Orders</span>
                <ChevronRight className="w-4 h-4 ml-auto flex-shrink-0" />
              </Link>
              <button 
                onClick={() => signOut()}
                className="flex w-full items-center gap-3 py-3 px-4 justify-start text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span className="font-medium whitespace-nowrap">Sign Out</span>
              </button>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full"
              defaultValue={currentTab}>
              <TabsContent value="profile" className="mt-0">
                <Card className="shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
                  <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                  <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <UserIcon className="w-5 h-5 text-indigo-600" />
                      <span>Personal Information</span>
                    </CardTitle>
                    <CardDescription>
                      Update your personal details and contact information
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-6 px-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-gray-700 font-medium">
                            First Name
                          </Label>
                          <Input 
                            id="firstName" 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg"
                            placeholder="Enter your first name"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-gray-700 font-medium">
                            Last Name
                          </Label>
                          <Input 
                            id="lastName" 
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg"
                            placeholder="Enter your last name"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">
                          Email Address
                        </Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-700 font-medium">
                          Phone Number <span className="text-gray-500 font-normal">(Optional)</span>
                        </Label>
                        <Input 
                          id="phone" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-gray-700 font-medium">
                          Bio <span className="text-gray-500 font-normal">(Optional)</span>
                        </Label>
                        <textarea
                          id="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows={4}
                          placeholder="Tell us a bit about yourself..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">This information may be displayed on your public profile</p>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-end py-4 px-6 border-t border-gray-100 bg-gray-50">
                    <Button 
                      type="button"
                      onClick={saveProfile}
                      disabled={saving}
                      className="bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 text-white px-6"
                    >
                      {saving ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </div>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Addresses Tab */}
              <TabsContent value="addresses" className="mt-0">
                <Card className="shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
                  <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                  <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <MapPin className="w-5 h-5 text-indigo-600" />
                          <span>Shipping Addresses</span>
                        </CardTitle>
                        <CardDescription>
                          Manage your shipping and billing addresses
                        </CardDescription>
                      </div>
                      
                      {!showAddressForm && userData?.addresses && userData.addresses.length > 0 && (
                        <Button 
                          onClick={() => setShowAddressForm(true)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white"
                          size="sm"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Address
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    {userData?.addresses && userData.addresses.length > 0 ? (
                      <>
                        {!showAddressForm && (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {userData.addresses.map((address) => (
                              <div 
                                key={address.id} 
                                className={`relative group rounded-xl overflow-hidden transition-all duration-200 ${
                                  address.isDefault 
                                    ? 'border-2 border-indigo-500 bg-indigo-50' 
                                    : 'border border-gray-200 bg-white hover:border-indigo-200 hover:shadow-md'
                                }`}
                              >
                                {address.isDefault && (
                                  <Badge className="absolute top-3 right-3 bg-indigo-500 hover:bg-indigo-600">
                                    Default
                                  </Badge>
                                )}
                                
                                <div className="p-5">
                                  <div className="mb-4">
                                    <h3 className="font-semibold text-gray-900 mb-1">
                                      {address.street}
                                    </h3>
                                    <p className="text-gray-600">
                                      {address.city}, {address.state} {address.zipCode}
                                    </p>
                                    <p className="text-gray-600 uppercase text-sm">
                                      {address.country}
                                    </p>
                                  </div>
                                  
                                  <div className="flex gap-2 mt-4">
                                    <Button 
                                      onClick={() => editAddress(address.id)} 
                                      variant="outline" 
                                      size="sm"
                                      className="text-gray-700 border-gray-300 hover:bg-gray-50"
                                    >
                                      <Edit className="w-4 h-4 mr-1" />
                                      Edit
                                    </Button>
                                    <Button 
                                      onClick={() => deleteAddress(address.id)} 
                                      variant="outline" 
                                      size="sm"
                                      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                    >
                                      <Trash className="w-4 h-4 mr-1" />
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {!showAddressForm && (
                          <div className="text-center py-12 px-4">
                            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                              <MapPin className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses yet</h3>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                              Add your first shipping address to speed up your checkout process.
                            </p>
                            <Button 
                              onClick={() => setShowAddressForm(true)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Your First Address
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                    
                    {/* Address Form */}
                    {showAddressForm && (
                      <div className="bg-white rounded-lg border border-indigo-100 overflow-hidden animate-fade-in shadow-sm">
                        <div className="bg-indigo-50 border-b border-indigo-100 px-6 py-4">
                          <h3 className="text-lg font-medium text-indigo-900">
                            {editingAddressId ? "Edit Address" : "Add New Address"}
                          </h3>
                        </div>
                        
                        <form onSubmit={saveAddress} className="p-6">
                          <div className="space-y-5">
                            <div className="space-y-2">
                              <Label htmlFor="street" className="text-gray-700 font-medium">Street Address</Label>
                              <Input 
                                id="street" 
                                name="street"
                                value={street}
                                onChange={(e) => setStreet(e.target.value)}
                                required
                                className="border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg"
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                              <div className="space-y-2">
                                <Label htmlFor="city" className="text-gray-700 font-medium">City</Label>
                                <Input 
                                  id="city" 
                                  name="city"
                                  value={city}
                                  onChange={(e) => setCity(e.target.value)}
                                  required
                                  className="border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="state" className="text-gray-700 font-medium">State/Province</Label>
                                <Input 
                                  id="state" 
                                  name="state"
                                  value={state}
                                  onChange={(e) => setState(e.target.value)}
                                  required
                                  className="border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg"
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                              <div className="space-y-2">
                                <Label htmlFor="zipCode" className="text-gray-700 font-medium">Zip/Postal Code</Label>
                                <Input 
                                  id="zipCode" 
                                  name="zipCode"
                                  value={zipCode}
                                  onChange={(e) => setZipCode(e.target.value)}
                                  required
                                  className="border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="country" className="text-gray-700 font-medium">Country</Label>
                                <Input 
                                  id="country" 
                                  name="country"
                                  value={country}
                                  onChange={(e) => setCountry(e.target.value)}
                                  required
                                  className="border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg"
                                />
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 mt-4">
                              <Switch 
                                id="isDefault" 
                                name="isDefault"
                                checked={isDefault}
                                onCheckedChange={(checked) => setIsDefault(checked)}
                                className="data-[state=checked]:bg-indigo-600"
                              />
                              <Label htmlFor="isDefault" className="text-gray-700">Set as default address</Label>
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => {
                                resetAddressForm();
                                setShowAddressForm(false);
                              }}
                              className="border-gray-300"
                            >
                              Cancel
                            </Button>
                            <Button 
                              type="submit"
                              disabled={saving}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                              {saving ? (
                                <div className="flex items-center">
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Saving...
                                </div>
                              ) : (
                                "Save Address"
                              )}
                            </Button>
                          </div>
                        </form>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Preferences Tab */}
              <TabsContent value="preferences" className="mt-0">
                <Card className="shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
                  <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                  <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Settings className="w-5 h-5 text-indigo-600" />
                      <span>Preferences</span>
                    </CardTitle>
                    <CardDescription>
                      Customize your shopping experience and notification settings
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Display Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-indigo-200 hover:shadow-sm transition-all">
                            <div className="flex items-center mb-4">
                              <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                                <Moon className="w-5 h-5 text-indigo-600" />
                              </div>
                              <Label htmlFor="theme" className="text-gray-800 font-medium">
                                Theme
                              </Label>
                            </div>
                            <Select 
                              value={theme} 
                              onValueChange={(value) => setTheme(value)}
                            >
                              <SelectTrigger className="border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white rounded-lg">
                                <SelectValue placeholder="Select theme" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System Default</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-indigo-200 hover:shadow-sm transition-all">
                            <div className="flex items-center mb-4">
                              <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                                <CreditCard className="w-5 h-5 text-indigo-600" />
                              </div>
                              <Label htmlFor="currency" className="text-gray-800 font-medium">
                                Currency
                              </Label>
                            </div>
                            <Select 
                              value={currency} 
                              onValueChange={(value) => setCurrency(value)}
                            >
                              <SelectTrigger className="border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white rounded-lg">
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="USD">USD (US Dollar)</SelectItem>
                                <SelectItem value="EUR">EUR (Euro)</SelectItem>
                                <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                                <SelectItem value="JPY">JPY (Japanese Yen)</SelectItem>
                                <SelectItem value="PKR">PKR (Pakistani Rupee)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-indigo-200 hover:shadow-sm transition-all">
                            <div className="flex items-center mb-4">
                              <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                                <Globe className="w-5 h-5 text-indigo-600" />
                              </div>
                              <Label htmlFor="language" className="text-gray-800 font-medium">
                                Language
                              </Label>
                            </div>
                            <Select 
                              value={language} 
                              onValueChange={(value) => setLanguage(value)}
                            >
                              <SelectTrigger className="border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white rounded-lg">
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="es">Spanish</SelectItem>
                                <SelectItem value="fr">French</SelectItem>
                                <SelectItem value="de">German</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-indigo-200 hover:shadow-sm transition-all">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                                  <Bell className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                  <Label htmlFor="notifications" className="text-gray-800 font-medium block">
                                    Push Notifications
                                  </Label>
                                  <p className="text-sm text-gray-500 mt-1">
                                    Receive updates about orders and promotions
                                  </p>
                                </div>
                              </div>
                              <Switch 
                                id="notifications"
                                checked={notificationsEnabled}
                                onCheckedChange={(checked) => setNotificationsEnabled(checked)}
                                className="data-[state=checked]:bg-indigo-600"
                              />
                            </div>
                          </div>
                          
                          <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-indigo-200 hover:shadow-sm transition-all">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                                  <Mail className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                  <Label htmlFor="emailNotifications" className="text-gray-800 font-medium block">
                                    Email Notifications
                                  </Label>
                                  <p className="text-sm text-gray-500 mt-1">
                                    Receive email updates about orders and promotions
                                  </p>
                                </div>
                              </div>
                              <Switch 
                                id="emailNotifications"
                                checked={emailNotifications}
                                onCheckedChange={(checked) => setEmailNotifications(checked)}
                                className="data-[state=checked]:bg-indigo-600"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-end py-4 px-6 border-t border-gray-100 bg-gray-50">
                    <Button 
                      onClick={savePreferences}
                      disabled={saving}
                      className="bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 text-white px-6"
                    >
                      {saving ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </div>
                      ) : (
                        "Save Preferences"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage; 