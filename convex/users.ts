import { mutation } from "./_generated/server";
import { v } from "convex/values";
// import { initializeUserPantries } from "./pantry";
import { Id } from "./_generated/dataModel";
import { api } from "./_generated/api";

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

        let userId: Id<"users">; // Declare userId with the correct type

        if (existingUser) return;

        userId = await context.db.insert("users",{
            username:args.username,
            fullname:args.fullname,
            email:args.email,
            bio:args.bio,
            clerkId:args.clerkId,
            image:args.image
        });
        // await context.runMutation(api.pantry.initializeUserPantries, { userId: userId });

        return userId; // Return the user ID
    }
});