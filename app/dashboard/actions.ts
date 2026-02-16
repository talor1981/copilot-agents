"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createLink, getLinkByShortCode } from "@/data/links";

// Validation schema
const createLinkSchema = z.object({
  shortCode: z
    .string()
    .min(3, "Short code must be at least 3 characters")
    .max(10, "Short code must be at most 10 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Short code can only contain letters, numbers, hyphens, and underscores"),
  originalUrl: z.string().url("Must be a valid URL"),
});

type CreateLinkInput = z.infer<typeof createLinkSchema>;

export async function createLinkAction(input: CreateLinkInput) {
  // 1. Check authentication
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  // 2. Validate input with Zod
  const validation = createLinkSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message,
    };
  }

  try {
    // 3. Check if short code already exists
    const existingLink = await getLinkByShortCode(validation.data.shortCode);
    if (existingLink) {
      return {
        success: false,
        error: "Short code already exists. Please choose a different one.",
      };
    }

    // 4. Call database helper function
    const link = await createLink({
      ...validation.data,
      userId,
    });

    // 5. Revalidate cache
    revalidatePath("/dashboard");

    // 6. Return success response
    return { success: true, data: link };
  } catch (error) {
    // IMPORTANT: Never throw errors, always return error object
    console.error("Error creating link:", error);
    return {
      success: false,
      error: "Failed to create link. Please try again.",
    };
  }
}
