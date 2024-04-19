// "use client";
import ProcessConvertCard from "@/components/process-image-to-pdf-card";
import ImageUploader from "@/components/image-uploader";

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
import PDFViewIframe from "@/components/pdf-viewer";
import supabase from "@/lib/supabase";

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

        const convertMultiplePDFWithIds = onConvertMultiplePDFPostAction.bind(
            null,
            uploadedImageIds
        );

        return (
            <main className="flex flex-col items-center justify-center min-h-screen gap-8">
                <h1 className="mt-[8rem] font-semibold leading-none tracking-tight">
                    List of Uploaded Images
                </h1>
                <form
                    action={convertMultiplePDFWithIds}
                    className="flex flex-col items-center justify-center gap-8 mb-8"
                >
                    <div className="max-h-fit w-[90%] grid grid-cols-4 gap-6">
                        {uploadedImageIds.map((image_id) => (
                            <Card key={image_id} className="overflow-hidden">
                                <CardHeader>
                                    <CardDescription>
                                        The converted image will always be
                                        placed at the center of the document
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="w-[300px] md:w-[400px] h-[300px]">
                                    <div className="relative w-full h-[85%] rounded-lg aspect-auto">
                                        <Image
                                            src={image_id}
                                            alt="missing image"
                                            fill
                                            className="object-scale-down"
                                            priority
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <div>
                                            <Label
                                                className="text-xs"
                                                htmlFor={
                                                    "page_size_" + image_id
                                                }
                                            >
                                                Page Size
                                            </Label>
                                            <RadioGroup
                                                className="flex"
                                                id={"page_size_" + image_id}
                                                name={"page_size_" + image_id}
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
                                        <div>
                                            <Label
                                                htmlFor={
                                                    "page_orientation_" +
                                                    image_id
                                                }
                                                className="text-xs"
                                            >
                                                Page Orientation
                                            </Label>
                                            <RadioGroup
                                                className="flex"
                                                id={
                                                    "page_orientation_" +
                                                    image_id
                                                }
                                                name={
                                                    "page_orientation_" +
                                                    image_id
                                                }
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
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <SubmitButton buttonName="Convert Multiple" />
                </form>
            </main>
        );
    }

    if (
        searchParams &&
        searchParams["pdf_res"] &&
        typeof searchParams === "object"
    ) {
        const pdf_id = searchParams["pdf_res"] as string;
        const {
            data: { publicUrl: pdf_url },
        } = supabase.storage.from("pdfs").getPublicUrl(pdf_id);
        return (
            <main className="flex flex-col items-center justify-center min-h-screen gap-8">
                <h1 className="mt-[8rem] scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors">
                    Multiple Images to Single PDF Result:
                </h1>
                <div className="max-h-fit w-[90%] grid grid-cols-1 gap-6">
                    <PDFViewIframe className="w-[90%] md:w-[90%] md:h-[100vh] m-auto" key={pdf_id} pdf_url={pdf_url} />;
                </div>
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
            <ImageUploader multiple />
        </main>
    );
};

export default MultipleImagesToPDF;
