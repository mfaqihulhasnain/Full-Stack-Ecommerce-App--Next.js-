import { headers } from "next/headers";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/user";

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no svix headers, return 400
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Error: Missing svix headers", {
      svix_id,
      svix_timestamp,
      svix_signature,
    });
    return new NextResponse("Missing svix headers", { status: 400 });
  }

  // Get the body
  let payload;
  try {
    payload = await req.json();
    console.log("Webhook payload received:", JSON.stringify(payload, null, 2));
  } catch (err: any) {
    console.error("Error parsing webhook payload:", err.message);
    return new NextResponse(`Error parsing webhook payload: ${err.message}`, {
      status: 400,
    });
  }

  // Create a new Svix instance with the webhook secret
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Error: CLERK_WEBHOOK_SECRET is not defined");
    return new NextResponse("CLERK_WEBHOOK_SECRET is not defined", {
      status: 500,
    });
  }

  // Create a new Svix instance and verify the payload
  let event: WebhookEvent;
  try {
    const wh = new Webhook(webhookSecret);
    event = wh.verify(JSON.stringify(payload), {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err: any) {
    console.error("Error verifying webhook signature:", err.message);
    return new NextResponse(`Error verifying webhook: ${err.message}`, {
      status: 400,
    });
  }

  const { id } = event.data;
  const eventType = event.type;

  console.log(`Webhook event type: ${eventType}`);

  // Handle the event based on its type
  if (eventType.startsWith("user.")) {
    try {
      // Connect to MongoDB
      await dbConnect();
      console.log("Connected to MongoDB for webhook processing");

      // Extract user data
      const userData = {
        clerkId: id,
        email: event.data.email_addresses?.[0]?.email_address,
        name: `${event.data.first_name || ""} ${event.data.last_name || ""}`.trim(),
      };

      // Validate user data
      if (!userData.clerkId || !userData.email) {
        console.error("Invalid user data:", userData);
        return new NextResponse("Invalid user data", { status: 400 });
      }

      // Process user events
      if (eventType === "user.created" || eventType === "user.updated") {
        console.log(`Processing ${eventType} for user ${userData.email}`);
        await User.findOneAndUpdate(
          { clerkId: id },
          userData,
          { upsert: true, new: true }
        );
        console.log(`User ${userData.email} successfully ${eventType === "user.created" ? "created" : "updated"}`);
      } else if (eventType === "user.deleted") {
        console.log(`Processing user deletion for Clerk ID ${id}`);
        await User.findOneAndDelete({ clerkId: id });
        console.log(`User with Clerk ID ${id} successfully deleted`);
      }

      return NextResponse.json({ success: true, eventType });
    } catch (error: any) {
      console.error(`Error processing ${eventType}:`, error.message);
      return new NextResponse(`Error processing webhook: ${error.message}`, {
        status: 500,
      });
    }
  }

  // Return a success response for other event types
  return NextResponse.json({ success: true, message: `Unhandled event type: ${eventType}` });
}

// Optional GET endpoint for testing
export async function GET() {
  try {
    await dbConnect();
    const users = await User.find().sort({ createdAt: -1 }).limit(10);
    return NextResponse.json({
      success: true,
      message: "Webhook endpoint active",
      users: users.map(user => ({
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      }))
    });
  } catch (error: any) {
    console.error("Error in webhook GET endpoint:", error.message);
    return NextResponse.json({
      success: false,
      message: `Error checking webhook status: ${error.message}`
    }, { status: 500 });
  }
} 