import Uploader from "@/components/uploader";
import React from "react";

const SingleImageToPDFPage = () => {
    return (
        <main className="min-h-screen flex flex-col gap-8 items-center justify-center">
            <h1 className="{m-auto}">Single Image To PDF Page</h1>
            <Uploader />
        </main>
    );
};

export default SingleImageToPDFPage;
