"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { FileCheck2, Loader2 } from "lucide-react";

const SubmitButton = ({ buttonName }: { buttonName: string }) => {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" size={"lg"} disabled={pending}>
            {pending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <FileCheck2 className="w-4 h-4 mr-2" />
            )}{" "}
            {buttonName}
        </Button>
    );
};

export default SubmitButton;
