export type AddImageData = {
    id: string;
    name: string;
    url: string;
};

export type AddPDFDocumentData = {
    id: string;
    name: string;
    url: string;
    is_source?: boolean;
};

export enum PageSize {
    A4 = "A4",
    F4 = "F4"
}

export enum PageOrientation {
    PORTRAIT = "portrait",
    LANDSCAPE = "landscape"
}

export type ConvertPDFProps = {
    image_id: string;
    page_size: PageSize;
    page_orientation: PageOrientation;
}

export type ConvertPDFFormState = {
    status: boolean;
    message: string;
    data: {
        path: string;
    };
};