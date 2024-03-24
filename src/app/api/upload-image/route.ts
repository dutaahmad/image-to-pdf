import { addImageData } from "@/server/server-functions";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export async function POST(request: NextRequest) {
    // return new Response(`Hello this meant to be Vercel Serverless Function`);
    const body = await request.json();
    if (typeof body === "object" && body.name && body.url) {
        const added = await addImageData(body);
        // revalidatePath("/")
        return NextResponse.json({ image_data: added[0] })
    } else throw Error("invalid request body!");
}
