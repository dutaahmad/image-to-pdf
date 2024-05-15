import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "@/server/api/trpc";
import { images } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const imageRouter = createTRPCRouter({
    addImageData: protectedProcedure
        .input(z.object(
            {
                name: z.string().min(1),
                url: z.string().url()
            }
        ))
        .mutation(async ({ ctx, input }) => {
            // simulate a slow db call
            // await new Promise((resolve) => setTimeout(resolve, 1000));
            await ctx.db.insert(images).values({
                name: input.name,
                url: input.url,
                createdById: ctx.session.user.id,
            });
        }),

    getAll: protectedProcedure.query(({ ctx }) => {
        return ctx.db.query.images.findMany({
            orderBy: (images, { desc }) => [desc(images.createdAt)],
        });
    }),

    getImageById: protectedProcedure
        .input(z.object({ image_id: z.string().uuid() }))
        .query(
            ({ ctx, input }) => ctx.db.query.images.findFirst({
                where: (images, { eq }) =>
                    eq(images.id, input.image_id),
                columns: {
                    id: true,
                    name: true,
                    url: true,
                },
            })
        ),

    getImageFromBucket: protectedProcedure
        .input(z.object({ image_id: z.string().uuid() }))
        .query(
            async ({ ctx, input }) => {
                try {
                    const { data: image_data, error: fetchImageError } = await ctx.supabase.storage.from("images").download(input.image_id);
                    if (image_data) return image_data;
                    if (fetchImageError)
                        console.error("Fetching image from supabase storage failed! Error: " + fetchImageError);
                } catch (error) {
                    if (error instanceof Error)
                        throw {
                            cause: error.cause,
                            stack: error.stack,
                            name: error.name,
                            message: "Server Error while getting image from supabase storage! Error : " + error.message,
                        };
                    else throw "Unknown error while getting image from supabase storage!";
                }
            }
        ),

    deleteImagebyID: protectedProcedure
        .input(z.object({ image_id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            try {
                const { data, error } = await ctx.supabase.storage
                    .from("images")
                    .remove([input.image_id]);
                if (data) {
                    const deleted = await ctx.db
                        .delete(images)
                        .where(eq(images.id, input.image_id));
                    return deleted;
                } else if (error) {
                    console.error(error.message);
                }
            } catch (error) {
                console.error("Unkown error: " + error);
            }
        }),
});
