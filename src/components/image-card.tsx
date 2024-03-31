import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import supabase from "@/lib/supabase";
import { cn } from "@/lib/utils";
import Image from "next/image";

type CardProps = { image_id: string } & React.ComponentProps<typeof Card>;

const ImagePreviewCard = async ({
    image_id,
    className,
    ...props
}: CardProps) => {

    const { data: imageBlob, error } = await supabase.storage
        .from("images")
        .download(image_id);
    console.log("data : ", imageBlob);
    console.log("error : ", error);

    if (!error) {
        // const { width, height } = await getImageMetaFromBlob(imageBlob!);
        return (
            <Card
                className={cn(
                    "h-[500px] w-[500px] flex flex-col gap-4 items-center",
                    // `w-[${width}+100px] h-[${height}+100px]`,
                    className
                )}
                {...props}
            >
                <CardHeader>
                    <CardTitle>Source Image</CardTitle>
                </CardHeader>
                <CardContent className="w-[90%] h-[90%] rounded-lg aspect-auto relative">
                    <Image
                        src={image_id}
                        alt="missing image"
                        fill
                        className="object-scale-down"
                        priority
                    />
                </CardContent>
            </Card>
        );
    } else return <h1>Error Retreiving Image Meta Data</h1>
};

export default ImagePreviewCard;
