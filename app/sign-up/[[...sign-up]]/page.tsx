'use client';

import { Container } from "@/components/ui/container";
import Link from "next/link";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="py-16 md:py-24">
      <Container>
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Create an Account</h1>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <SignUp />
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/sign-in" className="text-primary hover:text-primary/90 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
} 