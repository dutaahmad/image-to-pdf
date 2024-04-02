// "use client";
import ProcessConvertCard from "@/components/process-image-to-pdf-card";
import Uploader from "@/components/image-uploader";

import { getImageByID } from "@/server/server-functions";

const MultipleImagesToPDF = async ({
    params,
}: {
    params: { states: string[] };
}) => {
    return (
        <main className="min-h-screen flex flex-col gap-8 items-center justify-center">
            <div className="flex flex-col items-center">
                <h1 className="scroll-m-20 text-2xl font-semibold text-center tracking-tight">
                    Upload maximum 10 (ten) .jpeg images to our platform to
                    start converting!
                </h1>
            </div>
            <Uploader multiple />
        </main>
    );
};

export default MultipleImagesToPDF;
