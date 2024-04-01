"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { useWindowDimensions } from "@/lib/client-utils";

export default function Menu() {
    if (window) {
        const { height, width } = useWindowDimensions();
        if (width >= 450)
            return (
                <div className="flex gap-4 items-end justify-evenly w-full h-8 ">
                    <Link href="/single-image-to-pdf">
                        <h2 className="scroll-m-20 text-2xl font-light tracking-tight transition-colors">
                            Single Image to PDF
                        </h2>
                    </Link>
                    <Separator orientation="vertical" decorative />
                    <Link href="/multiple-images-to-pdf">
                        <h2 className="scroll-m-20 text-2xl font-light tracking-tight transition-colors">
                            Multiple Images to PDF
                        </h2>
                    </Link>
                    <Separator orientation="vertical" decorative />
                    <Link href="/merge-pdfs">
                        <h2 className="scroll-m-20 text-2xl font-light tracking-tight transition-colors">
                            Merge PDFs
                        </h2>
                    </Link>
                    <Separator orientation="vertical" decorative />
                    {/* <Link href="/compress-pdf"> */}
                    <h2 className="scroll-m-20 text-2xl font-light tracking-tight transition-colors">
                        Compress PDF <Badge variant={"secondary"}>Soon</Badge>
                    </h2>
                    {/* </Link> */}
                </div>
            );
    }
    return (
        <div className="flex flex-col gap-4 items-end justify-evenly w-full ">
            <Link href="/single-image-to-pdf">
                <h2 className=" text-base text-right font-light tracking-tight transition-colors">
                    Single Image to PDF
                </h2>
            </Link>
            <Separator decorative />
            <Link href="/multiple-images-to-pdf">
                <h2 className=" text-base text-right font-light tracking-tight transition-colors">
                    Multiple Images to PDF
                </h2>
            </Link>
            <Separator decorative />
            <Link href="/merge-pdfs">
                <h2 className=" text-base text-right font-light tracking-tight transition-colors">
                    Merge PDFs
                </h2>
            </Link>
            <Separator decorative />
            {/* <Link href="/compress-pdf"> */}
            <h2 className=" text-base text-right font-light tracking-tight transition-colors">
                Compress PDF <Badge variant={"secondary"}>Soon</Badge>
            </h2>
            {/* </Link> */}
        </div>
    );
}
