"use server";
import { redirect } from "next/navigation";

import {
    ConvertPDFFormState,
    PageOrientation,
    PageSize,
} from "@/lib/types";
import { addPDFDocumentData, convertToPDF } from "./server-functions";
import supabase from "@/lib/supabase";

export async function onConvertPDFPostAction(
    prevState: ConvertPDFFormState,
    data: FormData
): Promise<ConvertPDFFormState> {
    if (
        data.get("image_id") &&
        data.get("page_size") &&
        data.get("page_orientation")
    ) {
        const reqBody = {
            image_id: data.get("image_id") as string,
            page_size: data.get("page_size") as PageSize,
            page_orientation: data.get("page_orientation") as PageOrientation,
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
                // return {
                //     status: true,
                //     message: convertResult.message,
                //     data: convertResult.data,
                // }
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
                message: "Page Size / Page Orientation must be as requested!",
                data: { path: "" },
            };
    } else
        return {
            status: false,
            message: "Fields invalid!",
            data: { path: "" },
        };
}
