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
import { Redirect } from "next";

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
                        })
                    )[0];
                    dbPDFAddResults.push(dbPDFAddResult);
                    urlQueryStringArray.push(
                        "pdf_res=" + dbPDFAddResult.id + "&"
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
        }
        const urlQueryString = urlQueryStringArray.join("");
        redirect(urlQueryString);
    } catch (error) {
        throw error;
    }
}

export async function mergePDFsForm(pdf_ids: string[], formData: FormData) {
    const urlQueryStringArray: string[] = ["/merge-pdfs?"];

    const mergeData: MergePDFs = pdf_ids.map((pdf_id) => {
        // const usedPageSize = formData.get("page_size_" + pdf_id) as PageSize;
        // const usedPageOrientation = formData.get(
        //     "page_orientation_" + pdf_id
        // ) as PageOrientation;
        return {
            page_id: pdf_id,
            // page_size: usedPageSize,
            // page_orientation: usedPageOrientation,
        };
    });
    console.log("to be merged : ", mergeData);
    const merge = await mergePDFs(mergeData);

    if (merge)
        return {
            message: "Success merging PDF!",
            status: true,
            errors: null,
            data: merge,
        };
    else
        return {
            message: "Error merging PDF!",
            status: true,
            errors: merge,
            data: null,
        };
}
