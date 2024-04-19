"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { ModeToggle } from "./theme-toggle";
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import { Button } from "./ui/button";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { deleteImageByID, deletePdfByID } from "@/server/server-functions";
import { DemoDisclaimer } from "./demo-disclaimer";
import Loader from "./loader";

const NavbarSimplified = () => {
    const router = useRouter();
    const path = usePathname();
    const params = useParams<{ states: string[] }>();
    const searchParams = useSearchParams();

    const uploadedURLQuery = searchParams.getAll("uploaded_image");

    // const convertedMultiplePdfs = sea

    const pageTitle = path
        .split("/")[1]
        .split("-")
        .map((word) => {
            const firstLetter = word.charAt(0);
            const firstLetterUppercase = firstLetter.toUpperCase();
            const transformedWord =
                word !== "pdf"
                    ? word.replace(firstLetter, firstLetterUppercase)
                    : word.toUpperCase();
            return transformedWord;
        })
        .join(" ");
    if (path.includes("single-image-to-pdf") && params && params.states) {
        const image_id = params.states[0];
        const pdf_id = params.states[1];
        return (
            <Suspense fallback={<Loader />} >
                <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between p-6 px-4 mx-auto bg-opacity-50 border shadow-lg md:px-6 bg-white/40 dark:bg-white/5 backdrop-filter backdrop-blur-md">
                    <Button
                        variant={"ghost"}
                        size={"icon"}
                        type="button"
                        onClick={async () => {
                            await deleteImageByID(image_id);
                            if (pdf_id) await deletePdfByID(pdf_id);
                            router.push("/");
                        }}
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                    </Button>
                    <h1 className="text-lg font-semibold tracking-tight scroll-m-20 md:text-2xl ">
                        {pageTitle}
                    </h1>
                    <ModeToggle />
                </div>
            </Suspense>
        );
    }

    if (uploadedURLQuery) {
        console.log("this is multiple image to pdf page uploadedURLQuery : ", uploadedURLQuery);
        return (
            <Suspense fallback={<Loader />} >
                <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between p-6 px-4 mx-auto bg-opacity-50 border shadow-lg md:px-6 bg-white/40 dark:bg-white/5 backdrop-filter backdrop-blur-md">
                    <Button
                        variant={"ghost"}
                        size={"icon"}
                        type="button"
                        onClick={async () => {
                            for (const image_id of uploadedURLQuery) {
                                await deleteImageByID(image_id);
                                // if (pdf_id) await deletePdfByID(pdf_id);
                            }
                            router.push("/");
                        }}
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                    </Button>
                    <h1 className="text-lg font-semibold tracking-tight scroll-m-20 md:text-2xl ">
                        {pageTitle}
                    </h1>
                    <ModeToggle />
                </div>
            </Suspense>
        );
    }

    if (path !== "/")
        return (
            <Suspense fallback={<Loader />} >
                <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between p-6 px-4 mx-auto bg-opacity-50 border shadow-lg md:px-6 bg-white/40 dark:bg-white/5 backdrop-filter backdrop-blur-md">
                    <Button variant={"ghost"} size={"icon"} asChild>
                        <Link href={"/"}>
                            <ChevronLeftIcon className="w-4 h-4" />
                        </Link>
                    </Button>
                    <h1 className="text-lg font-semibold tracking-tight scroll-m-20 md:text-2xl ">
                        {pageTitle}
                    </h1>
                    <ModeToggle />
                </div>
            </Suspense>
        );
    else
        return (
            <Suspense fallback={<Loader />} >
                <div className="fixed inset-x-4 top-4">
                    <DemoDisclaimer />
                    <div className="flex justify-end">
                        <ModeToggle />
                    </div>
                </div>
            </Suspense>
        );
};

export default NavbarSimplified;
