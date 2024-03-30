"use client";

import { CircleX, TriangleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { Button } from "./ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";

export function DemoDisclaimer() {
    const [showDisclaimer, setShowDisclaimer] = useState<boolean>(true)
    if (showDisclaimer) return (
        <Alert className="flex gap-4">
            <TriangleAlert className="h-4 w-4" />
            <div className="flex flex-col flex-1">
                <AlertTitle>Disclaimer!</AlertTitle>
                <AlertDescription>
                    This is a work in progress. Bugs, unresponsiveness and rerenders are expected
                </AlertDescription>
            </div>
            <Button variant={"ghost"} onClick={() => setShowDisclaimer(!showDisclaimer)}>
                <Cross2Icon className="h-4 w-4" />
            </Button>
        </Alert>
    ); else return null;
}
