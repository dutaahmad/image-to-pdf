"use client";
import Image from "next/image";

import { TrashIcon } from "@radix-ui/react-icons";
import { FileCheck2 } from "lucide-react";

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
import { convertToPDF, deleteImageByID } from "@/server/server-functions";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase";

type CardProps = { image_id: string } & React.ComponentProps<typeof Card>;

const ProcessUploadedImage = ({ image_id, className, ...props }: CardProps) => {
    const router = useRouter();

    async function convertToPDFRequest() {
        const {
            data: { publicUrl: image_url },
        } = supabase.storage.from("images").getPublicUrl(image_id);
        try {
            const data = await fetch("/api/image-to-pdf", {
                method: "POST",
                body: JSON.stringify({ image_url }),
            });
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }
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
                <CardDescription>The converted image will always be placed at the center of the document</CardDescription>
            </CardHeader>
            <CardContent className="w-[90%] h-[70%] aspect-auto relative">
                <Image
                    src={image_id}
                    alt="missing image"
                    fill
                    className="object-cover rounded-lg"
                />
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button
                    className="w-full"
                    variant={"destructive"}
                    onClick={async () => {
                        await deleteImageByID(image_id);
                        router.push("/single-image-to-pdf");
                    }}
                >
                    <TrashIcon className="mr-2 h-4 w-4" /> Delete
                </Button>
                <Button
                    className="w-full"
                    onClick={async () => await convertToPDF({
                        image_id: image_id,
                        page_size: "A4",
                        page_orientation: "portrait"
                    })}
                // onClick={convertToPDFRequest}
                >
                    <FileCheck2 className="mr-2 h-4 w-4" /> Convert
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ProcessUploadedImage;
