"use client";

import React from "react";
import Link from "next/link";
import { ModeToggle } from "./theme-toggle";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { deleteImageByID, deletePdfByID } from "@/server/server-functions";
import { DemoDisclaimer } from "./demo-disclaimer";

const NavbarSimplified = () => {
    const router = useRouter();
    const path = usePathname();
    const params = useParams<{ states: string[] }>();

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
    if (params && params.states) {
        const image_id = params.states[0];
        const pdf_id = params.states[1];
        return (
            <div className="flex justify-between items-center fixed inset-x-4 top-4">
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
                    <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight ">
                    {pageTitle}
                </h1>
                <ModeToggle />
            </div>
        );
    }

    if (path !== "/")
        return (
            <div className="flex justify-between fixed inset-x-4 top-4">
                <Button variant={"ghost"} size={"icon"} asChild>
                    <Link href={"/"}>
                        <ChevronLeftIcon className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight ">
                    {pageTitle}
                </h1>
                <ModeToggle />
            </div>
        );
    else
        return (
            <div className="fixed inset-x-4 top-4">
                <DemoDisclaimer />
                <div className="flex justify-end">
                    <ModeToggle />
                </div>
            </div>
        );
};

export default NavbarSimplified;
