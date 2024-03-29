// "use client";
import ProcessConvertCard from "@/components/process-image-to-pdf-card";
import Uploader from "@/components/uploader";

import { getImageByID } from "@/server/server-functions";

const MergePDFs = async ({
    params,
}: {
    params: { states: string[] };
}) => {

    if (params.states) {
        const image = await getImageByID(params.states[0]);
        console.log("image : ", image);
        return (
            <main className="min-h-screen flex flex-col gap-8 items-center justify-center">
                <h1 className="{m-auto}">Single Image To PDF Page</h1>
                <ProcessConvertCard image_id={image!.id!} />
                <Uploader />
            </main>
        );
    }

    return (
        <main className="min-h-screen flex flex-col gap-8 items-center justify-center">
            <h1 className="{m-auto}">Single Image To PDF Page</h1>
            <Uploader />
        </main>
    );
};

export default MergePDFs;


