"use client";
import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

import { TrashIcon } from "@radix-ui/react-icons";
import { FileCheck2 } from "lucide-react";

import { cn } from "@/lib/utils";
import {
    addPDFDocumentData,
    convertToPDF,
    deleteImageByID,
} from "@/server/server-functions";
import { onConvertPDFPostAction } from "@/server/forms";

import supabase from "@/lib/supabase";

import { ConvertPDFFormState, PageOrientation, PageSize } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Input } from "./ui/input";
import Spinner from "./spinner";

type CardProps = { image_id: string } & React.ComponentProps<typeof Card>;

const SubmitButton = () => {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" size={"sm"} disabled={pending}>
            {pending ? (
                <Spinner height={16} width={16} />
            ) : (
                <FileCheck2 className="mr-2 h-4 w-4" />
            )}{" "}
            Convert
        </Button>
    );
};

function ProcessUploadedImage({ image_id, className, ...props }: CardProps) {
    const router = useRouter();
    const [formState, formAction] = useFormState(onConvertPDFPostAction, {
        status: false,
        message: "",
        data: { path: "" },
    });

    const handleDeleteImage = async () => {
        await deleteImageByID(image_id);
        router.push("/single-image-to-pdf");
        toast.error(
            <div className="flex gap-8 items-center p-2">
                <p className="text-base text-right">
                    Your Image has been deleted.
                </p>
                <TrashIcon className="h-12 w-12" />
            </div>,
            {
                description: <p>{new Date().toLocaleDateString()}</p>,
                duration: 3000,
            }
        );
    };

    const convertPDFRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (formState.status === true) {
            convertPDFRef.current!.reset();
        }
    }, [formState]);

    return (
        <Card
            className={cn(
                "w-[90%] h-[500px] md:w-[900px] md:h-[500px] flex flex-col gap-4 items-center",
                className
            )}
            {...props}
        >
            <CardHeader>
                <CardTitle>Uploaded Image</CardTitle>
                <CardDescription>
                    The converted image will always be placed at the center of
                    the document
                </CardDescription>
            </CardHeader>
            <CardContent className=" aspect-auto flex flex-col md:flex-row items-center justify-around gap-8 w-full h-full ">
                <div className="relative w-[90%] md:w-[60%] h-[100%]">
                    <Image
                        src={image_id}
                        alt="missing image"
                        fill
                        className="object-scale-down rounded-lg"
                        priority
                    />
                </div>

                <form
                    ref={convertPDFRef}
                    action={formAction}
                    className="w-[90%] md:w-[30%] flex flex-row justify-around items-end md:flex-col md:items-start md:justify-center gap-2 md:gap-4"
                >
                    <Input
                        id="image_id"
                        name="image_id"
                        className="hidden"
                        value={image_id}
                        readOnly
                    />
                    <div className="">
                        <Label
                            className="text-xs"
                            htmlFor="page_size"
                        >
                            Page Size
                        </Label>
                        <RadioGroup id="page_size" name="page_size">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value={PageSize.A4 as string} />
                                <Label className="text-xs">
                                    A4
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value={PageSize.F4 as string} />
                                <Label className="text-xs">
                                    F4
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="">
                        <Label
                            htmlFor="page_orientation"
                            className="text-xs"
                        >
                            Page Orientation
                        </Label>
                        <RadioGroup
                            id="page_orientation"
                            name="page_orientation"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={PageOrientation.PORTRAIT as string}
                                />
                                <Label className="text-xs">Portrait</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={PageOrientation.LANDSCAPE as string}
                                />
                                <Label className="text-xs">Landscape</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <SubmitButton />
                </form>
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button
                    className="w-full"
                    variant={"destructive"}
                    onClick={handleDeleteImage}
                >
                    <TrashIcon className="mr-2 h-4 w-4" /> Delete
                </Button>
            </CardFooter>
        </Card>
    );
}

export default ProcessUploadedImage;
