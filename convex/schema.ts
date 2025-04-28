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

    pantry: defineTable({
        userId: v.id("users"),
        pantryType: v.union(v.literal("pantry"),v.literal("fridge"),v.literal("freezer"),v.literal("freshbox")),
    }).index("by_user",["userId"]),

    pantryItems: defineTable({
        userId: v.id("users"),
        pantryId: v.id("pantry"),
        iconUrl: v.string(),
        storageId:v.id("_storage"),
        title: v.string(),
        expiryDate: v.string(),
        quantityValue: v.number(),
        quantityUnit: v.string(),
        food: v.id("foods")
    }).index("by_pantry",["pantryId"]),

    notifications: defineTable({
        receiverId: v.id("users"),
        senderId: v.id("users"),
        type: v.union(v.literal("pantry"),v.literal("fridge"),v.literal("freezer"),v.literal("freshbox")),
        pantryType: v.string()
    }).index("by_user",["receiverId"]),
})