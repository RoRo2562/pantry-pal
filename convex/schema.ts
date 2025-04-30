import {defineSchema, defineTable} from "convex/server"
import { v } from "convex/values"

export default defineSchema({
    users: defineTable({
        username: v.string(),
        fullname: v.string(),
        email: v.string(),
        image:v.string(),
        bio: v.optional(v.string()),
        clerkId: v.string()
    }).index("by_clerk_id",["clerkId"]),

    // pantry: defineTable({
    //     userId: v.id("users"),
    //     pantryType: v.union(
    //         v.literal("pantry"),
    //         v.literal("fridge"),
    //         v.literal("freezer"),
    //         v.literal("freshbox")),
    // }).index("by_user_and_type",["userId","pantryType"]),

    pantryItems: defineTable({
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
    }).index("by_user_and_type",["userId","pantryType"])
    .index("by_expiry_date",["expiryDate"]),

    notifications: defineTable({
        receiverId: v.id("users"),
        senderId: v.id("users"),
        type: v.union(v.literal("pantry"),v.literal("fridge"),v.literal("freezer"),v.literal("freshbox")),
        pantryType: v.string()
    }).index("by_user",["receiverId"]),

    foodItems: defineTable({
        name: v.string(),           // Required: Name of the food item
        barcode: v.optional(v.string()), // Optional: Store the barcode (if available)
        brand: v.optional(v.string()),     // Optional: Brand name
        imageUrl: v.optional(v.string()),    // Optional: URL to an image
        ingredients: v.optional(v.string()),
        calories: v.optional(v.string()), // Optional: Caloric content
        protein: v.optional(v.string()),
        fat: v.optional(v.string()),
        carbohydrates: v.optional(v.string()),
        salt: v.optional(v.string()),
        saturatedFat: v.optional(v.string()),
        sodium: v.optional(v.string()),
        sugars: v.optional(v.string()),
        fiber: v.optional(v.string()),
        calcium: v.optional(v.string()),
        iron: v.optional(v.string()),
        potassium: v.optional(v.string()),
    }).index("by_barcode", ["barcode"]),
})