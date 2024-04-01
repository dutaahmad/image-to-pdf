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

type CardProps = { image_id: string } & React.ComponentProps<typeof Card>;

const SubmitButton = () => {
    const { pending } = useFormStatus()
    return (
        <Button className="w-full" type="submit" disabled={pending}>
            <FileCheck2 className="mr-2 h-4 w-4" /> Convert
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
            <CardContent className=" aspect-auto flex items-center justify-around gap-8 w-full h-full ">
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
                    className=" w-[30%] flex flex-col gap-4"
                >
                    <Input
                        id="image_id"
                        name="image_id"
                        className="hidden"
                        value={image_id}
                        readOnly
                    />
                    <Label htmlFor="page_size">Page Size</Label>
                    <RadioGroup id="page_size" name="page_size">
                        <div className="flex items-center space-x-2">
                            <Label>A4</Label>
                            <RadioGroupItem value={PageSize.A4 as string} />
                            <Label>F4</Label>
                            <RadioGroupItem value={PageSize.F4 as string} />
                        </div>
                    </RadioGroup>
                    <Label htmlFor="page_orientation">Page Orientation</Label>
                    <RadioGroup id="page_orientation" name="page_orientation">
                        <div className="flex items-center space-x-2">
                            <Label>Portrait</Label>
                            <RadioGroupItem
                                value={PageOrientation.PORTRAIT as string}
                            />
                            <Label>Landscape</Label>
                            <RadioGroupItem
                                value={PageOrientation.LANDSCAPE as string}
                            />
                        </div>
                    </RadioGroup>
                    {/* <Button className="w-full" type="submit">
                        <FileCheck2 className="mr-2 h-4 w-4" /> Convert
                    </Button> */}
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
