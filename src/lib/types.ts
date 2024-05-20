import { OBJECT_LOCKER_SECRET_KEY } from "@/env";
import { z } from "zod";

export type IOBJECT_LOCKER_SECRET_KEY = typeof OBJECT_LOCKER_SECRET_KEY;

export type AddImageData = {
    id: string;
    name: string;
    url: string;
};

export class AddPDFDocumentData {
    constructor(id: string, name: string, url: string, is_source?: boolean) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.is_source = is_source;
    }

    id: string;
    name: string;
    url: string;
    is_source?: boolean;
};

export const AddPDFDocumentZodType = z.instanceof(AddPDFDocumentData);

export enum PageSize {
    A4 = "A4",
    F4 = "F4",
}

export enum PageOrientation {
    PORTRAIT = "portrait",
    LANDSCAPE = "landscape",
}

export type ConvertPDFProps = {
    image_id: string;
    page_size: PageSize;
    page_orientation: PageOrientation;
};

export type ConvertPDFFormState = {
    status: boolean;
    message: string;
    data: {
        path: string;
    };
};

export type PDFSourceIDs = {
    pdf_source_ids: string[];
};

export type ImageSourceIDs = {
    images_source_ids: string[];
};

export type MergePDFs = {
    page_id: string;
    // page_size: PageSize;
    // page_orientation: PageOrientation;
}[]
