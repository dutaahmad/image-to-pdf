"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import Spinner from "./spinner";
import { FileCheck2 } from "lucide-react";

const SubmitButton = () => {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" size={"sm"} disabled={pending}>
            {pending ? (
                <Spinner height={16} width={16} />
            ) : (
                <FileCheck2 className="w-4 h-4 mr-2" />
            )}{" "}
            Convert
        </Button>
    );
};

export default SubmitButton;
