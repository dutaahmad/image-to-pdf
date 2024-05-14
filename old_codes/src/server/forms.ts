"use server";
import { redirect } from "next/navigation";

import {
    ConvertPDFFormState,
    MergePDFs,
    PageOrientation,
    PageSize,
} from "@/lib/types";
import {
    addPDFDocumentData,
    convertToPDF,
    mergePDFs,
} from "./server-functions";
import supabase from "@/lib/supabase";

import { StorageError } from "@supabase/storage-js/src/lib/errors";

export async function onConvertPDFPostAction(
    image_id: string,
    prevState: ConvertPDFFormState,
    data: FormData
) {
    // : Promise<ConvertPDFFormState>
    try {
        if (
            // data.get("image_id") &&
            image_id &&
            data.get("page_size") &&
            data.get("page_orientation")
        ) {
            const reqBody = {
                // image_id: data.get("image_id") as string,
                image_id: image_id,
                page_size: data.get("page_size") as PageSize,
                page_orientation: data.get(
                    "page_orientation"
                ) as PageOrientation,
            };
            const validateReqBody =
                (reqBody.page_size === "A4" || reqBody.page_size === "F4") &&
                (reqBody.page_orientation === "portrait" ||
                    reqBody.page_orientation === "landscape");
            if (validateReqBody) {
                const convertResult = await convertToPDF(reqBody);
                if (convertResult) {
                    const {
                        data: { publicUrl: pdf_url },
                    } = supabase.storage
                        .from("pdfs")
                        .getPublicUrl(convertResult.data.path);
                    const dbPDFAddResult = await addPDFDocumentData({
                        id: convertResult.data.path,
                        name: "converted-doc-from-" + reqBody.image_id,
                        url: pdf_url,
                        is_source: false
                    });
                    redirect(
                        `/single-image-to-pdf/${reqBody.image_id}/${dbPDFAddResult[0].id}`
                    );
                } else
                    return {
                        status: false,
                        message:
                            "Error while converting image to pdf, likely due to upload / database error.",
                        data: { path: "" },
                    };
            } else
                return {
                    status: false,
                    message:
                        "Page Size / Page Orientation must be as requested!",
                    data: { path: "" },
                };
        } else
            return {
                status: false,
                message: "Fields invalid!",
                data: { path: "" },
            };
    } catch (error) {
        throw error;
    }
}

export async function onConvertMultiplePDFPostAction(
    image_ids: string[],
    formData: FormData
) {
    const dbPDFAddResults: {
        id: string;
        name: string | null;
        url: string | null;
        createdAt: Date;
        updatedAt: Date | null;
    }[] = [];
    const urlQueryStringArray: string[] = ["/multiple-images-to-pdf?"];
    const imageIdConcat = image_ids.join("&");
    try {
        for (const image_id of image_ids) {
            const usedPageSize = formData.get("page_size_" + image_id);
            const usedPageOrientation = formData.get(
                "page_orientation_" + image_id
            );

            const reqBody = {
                image_id: image_id,
                page_size: usedPageSize as PageSize,
                page_orientation: usedPageOrientation as PageOrientation,
            };
            const validateReqBody =
                (reqBody.page_size === "A4" || reqBody.page_size === "F4") &&
                (reqBody.page_orientation === "portrait" ||
                    reqBody.page_orientation === "landscape");
            if (validateReqBody) {
                const convertResult = await convertToPDF(reqBody);
                if (convertResult) {
                    const {
                        data: { publicUrl: pdf_url },
                    } = supabase.storage
                        .from("pdfs")
                        .getPublicUrl(convertResult.data.path);
                    const dbPDFAddResult = (
                        await addPDFDocumentData({
                            id: convertResult.data.path,
                            name: "converted-doc-from-" + reqBody.image_id,
                            url: pdf_url,
                            is_source: true
                        })
                    )[0];
                    dbPDFAddResults.push(dbPDFAddResult);
                    // urlQueryStringArray.push(
                    //     "pdf_res=" + dbPDFAddResult.id + "&"
                    // );
                } else
                    return {
                        status: false,
                        message:
                            "Error while converting image to pdf, likely due to upload / database error.",
                        data: { path: "" },
                    };
            } else
                return {
                    status: false,
                    message:
                        "Page Size / Page Orientation must be as requested!",
                    data: { path: "" },
                };
        }
        const mergeResult = await mergePDFs(
            dbPDFAddResults.map((item) => ({ page_id: item.id }))
        );

        const {
            data: { publicUrl: pdf_url },
        } = supabase.storage.from("pdfs").getPublicUrl(mergeResult.path);
        const dbPDFAddResult = await addPDFDocumentData({
            id: mergeResult.path,
            name: "merged-docs-from-" + imageIdConcat,
            url: pdf_url,
            is_source: false,
        });

        urlQueryStringArray.push(`pdf_res=${dbPDFAddResult[0].id}`);
        const urlQueryString = urlQueryStringArray.join("");
        redirect(urlQueryString);
    } catch (error) {
        throw error;
    }
}

export async function mergePDFsForm(pdf_ids: string[], formData: FormData) {
    const urlQueryStringArray: string[] = ["/merge-pdfs?"];
    const pdfIdConcat = pdf_ids.join("&");
    const mergeData: MergePDFs = pdf_ids.map((pdf_id) => ({
        page_id: pdf_id,
    }));
    console.log("to be merged : ", mergeData);
    try {
        const merge = await mergePDFs(mergeData);
        const {
            data: { publicUrl: pdf_url },
        } = supabase.storage.from("pdfs").getPublicUrl(merge.path);
        const dbPDFAddResult = await addPDFDocumentData({
            id: merge.path,
            name: "merged-docs-from-" + pdfIdConcat,
            url: pdf_url,
            is_source: false,
        });
        const urlQueryString = `/merge-pdfs?result=${dbPDFAddResult[0].id}`;
        redirect(urlQueryString);
        return {
            message: "Success merging PDF!",
            status: true,
            errors: null,
            data: merge,
        };
    } catch (error) {
        if (error instanceof Error) throw error;
        else throw new Error("Unknown Error on Merge PDF Form");
    }
}
