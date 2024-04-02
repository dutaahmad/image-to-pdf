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

    if (!error) {
        return (
            <Card
                className={cn(
                    "h-[250px] md:w-full md:h-[300px] flex flex-col gap-4",
                    // `w-[${width}+100px] h-[${height}+100px]`,
                    className
                )}
                {...props}
            >
                <CardHeader>
                    <CardTitle className="scroll-m-20 border-b pb-2 text-base md:text-xl font-semibold tracking-tight transition-colors first:mt-0">Source Image</CardTitle>
                </CardHeader>
                {/* <CardContent className="w-[90%] h-[90%] rounded-lg aspect-auto relative overflow-scroll">
                    <Image
                        src={image_id}
                        alt="missing image"
                        fill
                        className="object-cover"
                        priority
                    />
                </CardContent> */}
                <CardContent className="w-full h-full rounded-lg aspect-auto relative overflow-hidden flex items-center justify-center">
                    <div className="w-[90%] h-[90%] overflow-scroll">
                        <Image
                            src={image_id}
                            alt="missing image"
                            className="object-cover"
                            width={1000} // Set a large width and height to render the full image size
                            height={1000}
                            priority
                        />
                    </div>
                </CardContent>
            </Card>
        );
    } else return <h1>Error Retreiving Image Meta Data</h1>;
};

export default ImagePreviewCard;
