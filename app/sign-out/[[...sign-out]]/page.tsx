'use client';

import { Container } from "@/components/ui/container";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignOutPage() {
  return (
    <div className="py-16 md:py-24">
      <Container>
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Sign Out</h1>
          <div className="bg-white p-8 rounded-xl shadow-sm border">
            <p className="mb-6 text-gray-600">
              Are you sure you want to sign out of your account?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/">
                <Button variant="outline">
                  Cancel
                </Button>
              </Link>
              <SignOutButton>
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  Sign Out
                </Button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
} 