"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const calculateTimeDifference = () => {
    const now = new Date();
    // Calculate the next 00:00 UTC
    const nextMidnightUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
    // Calculate the difference in seconds between now and the next 00:00 UTC
    // @ts-ignore
    const differenceInSeconds = (nextMidnightUTC - now) / 1000;
    return differenceInSeconds;
};

const Footer = () => {
    const [open, setOpen] = useState(true);
    const localTime = new Date();
    const timezoneOffsetInMinutes = localTime.getTimezoneOffset();
    const timezoneOffsetInMilliseconds = timezoneOffsetInMinutes * 60 * 1000;
    const utcTime = new Date(localTime.getTime() - timezoneOffsetInMilliseconds);
    const [timeDifference, setTimeDifference] = useState(calculateTimeDifference());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeDifference(calculateTimeDifference());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTimeDifference = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `All of Your data in the server will be deleted in ${hours} hours ${minutes} minutes ${remainingSeconds} seconds`;
    };

    return (
        <div
            className={cn(
                "fixed inset-x-0 bottom-0 z-10 items-center justify-between p-2 px-4 mx-auto bg-opacity-50 border shadow-lg md:px-6 bg-destructive dark:bg-destructive backdrop-filter backdrop-blur-md",
                open ? "flex" : "hidden"
            )}
        >
            <p>{formatTimeDifference(timeDifference)}</p>
            <Button
                size={"icon"}
                variant={"destructive"}
                className="w-fit h-fit"
                onClick={() => setOpen(false)}
            >
                <Cross2Icon className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default Footer;
