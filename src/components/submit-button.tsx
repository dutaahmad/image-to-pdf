"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { FileIcon, ReloadIcon } from "@radix-ui/react-icons";

const SubmitButton = ({ buttonName }: { buttonName: string }) => {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" size={"lg"} disabled={pending}>
            {pending ? (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <FileIcon className="w-4 h-4 mr-2" />
            )}{" "}
            {buttonName}
        </Button>
    );
};

export default SubmitButton;
