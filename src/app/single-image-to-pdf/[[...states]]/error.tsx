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
        <div className="w-full min-h-screen flex flex-col items-center justify-center">
            <div className="flex items-center justify-evenly">
                <p>Error</p>
                <Separator orientation="vertical" />
                <p>{error.name}</p>
            </div>
            <Separator />
            <p>{error.message}</p>
            <Button onClick={reset}>Try Again</Button>
        </div>
    );
}
