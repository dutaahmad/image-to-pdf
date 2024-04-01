"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const PDFViewIframe = ({ pdf_url }: { pdf_url: string }) => {
    return (
        <Card
            className={cn(
                "w-[90%] h-[400px] md:h-[80vh] md:w-[60%] flex flex-col gap-4"
            )}
        >
            <CardHeader>
                <CardTitle className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                    PDF Result
                </CardTitle>
            </CardHeader>
            <CardContent className="w-[98%] h-[98%] aspect-auto relative">
                <iframe
                    src={pdf_url}
                    itemType="application/pdf"
                    className="h-full w-full rounded-lg"
                />
            </CardContent>
        </Card>
    );
};

export default PDFViewIframe;
