export const dynamic = "force-dynamic"; // static by default, unless reading the request

import supabase from "@/lib/supabase";
import { generateUUID } from "@/server/server-functions";
import PDFDocument from "pdfkit";

export async function POST(request: Request) {

    const newID = generateUUID()

    try {
        //Create a new pdf
        const body = await request.json();
        const doc = new PDFDocument({ size: "A4", autoFirstPage: false });
        const pdfName = "pdf-" + Date.now() + ".pdf";
        doc.addPage().image(body.image_url).end();

        const { data, error } = await supabase.storage.from("pdfs").upload(newID, doc)

        if (data) {
            return Response.json(data, { status: 201 })
        } else if (error) {
            return Response.json(error, { status: 400, statusText: error.message })
        }
    } catch (error) {
        return Response.json(error, { status: 500, statusText: "Unkown error!" })
    }
}
