"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const PDFViewIframe = ({ pdf_url }: { pdf_url: string }) => {
    return (
        <Card
            className={cn(
                "w-[90%] h-[400px] md:h-[500px] md:w-[700px] flex flex-col gap-4 items-center"
            )}
        >
            <CardHeader>
                <CardTitle>PDF Result</CardTitle>
            </CardHeader>
            <CardContent className="w-[98%] h-[98%] rounded-lg aspect-auto relative">
                <iframe
                    src={pdf_url}
                    itemType="application/pdf"
                    className="h-full w-full"
                />
            </CardContent>
        </Card>
    );
};

export default PDFViewIframe;
