import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Create a new task with the given text
export const createUser = mutation({
    args:{
        username: v.string(),
        fullname: v.string(),
        email: v.string(),
        bio: v.optional(v.string()),
        clerkId: v.string(),
        image:v.string()
    },
    handler: async(context,args) => {
        const existingUser = await context.db
        .query("users")
        .withIndex("by_clerk_id",(q) => q.eq("clerkId",args.clerkId))
        .first()

        if (existingUser) return;

        await context.db.insert("users",{
            username:args.username,
            fullname:args.fullname,
            email:args.email,
            bio:args.bio,
            clerkId:args.clerkId,
            image:args.image
        })
    }
});