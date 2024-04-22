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

    // Convert the offset from minutes to milliseconds
    const timezoneOffsetInMilliseconds = timezoneOffsetInMinutes * 60 * 1000;

    // Calculate the UTC time
    const utcTime = new Date(
        localTime.getTime() - timezoneOffsetInMilliseconds
    );

    const [timeDifference, setTimeDifference] = useState(
        calculateTimeDifference()
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeDifference(calculateTimeDifference());
        }, 1000); // Update every second

        return () => clearInterval(interval); // Clean up on component unmount
    }, []);

    return (
        <div
            className={cn(
                "fixed inset-x-0 bottom-0 z-10 items-center justify-between p-2 px-4 mx-auto bg-opacity-50 border shadow-lg md:px-6 bg-destructive dark:bg-destructive backdrop-filter backdrop-blur-md",
                open ? "flex" : "hidden"
            )}
        >
            <p>Your data will be deleted in {timeDifference}</p>
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
