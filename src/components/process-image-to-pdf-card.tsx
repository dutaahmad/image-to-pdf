"use client";
import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";

import { TrashIcon } from "@radix-ui/react-icons";
import { FileCheck2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { deleteImageByID } from "@/server/server-functions";
import { onConvertPDFPostAction } from "@/server/forms";

import { PageOrientation, PageSize } from "@/lib/types";

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
import Spinner from "./spinner";
import { Input } from "./ui/input";
import SubmitButton from "./submit-button";

type CardProps = { image_id: string } & React.ComponentProps<typeof Card>;

function ProcessUploadedImage({ image_id, className, ...props }: CardProps) {
    const convertPDFWithImageId = onConvertPDFPostAction.bind(null, image_id);

    const router = useRouter();
    const [formState, formAction] = useFormState(convertPDFWithImageId, {
        status: false,
        message: "",
        data: { path: "" },
    });

    const handleDeleteImage = async () => {
        await deleteImageByID(image_id);
        toast.error(
            <div className="flex items-center gap-8 p-2">
                <p className="text-base text-right">
                    Your Image has been deleted.
                </p>
                <TrashIcon className="w-12 h-12" />
            </div>,
            {
                description: <p>{new Date().toLocaleDateString()}</p>,
                duration: 3000,
            }
        );
        router.push("/single-image-to-pdf");
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
            <CardContent className="flex flex-col items-center justify-around w-full h-full gap-8 aspect-auto md:flex-row">
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
                    <div className="">
                        <Label className="text-xs" htmlFor="page_size">
                            Page Size
                        </Label>
                        <RadioGroup id="page_size" name="page_size">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value={PageSize.A4 as string} />
                                <Label className="text-xs">A4</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value={PageSize.F4 as string} />
                                <Label className="text-xs">F4</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="">
                        <Label htmlFor="page_orientation" className="text-xs">
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
                    <TrashIcon className="w-4 h-4 mr-2" /> Delete
                </Button>
            </CardFooter>
        </Card>
    );
}

export default ProcessUploadedImage;
