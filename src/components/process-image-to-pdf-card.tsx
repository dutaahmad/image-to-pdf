"use client";
import Image from "next/image";

import { TrashIcon } from "@radix-ui/react-icons";
import { CheckCircle, CircleCheck, Download, FileCheck2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";
import {
    addPDFDocumentData,
    convertToPDF,
    deleteImageByID,
    deletePdfByID,
} from "@/server/server-functions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import supabase from "@/lib/supabase";
import Link from "next/link";

type CardProps = { image_id: string } & React.ComponentProps<typeof Card>;

function ProcessUploadedImage({ image_id, className, ...props }: CardProps) {
    const router = useRouter();
    // setTimeout(() => toast(
    //     <div className="flex gap-8 items-center p-2">
    //         <p className="text-base text-right">Image ready to be converted to PDF.</p>
    //         <CircleCheck className="h-12 w-12" />
    //     </div>,
    //     {
    //         description: <p>{new Date().toLocaleDateString()}</p>,
    //         duration: 3000
    //     }
    // ))
    return (
        <Card
            className={cn(
                "w-[500px] h-[500px] flex flex-col gap-4 items-center",
                className
            )}
            {...props}
        >
            <CardHeader>
                <CardTitle>Uploaded Document</CardTitle>
                <CardDescription>
                    The converted image will always be placed at the center of
                    the document
                </CardDescription>
            </CardHeader>
            <CardContent className="w-[90%] h-[70%] aspect-auto relative">
                <Image
                    src={image_id}
                    alt="missing image"
                    fill
                    className="object-cover rounded-lg"
                    priority
                />
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button
                    className="w-full"
                    variant={"destructive"}
                    onClick={async () => {
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
                                description: (
                                    <p>{new Date().toLocaleDateString()}</p>
                                ),
                                duration: 3000,
                            }
                        );
                    }}
                >
                    <TrashIcon className="mr-2 h-4 w-4" /> Delete
                </Button>
                <Button
                    className="w-full"
                    onClick={async () => {
                        const result = await convertToPDF({
                            image_id: image_id,
                            page_size: "A4",
                            page_orientation: "portrait",
                        });

                        if (result) {
                            const {
                                data: { publicUrl: pdf_url },
                            } = supabase.storage
                                .from("pdfs")
                                .getPublicUrl(result.data.path);
                            await addPDFDocumentData({
                                id: result.data.path,
                                name: "converted-doc-from-" + image_id,
                                url: pdf_url,
                            });
                            toast(
                                <div className="flex flex-col gap-4">
                                    <div className="flex gap-8 items-center p-2">
                                        <p className="text-base text-right">
                                            {result.message}
                                        </p>
                                        <CheckCircle className="h-12 w-12 " />
                                    </div>
                                    <Button onClick={() => window.open(pdf_url)}>
                                        <Download className="h-4 w-4" />{" "}
                                        Download Converted PDF
                                    </Button>
                                    <Button variant={"destructive"} onClick={async () => await deletePdfByID(result.data.path).finally(() => {
                                        toast.error(
                                            <div className="flex gap-8 items-center p-2">
                                                <p className="text-base text-right">
                                                    Your Converted PDF has been deleted.
                                                </p>
                                                <TrashIcon className="h-12 w-12" />
                                            </div>,
                                            {
                                                closeButton: true,
                                                duration: 3000,
                                            }
                                        )
                                    })}>
                                        <TrashIcon className="h-4 w-4" /> Delete
                                        Converted PDF
                                    </Button>
                                </div>
                                // { duration: 3000 }
                                , { closeButton: true }
                            );
                        }
                    }}
                // onClick={convertToPDFRequest}
                >
                    <FileCheck2 className="mr-2 h-4 w-4" /> Convert
                </Button>
            </CardFooter>
        </Card>
    );
}

export default ProcessUploadedImage;
