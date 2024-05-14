"use client";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import React, { SVGProps, memo, useEffect } from "react";

const TatanationPDFLogo = memo(
    ({
        className = "",
        ...props
    }: {
        className?: string & SVGProps<SVGAElement>;
    }) => {
        const { resolvedTheme } = useTheme();
        const fill = resolvedTheme === "dark" ? "#D9D9D9" : "#000000";
        const firstRectFill = resolvedTheme === "dark" ? "#010101" : "#FFFFFF";
        return (
            <svg
                className={cn("md:w-[15%] rounded-full", className)}
                viewBox="0 0 500 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                {...props}
            >
                {/* <rect
                width="500"
                height="500"
                fill={firstRectFill}
            /> */}
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M230.299 274.734V230.573L157.598 274.734V464.571H230.299L230.299 274.734Z"
                    fill={fill}
                />
                <rect
                    x="50"
                    y="142.424"
                    width="290.805"
                    height="71.908"
                    fill={fill}
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M303 107.908C411.18 122.865 384.426 238.78 311.724 251.724H268.104V323.632H311.724H311.725C474.576 323.631 519.65 60.449 303.001 36M303 107.908H157.598V36L303 36"
                    fill={fill}
                />
            </svg>
        );
    }
);

export default TatanationPDFLogo;
