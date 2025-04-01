import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';

export default async function TestAuthPage() {
  const authResult = auth();
  const { userId } = authResult;
  
  // Log authentication information
  console.log("Auth result on test page:", JSON.stringify(authResult));
  
  // Redirect to sign in if not authenticated
  if (!userId) {
    console.log("No user ID found, redirecting to /sign-in");
    redirect('/sign-in');
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Test Page</h1>
      <div className="p-4 bg-green-100 border border-green-300 rounded mb-4">
        <p className="text-green-800">
          ✅ Authentication successful! You are logged in with ID: {userId}
        </p>
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Navigation Tests</h2>
        <div className="space-y-2">
          <Link 
            href="/account"
            className="block p-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded"
          >
            Go to Account Page
          </Link>
          <Link 
            href="/account/orders"
            className="block p-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded"
          >
            Go to Orders Page
          </Link>
          <Link 
            href="/"
            className="block p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded"
          >
            Go to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
} 