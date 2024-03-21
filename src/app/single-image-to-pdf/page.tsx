// "use client";

import Uploader from "@/components/uploader";
// import { Button } from "@/components/ui/button";
// import { getDBURL } from "@/server/server-functions";
// import { useState } from "react";

const SingleImageToPDFPage = () => {
    // const [dbURL, setDBURL] = useState<string | null>()
    return (
        <main className="min-h-screen flex flex-col gap-8 items-center justify-center">
            <h1 className="{m-auto}">Single Image To PDF Page</h1>
            {/* <p>{dbURL}</p>
            <Button onClick={() => setDBURL(getDBURL())}>
                Get DB URL
            </Button> */}
            <Uploader />
        </main>
    );
};

export default SingleImageToPDFPage;
