// "use client";
import ImagePreviewCard from "@/components/image-card";
import ProcessConvertCard from "@/components/process-image-to-pdf-card";
import { Separator } from "@/components/ui/separator";
import Uploader from "@/components/image-uploader";
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
            const {
                data: { publicUrl: pdf_url },
            } = supabase.storage.from("pdfs").getPublicUrl(pdf_id);
            return (
                <main className="min-h-screen flex items-center justify-center">
                    <div className="flex flex-col md:flex-row w-[90%] gap-4  justify-center md:w-full md:h-[80vh] mt-[6rem] md:mt-10">
                        <PDFViewer pdf_url={pdf_url} />
                        <Separator orientation="vertical" />
                        <Separator className="md:hidden" />
                        <div className="md:w-[30%]">
                            <ImagePreviewCard image_id={image_id} />
                            <h1>Meta Data : </h1>
                            <div className="info">
                                <div className="info-group">
                                    <p>Uploaded by</p>
                                    <label>
                                        Nahdi Duta Ahmad
                                        (dutaahmadtefur@gmail.com)
                                    </label>
                                </div>
                                <div className="info-group">
                                    <p>Status</p>
                                    <label>
                                        Signed on 04/01/2024 @ 06:09am
                                    </label>
                                </div>
                                <div className="info-group">
                                    <p>Last modified</p>
                                    <label>
                                        <time>
                                            Apr 1, 2024
                                        </time>
                                    </label>
                                </div>
                                <div className="info-group">
                                    <p>File name</p>
                                    <label>
                                        Perjanjian Kerahasiaan &amp; Larangan
                                        Non-Kompetisi - Nahdi Duta Ahmad-
                                        eMaterai_signed.pdf
                                    </label>
                                </div>
                                <div className="info-group">
                                    <p>File extension</p>
                                    <label>pdf</label>
                                </div>
                                <div className="info-group">
                                    <p>Size</p>
                                    <label>254 KB</label>
                                </div>
                            </div>
                        </div>
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
                <h1 className="scroll-m-20 text-2xl font-semibold text-center tracking-tight">
                    Upload a single .jpeg image to our platform to start
                    converting!
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
