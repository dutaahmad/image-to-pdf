"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const PDFViewIframe = ({ pdf_url, className = "", iFrameTitle = "PDF Result" }: { pdf_url: string, className?: string, iFrameTitle?: string }) => {
    return (
        <Card
            className={cn(
                "h-[70vh] md:h-[80vh] md:w-[60%] flex flex-col gap-4", className
            )}
        >
            <CardHeader>
                <CardTitle className="scroll-m-20 border-b pb-2 text-xl md:text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                    {iFrameTitle}
                </CardTitle>
            </CardHeader>
            <CardContent className="w-[98%] h-[98%] aspect-auto relative">
                <iframe
                    src={pdf_url}
                    itemType="application/pdf"
                    className="h-full w-full rounded-sm md:rounded-lg"
                />
            </CardContent>
        </Card>
    );
};

export default PDFViewIframe;
