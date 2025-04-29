import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const addItem = mutation({
  args: {
    userId: v.id("users"),
    pantryType: v.union(
        v.literal("pantry"),
        v.literal("fridge"),
        v.literal("freezer"),
        v.literal("freshbox")),
    iconUrl: v.string(),
    storageId:v.id("_storage"),
    title: v.string(),
    expiryDate: v.string(),
    quantityValue: v.number(),
    quantityUnit: v.string(),
    foodId: v.id("foodItems")
  },
  handler: async (ctx, args) => {
    // In a real app, you might want to check if the food item exists
    // in your "foods" table and get its ID.  For this example, we'll
    // assume it exists or we're creating a new food on the fly.

    // Insert the new pantry item
    await ctx.db.insert("pantryItems", {
      userId: args.userId,
      foodId: args.foodId, // Use the foodId
      iconUrl: args.iconUrl,
      storageId: args.storageId,
      title: args.title, // Or a more general "title"
      pantryType: args.pantryType,
      expiryDate: args.expiryDate,
      quantityValue: args.quantityValue,
      quantityUnit: args.quantityUnit,
    });
  },
});