import { z } from "zod";

import {
    createTRPCRouter,
    protectedProcedure
} from "@/server/api/trpc";
import { images, pdf_documents } from "@/server/db/schema";
import { eq } from "drizzle-orm";

import { AddPDFDocumentZodType } from "@/lib/types"

export const pdfRouter = createTRPCRouter({
    addPDFDocumentData: protectedProcedure
        .input(AddPDFDocumentZodType)
        .mutation(async ({ ctx, input }) => {
            try {
                if (input.is_source)
                    return (await ctx.db
                        .insert(pdf_documents)
                        .values({
                            id: input.id,
                            name: input.name,
                            url: input.url,
                            is_source: input.is_source,
                        })
                        .returning())[0];
                else
                    return (await ctx.db
                        .insert(pdf_documents)
                        .values({
                            id: input.id,
                            name: input.name,
                            url: input.url,
                        })
                        .returning())[0];
            } catch (error) {
                if (error instanceof Error) throw {
                    cause: error.cause,
                    stack: error.stack,
                    name: error.name,
                    message: "Server Error while adding PDF Document data to database! Error : " + error.message,
                }; else throw new Error("Unkown Server Error while adding PDF Document to database! Error : " + error);
            }
        }),
    getPDFDocumentData: protectedProcedure
        .input(z.object({ pdf_id: z.string().uuid() }))
        .query(({ ctx, input }) => (
            ctx.db
                .select()
                .from(pdf_documents)
                .where(eq(pdf_documents.id, input.pdf_id))
        )),
    deletePDFDocumentData: protectedProcedure
        .input(z.object({ pdf_id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            try {
                const { data, error: supabaseError } = await ctx.supabase.storage
                    .from("pdfs")
                    .remove([input.pdf_id]);
                if (data) {
                    const deleted = await ctx.db
                        .delete(pdf_documents)
                        .where(eq(pdf_documents.id, input.pdf_id));
                    return deleted;
                } else if (supabaseError) throw supabaseError;
            } catch (error) {
                if (error instanceof Error) throw {
                    cause: error.cause,
                    stack: error.stack,
                    name: error.name,
                    message: "Server Error while deleting PDF Document data from database! Error : " + error.message,
                }; else throw new Error("Unkown Server Error while deleting PDF Document from database! Error : " + error);
            }
        })
});