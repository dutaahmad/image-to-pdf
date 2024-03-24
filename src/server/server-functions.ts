"use server";

import { randomUUID, UUID } from "crypto";
import { db } from "./database";
import { images } from "./db-schema";
import { eq } from "drizzle-orm";
import supabase from "@/lib/supabase";

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
