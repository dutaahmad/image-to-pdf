// "use client";

import Uploader from "@/components/uploader";

const SingleImageToPDFPage = ({ params }: { params: { states: string[] } }) => {
    console.log("params : ", params)
    return (
        <main className="min-h-screen flex flex-col gap-8 items-center justify-center">
            <h1 className="{m-auto}">Single Image To PDF Page</h1>
            <Uploader />
        </main>
    );
};

export default SingleImageToPDFPage;
