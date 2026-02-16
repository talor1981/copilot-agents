import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getLinksByUserId } from "@/data/links";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch user's links
    const links = await getLinksByUserId(userId);

    // Return success with 200
    return NextResponse.json(links, { status: 200 });
  } catch (error) {
    console.error("Error fetching links:", error);
    return NextResponse.json(
      { error: "Failed to fetch links" },
      { status: 500 }
    );
  }
}
