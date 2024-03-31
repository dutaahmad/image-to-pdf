// "use client";
import ImagePreviewCard from "@/components/image-card";
import ProcessConvertCard from "@/components/process-image-to-pdf-card";
import { Separator } from "@/components/ui/separator";
import Uploader from "@/components/uploader";
import supabase from "@/lib/supabase";

import PDFViewer from "@/components/pdf-viewer";

import { getImageByID } from "@/server/server-functions";

const SingleImageToPDFPage = async ({
    params,
}: {
    params: { states: string[] };
}) => {
    if (params.states) {
        const image_id = params.states[0];
        const pdf_id = params.states[1];
        if (image_id && pdf_id) {
            const { data: { publicUrl: pdf_url } } = supabase.storage.from("pdfs").getPublicUrl(pdf_id)
            return (
                <main className="min-h-screen flex gap-8 items-center justify-center">
                    <div className="flex gap-4 items-center justify-center h-[35rem]">
                        <ImagePreviewCard image_id={image_id} />
                        <Separator orientation="vertical" />
                        <PDFViewer pdf_url={pdf_url} />
                    </div>
                </main>
            );
        } else if (image_id) {
            const image = await getImageByID(image_id);
            return (
                <main className="min-h-screen flex flex-col gap-8 items-center justify-center">
                    <ProcessConvertCard image_id={image!.id!} />
                </main>
            );
        }
    }

    return (
        <main className="min-h-screen flex flex-col gap-8 items-center justify-center">
            <div className="flex flex-col items-center">
                <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    Upload a single jpeg image to our
                    platform to start converting!
                </h1>
                {/* <p className="leading-7 [&:not(:first-child)]:mt-6">
                    To start converting, upload a single jpeg image to our
                    platform!
                </p> */}
            </div>
            <Uploader />
        </main>
    );
};

export default SingleImageToPDFPage;
