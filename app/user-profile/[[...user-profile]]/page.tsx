'use client';

import { Container } from "@/components/ui/container";

export default function UserProfilePage() {
  return (
    <div className="py-12">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="text-center py-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <h2 className="text-xl font-semibold mb-2">User Profile Temporarily Unavailable</h2>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                User authentication has been temporarily disabled. 
                Profile management will be available in a future update.
              </p>
              <a
                href="/"
                className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Return to Home
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
} 