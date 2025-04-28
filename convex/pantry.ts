import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getByUserAndType = query({
  args: {
    pantryType: v.string(), // Expecting "pantry", "fridge", etc.
  },
  handler: async (ctx, args) => {
    // First, find the pantryId for the given userId and pantryType
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("User not authenticated");
    }

    const currentUser = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
        .first();
    
    if (!currentUser) {
        throw new Error("User not found");
        }

    const pantry = await ctx.db
      .query("pantry")
      .filter((p) => p.eq(p.field("userId"), currentUser._id))
      .filter((p) => p.eq(p.field("pantryType"), args.pantryType))
      .first();

    if (!pantry) {
      return []; // Or handle the case where the pantry doesn't exist
    }

    // Then, find the pantryItems associated with that pantryId
    const items = await ctx.db
      .query("pantryItems")
      .filter((item) => item.eq(item.field("pantryId"), pantry._id))
      .collect();

    return items;
  },
});

export const initializeUserPantries = mutation({
    args: {
      userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const pantryTypes: ("pantry" | "fridge" | "freezer" | "freshbox")[] = [
            "pantry",
            "fridge",
            "freezer",
            "freshbox",
          ];
      
  
      for (const pantryType of pantryTypes) {
        await ctx.db.insert("pantry", {
          userId: args.userId,
          pantryType: pantryType,
        });
      }
    },
  });