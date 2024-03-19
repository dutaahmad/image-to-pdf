'use client'
import { Separator } from "@/components/ui/separator"
import { useEffect } from "react"

// Error components must be Client Components

const Error = (
    {
        error,
        reset,
    }: {
        error: Error & { digest?: string }
        reset: () => void
    }
) => {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])
    return (
        <html>
            <body>
                <div className='w-full min-h-screen flex flex-col items-center justify-center'>
                    <div className='flex items-center justify-evenly'>
                        <p>Error</p>
                        <Separator orientation="vertical" />
                        <p>{error.name}</p>
                    </div>
                    <Separator />
                    <p>
                        {error.message}
                    </p>
                </div>
            </body>
        </html>
    )
}

export default Error