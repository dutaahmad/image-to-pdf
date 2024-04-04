// "use client";
import ProcessConvertCard from "@/components/process-image-to-pdf-card";
import Uploader from "@/components/image-uploader";

import { getImageByID } from "@/server/server-functions";

const MergePDFs = async ({
    params,
    searchParams,
}: {
    params: { states: string[] };
    searchParams: { [key: string]: string | string[] | undefined };
}) => {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen gap-8">
            <div className="flex flex-col items-center">
                <h1 className="text-2xl font-semibold tracking-tight text-center scroll-m-20">
                    Upload maximum 10 (ten) PDF documents to our platform to
                    start merging them!
                </h1>
            </div>
            <Uploader multiple uploaderType="pdf" />
        </main>
    );
};

export default MergePDFs;
