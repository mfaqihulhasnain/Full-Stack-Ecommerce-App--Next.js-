'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

// Define the address type
type Address = {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
};

// Define the user preferences type
type UserPreferences = {
  theme?: 'light' | 'dark' | 'system';
  currency?: string;
  language?: string;
  notificationsEnabled?: boolean;
  emailNotifications?: boolean;
  recentlyViewedProducts?: string[];
  wishlist?: string[];
  lastUpdated?: string;
};

// Define the user data type
type UserData = {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  addresses: Address[];
  preferences: UserPreferences;
};

// Define the context type
type UserContextType = {
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  refreshUserData: () => Promise<void>;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => Promise<boolean>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<string | null>;
  updateAddress: (addressId: string, address: Partial<Omit<Address, 'id'>>) => Promise<boolean>;
  removeAddress: (addressId: string) => Promise<boolean>;
};

// Create the context with default values
const UserContext = createContext<UserContextType>({
  userData: null,
  loading: false,
  error: null,
  refreshUserData: async () => {},
  updateUserPreferences: async () => false,
  addAddress: async () => null,
  updateAddress: async () => false,
  removeAddress: async () => false,
});

// Create a hook for using the user context
export const useUserData = () => useContext(UserContext);

// Create the provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State to track user data
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get authenticated user from Clerk
  const { user, isSignedIn } = useUser();
  
  // Function to fetch user data from API
  const fetchUserData = async () => {
    if (!isSignedIn) {
      setUserData(null);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch('/api/user');
      
      if (!response.ok) {
        // If user not found (404), create a new user
        if (response.status === 404 && user) {
          const createResponse = await fetch('/api/user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.primaryEmailAddress?.emailAddress,
              addresses: [],
              preferences: {
                theme: 'system',
                currency: 'USD',
                language: 'en',
                notificationsEnabled: true,
                emailNotifications: true,
                recentlyViewedProducts: [],
                wishlist: [],
              },
            }),
          });
          
          if (createResponse.ok) {
            // Fetch user data again after creating
            return fetchUserData();
          } else {
            throw new Error('Failed to create user profile');
          }
        } else {
          throw new Error('Failed to fetch user data');
        }
      }
      
      const data = await response.json();
      setUserData(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Refresh user data
  const refreshUserData = async () => {
    await fetchUserData();
  };
  
  // Update user preferences
  const updateUserPreferences = async (preferences: Partial<UserPreferences>): Promise<boolean> => {
    if (!isSignedIn) return false;
    
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }
      
      // Update local state
      setUserData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          preferences: {
            ...prev.preferences,
            ...preferences,
          },
        };
      });
      
      return true;
    } catch (err) {
      console.error('Error updating preferences:', err);
      return false;
    }
  };
  
  // Add a new address
  const addAddress = async (address: Omit<Address, 'id'>): Promise<string | null> => {
    if (!isSignedIn) return null;
    
    try {
      const response = await fetch('/api/user/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(address),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add address');
      }
      
      const data = await response.json();
      
      // Refresh user data to get updated addresses
      await refreshUserData();
      
      return data.addressId;
    } catch (err) {
      console.error('Error adding address:', err);
      return null;
    }
  };
  
  // Update an existing address
  const updateAddress = async (addressId: string, address: Partial<Omit<Address, 'id'>>): Promise<boolean> => {
    if (!isSignedIn) return false;
    
    try {
      const response = await fetch('/api/user/address', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          addressId,
          ...address,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update address');
      }
      
      // Refresh user data to get updated addresses
      await refreshUserData();
      
      return true;
    } catch (err) {
      console.error('Error updating address:', err);
      return false;
    }
  };
  
  // Remove an address
  const removeAddress = async (addressId: string): Promise<boolean> => {
    if (!isSignedIn) return false;
    
    try {
      const response = await fetch(`/api/user/address?id=${addressId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove address');
      }
      
      // Refresh user data to get updated addresses
      await refreshUserData();
      
      return true;
    } catch (err) {
      console.error('Error removing address:', err);
      return false;
    }
  };
  
  // Fetch user data when authentication status changes
  useEffect(() => {
    if (isSignedIn !== undefined) {
      fetchUserData();
    }
  }, [isSignedIn]);
  
  // Provide the context to children
  return (
    <UserContext.Provider
      value={{
        userData,
        loading,
        error,
        refreshUserData,
        updateUserPreferences,
        addAddress,
        updateAddress,
        removeAddress,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}; 