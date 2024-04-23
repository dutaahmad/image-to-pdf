export const dynamic = "force-dynamic"; // static by default, unless reading the request

import supabase from "@/lib/supabase";
import { db } from "@/server/database";
import { images, pdf_documents } from "@/server/db-schema";
import { generateUUID } from "@/server/server-functions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    // const deleteImages = await db.delete(images);
    // const deletePDFs = await db.delete(pdf_documents);
    const resetDB = async () => {
        const deleteImages = await db.delete(images);
        const deletePDFs = await db.delete(pdf_documents);
        return {
            deleted_images: deleteImages,
            deleted_pdfs: deletePDFs
        };
    };

    const data = await resetDB()

    return NextResponse.json(data, {
        status: 200,
        statusText: "Reset Database Success"
    })
}
