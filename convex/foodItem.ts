import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const addFood = mutation({
  args: {
    name: v.string(),           // Required: Name of the food item
    barcode: v.optional(v.string()), // Optional: Store the barcode (if available)
    brand: v.optional(v.string()),     // Optional: Brand name
    imageUrl: v.optional(v.string()),    // Optional: URL to an image
    ingredients: v.optional(v.string()),
    calories: v.optional(v.string()), // Optional: Caloric content
    protein: v.optional(v.number()),
    fat: v.optional(v.number()),
    carbohydrates: v.optional(v.number()),
    salt: v.optional(v.number()),
    saturatedFat: v.optional(v.number()),
    sodium: v.optional(v.number()),
    sugars: v.optional(v.number()),
    fiber: v.optional(v.number()),
    calcium: v.optional(v.number()),
    iron: v.optional(v.number()),
    potassium: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // In a real app, you might want to check if the food item exists
    // in your "foods" table and get its ID.  For this example, we'll
    // assume it exists or we're creating a new food on the fly.

    // Insert the new pantry item
    await ctx.db.insert("foodItems", {
        name: args.name,
        barcode: args.barcode,
        brand: args.brand,
        imageUrl: args.imageUrl,
        ingredients: args.ingredients,
        calories: args.calories,
        protein: args.protein, 
        fat: args.fat,
        carbohydrates: args.carbohydrates,
        salt: args.salt,
        saturatedFat: args.saturatedFat,
        sodium: args.sodium,
        sugars: args.sugars,
        fiber: args.fiber,
        calcium: args.calcium,
        iron: args.iron,
        potassium: args.potassium,
    });
  },
});