// "use client";
import Link from "next/link";
import { Download } from "lucide-react";

import ImagePreviewCard from "@/components/image-card";
import ProcessConvertCard from "@/components/process-image-to-pdf-card";
import { Separator } from "@/components/ui/separator";
import Uploader from "@/components/image-uploader";
import supabase from "@/lib/supabase";

import PDFViewer from "@/components/pdf-viewer";

import { getImageByID, getPDFDocumentData } from "@/server/server-functions";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
            const pdfMeta = await getPDFDocumentData(pdf_id);
            return (
                <main className="min-h-screen flex items-center justify-center">
                    <div className="flex flex-col md:flex-row w-[90%] gap-4  justify-center md:w-full md:h-[80vh] mt-[6rem] md:mt-10">
                        <PDFViewer pdf_url={pdf_url} />
                        <Separator orientation="vertical" />
                        <Separator className="md:hidden" />
                        <div className="md:w-[30%] flex flex-col gap-4">
                            <ImagePreviewCard image_id={image_id} />
                            <h1>Meta Data : </h1>
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col">
                                    <p>Name</p>
                                    <Label>{pdfMeta.name}</Label>
                                </div>
                                <div className="flex flex-col">
                                    <p>Created at</p>
                                    <Label>
                                        <time>
                                            {pdfMeta.createdAt.toDateString()}
                                        </time>
                                    </Label>
                                </div>
                                <div className="flex flex-col">
                                    <p>Updated At</p>
                                    <Label>
                                        <time>
                                            {pdfMeta.updatedAt
                                                ? pdfMeta.updatedAt.toDateString()
                                                : ""}
                                        </time>
                                    </Label>
                                </div>
                                <div className="flex flex-col mb-4">
                                    <Button asChild>
                                        <Link href={pdf_url} passHref>
                                            <Download className="h-4 w-4 mr-2" /> Download
                                        </Link>
                                    </Button>
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
