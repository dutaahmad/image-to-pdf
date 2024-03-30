// "use client";
import ProcessConvertCard from "@/components/process-image-to-pdf-card";
import Uploader from "@/components/uploader";

import { getImageByID } from "@/server/server-functions";

const SingleImageToPDFPage = async ({
    params,
}: {
    params: { states: string[] };
}) => {
    if (params.states) {
        const image = await getImageByID(params.states[0]);
        return (
            <main className="min-h-screen flex flex-col gap-8 items-center justify-center">
                <h1 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">Convert Single Image To PDF</h1>
                <ProcessConvertCard image_id={image!.id!} />
            </main>
        );
    }

    return (
        <main className="min-h-screen flex flex-col gap-8 items-center justify-center">
            <div className="flex flex-col items-center">
                <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">Convert Single Image To PDF</h1>
                <p className="leading-7 [&:not(:first-child)]:mt-6">To start converting, upload a single jpeg image to our platform!</p>
            </div>
            <Uploader />
        </main>
    );
};

export default SingleImageToPDFPage;
