"use server";

import { randomUUID, UUID } from "crypto";
import { db } from "./database";
import { images, pdf_documents } from "./db-schema";
import { eq } from "drizzle-orm";
import supabase from "@/lib/supabase";

import { PDFDocument, PageSizes, StandardFonts, rgb } from "pdf-lib";
import {
    AddImageData,
    AddPDFDocumentData,
    ConvertPDFProps,
    PageOrientation,
    PageSize,
} from "@/lib/types";

export const generateUUID = () => randomUUID();

export const getDBURL = () => {
    const DB_URL = process.env.DATABASE_URL;
    return DB_URL ?? null;
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
            await supabase.storage.from("images").download(image_id);
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

export async function getPDFDocumentData(pdf_id: string) {
    return (
        await db
            .select()
            .from(pdf_documents)
            .where(eq(pdf_documents.id, pdf_id))
    )[0];
}

const createQueryStringServer = (
    name: string,
    value: string,
    baseQueryString?: string
) => {
    if (baseQueryString) {
        const params = new URLSearchParams(baseQueryString);
        params.set(name, value);

        return params.toString();
    }
    const params = new URLSearchParams();
    params.set(name, value);

    return params.toString();
};

/**
 * Converts an image to a PDF document and uploads it to a Supabase storage bucket.
 *
 * @param {ConvertPDFProps} params - The parameters for converting the image to PDF.
 * @param {string} params.image_id - The ID of the image to be converted.
 * @param {PageSize} params.page_size - The size of the PDF page (e.g., A4, F4).
 * @param {PageOrientation} params.page_orientation - The orientation of the PDF page (PORTRAIT or LANDSCAPE).
 * @returns {Promise<{ message: string, data?: SupabaseStorageFileData }>} A Promise that resolves with an object containing a success message and the uploaded file data, or rejects with an error object.
 * @throws {Error} If an error occurs during the PDF conversion or upload process.
 */
export async function convertToPDF({
    image_id,
    page_size,
    page_orientation,
}: ConvertPDFProps): Promise<
    { message: string; data: { path: string } } | undefined
> {
    const pdfPath = await generateUUID();

    const usedPageSize =
        page_size === PageSize.A4 &&
            page_orientation === PageOrientation.PORTRAIT
            ? PageSizes.A4
            : page_size === PageSize.A4 &&
                page_orientation === PageOrientation.LANDSCAPE
                ? ([841.89, 595.28] as [number, number])
                : page_size === PageSize.F4 &&
                    page_orientation === PageOrientation.PORTRAIT
                    ? PageSizes.Legal
                    : ([1008.0, 612.0] as [number, number]);

    try {
        const imageData = await (await getImageFromBucket(
            image_id
        ))!.arrayBuffer();

        const pdfDoc = await PDFDocument.create();

        const embedJpegImage = await pdfDoc.embedJpg(imageData);
        const jpgDims = embedJpegImage.scale(1); // Keep the original image dimensions
        const page = pdfDoc.addPage(usedPageSize);

        // Calculate the scaling factor to fit the image within the page
        const scaleX = page.getWidth() / jpgDims.width;
        const scaleY = page.getHeight() / jpgDims.height;
        const scale = Math.min(scaleX, scaleY);

        // Calculate the dimensions of the scaled image
        const scaledWidth = jpgDims.width * scale;
        const scaledHeight = jpgDims.height * scale;

        // Calculate the position to center the image on the page
        const x = (page.getWidth() - scaledWidth) / 2;
        const y = (page.getHeight() - scaledHeight) / 2;

        page.drawImage(embedJpegImage, {
            x,
            y,
            width: scaledWidth,
            height: scaledHeight,
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
