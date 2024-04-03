// "use client";
import ProcessConvertCard from "@/components/process-image-to-pdf-card";
import Uploader from "@/components/image-uploader";

import { getImageByID } from "@/server/server-functions";
import Image from "next/image";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { onConvertMultiplePDFPostAction } from "@/server/forms";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PageOrientation, PageSize } from "@/lib/types";
import SubmitButton from "@/components/submit-button";

const MultipleImagesToPDF = async ({
    params,
    searchParams,
}: {
    params: { states: string[] };
    searchParams: { [key: string]: string | string[] | undefined };
}) => {
    // console.log(typeof searchParams["uploaded_image"])
    if (
        searchParams &&
        searchParams["uploaded_image"] &&
        typeof searchParams === "object"
    ) {
        const uploadedImageIds = searchParams["uploaded_image"] as string[];

        return (
            <main className="flex flex-col items-center justify-center min-h-screen gap-8">
                <h1 className="mt-[8rem] font-semibold leading-none tracking-tight">List of Uploaded Images</h1>
                <div className="max-h-fit w-[90%] grid grid-cols-4 gap-8">
                    {uploadedImageIds.map((image_id) => (
                        <Card key={image_id}>
                            <CardHeader>
                                <CardDescription>
                                    The converted image will always be placed at
                                    the center of the document
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="w-[300px] md:w-[400px] h-[300px]">
                                <div className="relative w-full h-full rounded-lg aspect-auto">
                                    <Image
                                        src={image_id}
                                        alt="missing image"
                                        fill
                                        className="object-scale-down"
                                        priority
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <form
                    action={onConvertMultiplePDFPostAction}
                    className="w-[90%] md:max-w-40 flex flex-row justify-around items-end md:flex-col md:items-start md:justify-center gap-2 md:gap-4"
                >
                    <div className="">
                        <Label
                            className="text-xs"
                            htmlFor="page_size"
                        >
                            Page Size
                        </Label>
                        <RadioGroup
                            id="page_size"
                            name="page_size"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={
                                        PageSize.A4 as string
                                    }
                                />
                                <Label className="text-xs">
                                    A4
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={
                                        PageSize.F4 as string
                                    }
                                />
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
                                    value={
                                        PageOrientation.PORTRAIT as string
                                    }
                                />
                                <Label className="text-xs">
                                    Portrait
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={
                                        PageOrientation.LANDSCAPE as string
                                    }
                                />
                                <Label className="text-xs">
                                    Landscape
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <SubmitButton />
                </form>
            </main>
        );
    }
    return (
        <main className="flex flex-col items-center justify-center min-h-screen gap-8">
            <div className="flex flex-col items-center">
                <h1 className="text-2xl font-semibold tracking-tight text-center scroll-m-20">
                    Upload maximum 10 (ten) .jpeg images to our platform to
                    start converting!
                </h1>
            </div>
            <Uploader multiple />
        </main>
    );
};

export default MultipleImagesToPDF;
