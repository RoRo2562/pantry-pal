import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import {Webhook} from "svix";
import {api} from "./_generated/api"

const http = httpRouter();

http.route({
    path:'/clerk-webhook',
    method:'POST',
    handler: httpAction(async (context,req) => {
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        if (!webhookSecret) {
            throw new Error("Webhook secret not set");
        }
        const svix_id = req.headers.get("svix-id");
        const svix_sig = req.headers.get("svix-signature");
        const svix_timestamp = req.headers.get("svix-timestamp");

        if (!svix_id || !svix_sig || !svix_timestamp) {
            return new Response("Missing headers", { status: 400 });
        }

        const payload = await req.json();
        const body = JSON.stringify(payload);

        const webhook = new Webhook(webhookSecret);
        let event:any;
        try {
            event = webhook.verify(body, {
                "svix-id": svix_id,
                "svix-signature": svix_sig,
                "svix-timestamp": svix_timestamp,
            });
        } catch (error) {
            console.error("Webhook verification failed:", error);
            return new Response("Invalid signature", { status: 400 });
        }

        const eventType = event.type;

        if (eventType === "user.created") {
            const userId = event.data.id;
            const email = event.data.email_addresses[0].email_address;
            const fullname = `${event.data.first_name || ""} ${event.data.last_name||""}`.trim();
            const image = event.data.profile_image_url;

            try {
                await context.runMutation(api.users.createUser, {
                    email,
                    username: email.split("@")[0],
                    fullname: fullname,
                    clerkId: userId,
                    image: image,
                });
            }
            catch (error) {
                console.error("Error creating user:", error);
                return new Response("Error creating user", { status: 500 });
            }
        }
        return new Response("Webhook processed", { status: 200 });
    })
});


export default http;