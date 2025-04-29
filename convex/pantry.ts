import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getByUserAndType = query({
  args: {
    pantryType: v.union(
        v.literal("pantry"),
        v.literal("fridge"),
        v.literal("freezer"),
        v.literal("freshbox")), // Expecting "pantry", "fridge", etc.
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

    const pantryItems = await ctx.db
      .query("pantryItems")
      .withIndex("by_user_and_type", (q) => // Use the composite index
                q.eq("userId", currentUser._id)
                 .eq("pantryType", args.pantryType)
            )
      .collect();

    if (!pantryItems) {
      return []; // Or handle the case where the pantry doesn't exist
    }

    return pantryItems;
  },
});

// export const initializeUserPantries = mutation({
//     args: {
//       userId: v.id("users"),
//     },
//     handler: async (ctx, args) => {
//         const pantryTypes: ("pantry" | "fridge" | "freezer" | "freshbox")[] = [
//             "pantry",
//             "fridge",
//             "freezer",
//             "freshbox",
//           ];
      
  
//       for (const pantryType of pantryTypes) {
//         await ctx.db.insert("pantry", {
//           userId: args.userId,
//           pantryType: pantryType,
//         });
//       }
//     },
//   });

  export const getPantryItemsExpiringSoon = query({
    args: {
        userId: v.id("users"),
        pantryType: v.union(
            v.literal("pantry"),
            v.literal("fridge"),
            v.literal("freezer"),
            v.literal("freshbox")),
        expirationThreshold: v.string(),
    },
    handler: async (ctx, args) => {
        const items = await ctx.db
            .query("pantryItems")
            .withIndex("by_user_and_type", (q) => // Use the composite index
                q.eq("userId", args.userId)
                 .eq("pantryType", args.pantryType)
            )
            .filter((p) => p.lte(p.field("expiryDate"), args.expirationThreshold)) // Filter by expiryDate
            .collect();
        return items;
    },
});
