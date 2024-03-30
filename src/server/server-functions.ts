"use server";

import { randomUUID, UUID } from "crypto";
import { db } from "./database";
import { images, pdf_documents } from "./db-schema";
import { eq } from "drizzle-orm";
import supabase from "@/lib/supabase";

import { Readable, Writable } from "stream";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export const generateUUID = () => randomUUID();

export const getDBURL = () => {
    const DB_URL = process.env.DATABASE_URL;
    return DB_URL ?? null;
};

export type AddImageData = {
    id: string;
    name: string;
    url: string;
};

export type AddPDFDocumentData = {
    id: string;
    name: string;
    url: string;
};

export async function addImageData(addImageData: AddImageData) {
    return await db
        .insert(images)
        .values({
            id: addImageData.id,
            name: addImageData.name,
            url: addImageData.url,
        })
        .returning();
}

export async function getImageByID(image_id: string) {
    return await db.query.images.findFirst({
        where: (images, { eq }) => eq(images.id, image_id),
        columns: {
            id: true,
            name: true,
            url: true,
        },
    });
}

export async function getImageFromBucket(image_id: string) {
    try {
        const { data: image_data, error: fetchImageError } =
            await supabase.storage
                .from("images")
                .download(image_id);
        if (image_data) return image_data;
        if (fetchImageError)
            console.error(
                "Fetching image from supabase storage failed! Error: " +
                fetchImageError
            );
    } catch (error) {
        if (error instanceof Error)
            throw {
                cause: error.cause,
                stack: error.stack,
                name: error.name,
                message:
                    "Server Error while getting image from supabase storage! Error : " +
                    error.message,
            };
        else throw "Unknown error while getting image from supabase storage!";
    }
}

export async function deleteImageByID(image_id: string) {
    try {
        const { data, error } = await supabase.storage
            .from("images")
            .remove([image_id]);
        if (data) {
            const deleted = await db
                .delete(images)
                .where(eq(images.id, image_id));
            return deleted;
        } else if (error) {
            console.error(error.message);
        }
    } catch (error) {
        console.error("Unkown error: " + error);
    }
}

export async function convertToPDF({
    image_id,
    page_size,
    page_orientation,
}: {
    image_id: string;
    page_size: "A4" | "F4";
    page_orientation: "portrait" | "landscape";
}) {
    try {
        const pdfPath = await generateUUID();

        const imageData = await (await getImageFromBucket(
            image_id
        ))!.arrayBuffer();

        const pdfDoc = await PDFDocument.create();

        const embedJpegImage = await pdfDoc.embedJpg(imageData);
        const jpgDims = embedJpegImage.scale(0.5);
        const page = pdfDoc.addPage();

        page.drawImage(embedJpegImage, {
            x: page.getWidth() / 2 - jpgDims.width / 2,
            y: page.getHeight() / 2 - jpgDims.height / 2 + 250,
            width: jpgDims.width,
            height: jpgDims.height,
        });

        const pdfBytes = await pdfDoc.save();

        const { data, error } = await supabase.storage
            .from("pdfs")
            .upload(pdfPath, pdfBytes, { contentType: "application/pdf" });
        if (data)
            return {
                message: "converted pdf uploaded successfully!",
                data: data,
            };

        if (error)
            throw new Error("Error on uploading converted image to pdf!", {
                cause: error.cause,
            });
    } catch (error) {
        // if (error instanceof HttpRequestError)
        if (error instanceof Error)
            throw {
                cause: error.cause,
                stack: error.stack,
                name: error.name,
                message:
                    "Server Error while converting image to pdf! Error : " +
                    error.message,
            };
        else throw "Unknown error while converting image to pdf!";
    }
}

export async function addPDFDocumentData(addPDFData: AddPDFDocumentData) {
    return await db
        .insert(pdf_documents)
        .values({
            id: addPDFData.id,
            name: addPDFData.name,
            url: addPDFData.url,
        })
        .returning();
}

export async function deletePdfByID(pdf_id: string) {
    try {
        const { data, error } = await supabase.storage
            .from("pdfs")
            .remove([pdf_id]);
        if (data) {
            const deleted = await db
                .delete(pdf_documents)
                .where(eq(pdf_documents.id, pdf_id));
            return deleted;
        } else if (error) console.error(error.message);
    } catch (error) {
        console.error("Unkown error: " + error);
    }
}
