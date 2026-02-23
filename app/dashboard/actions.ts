"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createLink, getLinkByShortCode, deleteLink, updateLink } from "@/data/links";
import { checkRateLimit, createLinkLimiter, deleteLinkLimiter, updateLinkLimiter } from "@/lib/rate-limit";

// Validation schema for creating links
const createLinkSchema = z.object({
  shortCode: z
    .string()
    .trim()
    .min(3, "Short code must be at least 3 characters")
    .max(10, "Short code must be at most 10 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Short code can only contain letters, numbers, hyphens, and underscores"),
  originalUrl: z
    .string()
    .trim()
    .min(1, "URL cannot be empty")
    .max(2048, "URL must be less than 2048 characters")
    .url("Must be a valid URL")
    .refine(
      (url) => url.startsWith("http://") || url.startsWith("https://"),
      "URL must start with http:// or https://"
    ),
});

type CreateLinkInput = z.infer<typeof createLinkSchema>;

export async function createLinkAction(input: CreateLinkInput) {
  // 1. Check authentication
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  // 2. Check rate limit
  const rateLimitError = checkRateLimit(createLinkLimiter, userId);
  if (rateLimitError) {
    return rateLimitError;
  }

  // 3. Validate input with Zod
  const validation = createLinkSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message,
    };
  }

  try {
    // 4. Check if short code already exists
    const existingLink = await getLinkByShortCode(validation.data.shortCode);
    if (existingLink) {
      return {
        success: false,
        error: "Short code already exists. Please choose a different one.",
      };
    }

    // 5. Call database helper function
    const link = await createLink({
      ...validation.data,
      userId,
    });

    // 6. Revalidate cache
    revalidatePath("/dashboard");

    // 7. Return success response
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

// Validation schema for deleting links
const deleteLinkSchema = z.object({
  linkId: z
    .string()
    .trim()
    .uuid("Invalid link ID format"),
});

type DeleteLinkInput = z.infer<typeof deleteLinkSchema>;

export async function deleteLinkAction(input: DeleteLinkInput) {
  // 1. Check authentication
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  // 2. Check rate limit
  const rateLimitError = checkRateLimit(deleteLinkLimiter, userId);
  if (rateLimitError) {
    return rateLimitError;
  }

  // 3. Validate input with Zod
  const validation = deleteLinkSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message,
    };
  }

  try {
    // 4. Call database helper function
    await deleteLink(validation.data.linkId, userId);

    // 5. Revalidate cache
    revalidatePath("/dashboard");

    // 6. Return success response
    return { success: true };
  } catch (error) {
    console.error("Error deleting link:", error);
    return {
      success: false,
      error: "Failed to delete link. Please try again.",
    };
  }
}

// Validation schema for updating links
const updateLinkSchema = z.object({
  linkId: z
    .string()
    .trim()
    .uuid("Invalid link ID format"),
  shortCode: z
    .string()
    .trim()
    .min(3, "Short code must be at least 3 characters")
    .max(10, "Short code must be at most 10 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Short code can only contain letters, numbers, hyphens, and underscores"),
  originalUrl: z
    .string()
    .trim()
    .min(1, "URL cannot be empty")
    .max(2048, "URL must be less than 2048 characters")
    .url("Must be a valid URL")
    .refine(
      (url) => url.startsWith("http://") || url.startsWith("https://"),
      "URL must start with http:// or https://"
    ),
});

type UpdateLinkInput = z.infer<typeof updateLinkSchema>;

export async function updateLinkAction(input: UpdateLinkInput) {
  // 1. Check authentication
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  // 2. Check rate limit
  const rateLimitError = checkRateLimit(updateLinkLimiter, userId);
  if (rateLimitError) {
    return rateLimitError;
  }

  // 3. Validate input with Zod
  const validation = updateLinkSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0].message,
    };
  }

  try {
    // 4. Check if trying to update to a short code that already exists (and it's not the same link)
    const existingLink = await getLinkByShortCode(validation.data.shortCode);
    if (existingLink && existingLink.id !== validation.data.linkId) {
      return {
        success: false,
        error: "Short code already exists. Please choose a different one.",
      };
    }

    // 5. Call database helper function
    const link = await updateLink(
      validation.data.linkId,
      {
        shortCode: validation.data.shortCode,
        originalUrl: validation.data.originalUrl,
      },
      userId
    );

    // 6. Revalidate cache
    revalidatePath("/dashboard");

    // 7. Return success response
    return { success: true, data: link };
  } catch (error) {
    console.error("Error updating link:", error);
    return {
      success: false,
      error: "Failed to update link. Please try again.",
    };
  }
}
