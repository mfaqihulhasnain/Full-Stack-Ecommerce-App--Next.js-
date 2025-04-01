import { FC } from 'react';
import { UserProfile } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';

// Profile page with Clerk's UserProfile component
export default async function ProfilePage() {
  // Get the current user
  const user = await currentUser();
  
  // If not signed in, redirect to sign-in
  if (!user) {
    redirect('/sign-in');
  }
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <UserProfile 
          appearance={{
            elements: {
              rootBox: {
                boxShadow: 'none',
                width: '100%'
              },
              card: {
                border: 'none',
                boxShadow: 'none',
                width: '100%'
              },
              navbar: {
                borderBottom: '1px solid #e5e7eb',
                marginBottom: '2rem',
              },
              pageScrollBox: {
                padding: '1.5rem'
              }
            }
          }}
          path="/profile"
          routing="path"
        />
      </div>
    </div>
  );
} 