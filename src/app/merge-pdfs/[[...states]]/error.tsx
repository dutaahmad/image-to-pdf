"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        // <div>
        //     <h2>Something went wrong!</h2>
        //     <button
        //         onClick={
        //             // Attempt to recover by trying to re-render the segment
        //             () => reset()
        //         }
        //     >
        //         Try again
        //     </button>
        // </div>
        <div className="w-[50%] min-h-screen flex flex-col items-center justify-center m-auto gap-8">
            <div className="flex items-center justify-evenly h-[5rem] w-[30%]">
                <p className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors">Error</p>
                <Separator orientation="vertical" />
                <p className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors">{error.name}</p>
            </div>
            <Separator />
            <p>{error.message}</p>
            <Button onClick={reset}>Try Again</Button>
        </div>
    );
}
