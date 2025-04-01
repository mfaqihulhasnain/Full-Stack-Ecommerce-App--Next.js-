import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import User from "@/models/user";

export async function GET() {
  try {
    console.log("Profile API: Request received");
    
    // Get the current user's ID from Clerk
    const { userId } = auth();
    
    console.log("Profile API: Auth check completed", { userId: userId || "not authenticated" });
    
    if (!userId) {
      console.log("Profile API: Unauthorized - no userId");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("Profile API: Connecting to database");
    try {
      // Connect to the database
      await dbConnect();
      console.log("Profile API: Successfully connected to database");
    } catch (dbError: any) {
      console.error("Profile API: Database connection error:", dbError);
      return NextResponse.json(
        { success: false, message: "Database connection failed", error: dbError.message },
        { status: 500 }
      );
    }
    
    console.log("Profile API: Looking for user with clerkId:", userId);
    
    // Find the user in our database using their Clerk ID
    try {
      const user = await User.findOne({ clerkId: userId });
      
      console.log("Profile API: User lookup result:", user ? "User found" : "User not found");
      
      if (!user) {
        return NextResponse.json(
          { success: false, message: "User not found in database. Please make sure the webhook is properly set up." },
          { status: 404 }
        );
      }
      
      // Return the user data
      console.log("Profile API: Returning user data successfully");
      return NextResponse.json({
        success: true,
        user: {
          id: user._id,
          clerkId: user.clerkId,
          email: user.email,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    } catch (userError: any) {
      console.error("Profile API: Error finding user:", userError);
      return NextResponse.json(
        { success: false, message: "Error finding user", error: userError.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Profile API: Unexpected error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch profile data", error: error.message },
      { status: 500 }
    );
  }
} 