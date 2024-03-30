// "use client";
import ProcessConvertCard from "@/components/process-image-to-pdf-card";
import Uploader from "@/components/uploader";

import { getImageByID } from "@/server/server-functions";

const MultipleImagesToPDF = async ({
    params,
}: {
    params: { states: string[] };
}) => {

    return (
        <main className="min-h-screen flex flex-col gap-8 items-center justify-center">
            <h1 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">Multiple Image To PDF Page (Work On Progress)</h1>
        </main>
    );
};

export default MultipleImagesToPDF;


