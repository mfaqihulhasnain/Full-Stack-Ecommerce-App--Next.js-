import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/user";

interface Params {
  params: {
    id: string;
  };
}

export async function DELETE(req: Request, { params }: Params) {
  const { id } = params;

  try {
    console.log(`Attempting to delete user with ID: ${id}`);
    await dbConnect();

    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      console.log(`User not found with ID: ${id}`);
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    console.log(`User deleted successfully: ${deletedUser.email}`);
    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
      user: {
        id: deletedUser._id,
        email: deletedUser.email,
        name: deletedUser.name,
      },
    });
  } catch (error: any) {
    console.error(`Error deleting user with ID ${id}:`, error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete user",
        error: error.message,
      },
      { status: 500 }
    );
  }
} 