"use server";

import { randomUUID, UUID } from "crypto";
import { db } from "./database";
import { images } from "./db-schema";

export const generateUUID = () => randomUUID();

export const getDBURL = () => {
    const DB_URL = process.env.DATABASE_URL
    return (DB_URL ?? null);
}

export type AddImageData = {
    name: string;
    url: string;
}

export async function addImageData(addImageData: AddImageData) {
    return await db.insert(images).values({
        name: addImageData.name,
        url: addImageData.url,
    }).returning();
}