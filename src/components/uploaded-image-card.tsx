"use client";

import { TrashIcon } from "@radix-ui/react-icons";
import Image from "next/image";

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
import { deleteImageByID } from "@/server/server-functions";
import { useRouter } from "next/navigation";

type CardProps = { image_id: string } & React.ComponentProps<typeof Card>;

export const UploadedImageCard = ({
    image_id,
    className,
    ...props
}: CardProps) => {
    const router = useRouter();
    return (
        <Card className={cn("w-[500px]", className)} {...props}>
            <CardHeader>
                <CardTitle>Uploaded Document</CardTitle>
            </CardHeader>
            <CardContent className="gap-4 flex">
                {/* <div className=" flex items-center space-x-4 rounded-md border p-4">
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                        Push Notifications
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Send notifications to device.
                    </p>
                </div>
            </div>
            <div>
                Card Main Content
            </div> */}
                <Image
                    src={image_id}
                    alt="missing image"
                    width={500}
                    height={300}
                // fill
                />
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    variant={"destructive"}
                    onClick={async () => {
                        await deleteImageByID(image_id)
                        router.push("/single-image-to-pdf")
                    }}
                >
                    <TrashIcon className="mr-2 h-4 w-4" /> Delete
                </Button>
            </CardFooter>
        </Card>
    );
};
