'use client';

import { Container } from "@/components/ui/container";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="py-16 md:py-24">
      <Container>
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Sign In</h1>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <SignIn />
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/sign-up" className="text-primary hover:text-primary/90 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
} 