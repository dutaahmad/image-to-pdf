"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { type Session } from "next-auth";
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import { ChevronLeftIcon, ReloadIcon } from "@radix-ui/react-icons";
import { PowerOff } from "lucide-react";

import { Button } from "./ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";
import { ModeToggle } from "./theme-toggle";
// import { deleteImageByID, deletePdfByID } from "@/server/server-functions";
import TatanationPDFLogo from "./tatanation-pdf-logo";
import TooltipWrapper from "./tooltip-wrapper";

const NavbarSimplified = ({ session }: { session: Session | null }) => {
    const router = useRouter();
    const path = usePathname();
    const params = useParams<{ states: string[] }>();
    const searchParams = useSearchParams();

    const uploadedURLQuery = searchParams.getAll("uploaded_image");

    // if (path === undefined) return null;

    // @ts-ignore
    const pageTitle = path!
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
            <Suspense fallback={<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}>
                <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between p-6 px-4 mx-auto bg-opacity-50 border shadow-lg md:px-6 bg-white/40 dark:bg-white/5 backdrop-filter backdrop-blur-md">
                    <Button
                        variant={"ghost"}
                        size={"icon"}
                        type="button"
                        onClick={async () => {
                            // await deleteImageByID(image_id);
                            // if (pdf_id) await deletePdfByID(pdf_id);
                            // router.push("/");
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

    if (uploadedURLQuery.length > 0) {
        return (
            <Suspense fallback={<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}>
                <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between p-6 px-4 mx-auto bg-opacity-50 border shadow-lg md:px-6 bg-white/40 dark:bg-white/5 backdrop-filter backdrop-blur-md">
                    <Button
                        variant={"ghost"}
                        size={"icon"}
                        type="button"
                        onClick={async () => {
                            for (const image_id of uploadedURLQuery) {
                                // await deleteImageByID(image_id);
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

    if (path !== "/") {
        return (
            <Suspense fallback={<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}>
                <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between p-6 px-4 mx-auto bg-opacity-50 border shadow-lg md:px-6 bg-white/40 dark:bg-white/5 backdrop-filter backdrop-blur-md">
                    <HomeButton />
                    <h1 className="text-lg font-semibold tracking-tight scroll-m-20 md:text-2xl ">
                        {pageTitle}
                    </h1>
                    <ModeToggle />
                </div>
            </Suspense>
        );
    }

    return (
        <Suspense fallback={<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}>
            <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between p-6 px-4 mx-auto bg-opacity-50 border shadow-lg md:px-6 bg-white/40 dark:bg-white/5 backdrop-filter backdrop-blur-md">
                <HomeButton />
                <div className="flex justify-end flex-1 gap-4">
                    {session && (<SignOutButton />)}
                    <ModeToggle />
                </div>
            </div>
        </Suspense>
    );
};

const HomeButton = () => (
    <TooltipWrapper tooltipContent="Home">
        <Button variant={"ghost"} size={"icon"} asChild>
            <Link href={"/"}>
                <TatanationPDFLogo className="w-8 md:w-8" />
            </Link>
        </Button>
    </TooltipWrapper>
)

const SignOutButton = () => {

    return (
        <TooltipWrapper tooltipContent="Sign out">
            <Button variant={"ghost"} size={"icon"} asChild>
                <Link href={"/api/auth/signout"}>
                    <PowerOff className="w-8 md:w-8" />
                </Link>
            </Button>
        </TooltipWrapper>
    )
}

export default NavbarSimplified;
