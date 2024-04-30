import React from "react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PageSize, PageOrientation } from "@/lib/types";
import { Label, RadioGroup } from "@radix-ui/react-dropdown-menu";
import { Cross2Icon } from "@radix-ui/react-icons";
import { RadioGroupItem } from "@radix-ui/react-radio-group";
import { index } from "drizzle-orm/mysql-core";
import { GripHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageLoad from "./image-load";
import { useSortable } from "@dnd-kit/sortable";

interface BoardColumnProps {
    image_id: string;
    // tasks: Task[];
    index: number;
    isOverlay?: boolean;
    deleteImage: () => Promise<void>
}

const ImageBoard = ({ image_id, index, isOverlay, deleteImage }: BoardColumnProps) => {

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: image_id,
        data: {
            type: "ImageCard",
            image_id,
        } satisfies { type: "ImageCard", image_id: string },
        attributes: {
            roleDescription: `Page: ${index + 1}`,
        },
    });

    return (
        <Card className="overflow-hidden max-w-[25rem] border-4">
            <CardHeader className="gap-2">
                <div className="flex w-full justify-end">
                    <div className="w-full flex justify-start">
                        <Button size={"icon"} variant={"ghost"}>
                            <GripHorizontal className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button
                        size={"icon"}
                        variant={"destructive"}
                        onClick={deleteImage}
                    >
                        <Cross2Icon className="h-4 w-4" />
                    </Button>
                </div>
                <CardTitle>Page {index + 1}</CardTitle>
                <CardDescription>
                    The converted image will always be placed at the center of
                    the document
                </CardDescription>
            </CardHeader>
            <CardContent className="w-[300px] md:w-[400px] h-[300px]">
                <div className="relative w-full h-[85%] rounded-lg aspect-auto">
                    <ImageLoad image_id={image_id} />
                </div>
                <div className="flex gap-4">
                    <div>
                        <Label
                            className="text-xs"
                        // htmlFor={"page_size_" + image_id}
                        >
                            Page Size
                        </Label>
                        <RadioGroup
                            className="flex"
                            id={"page_size_" + image_id}
                        // name={"page_size_" + image_id}
                        >
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
                    <div>
                        <Label
                            // htmlFor={"page_orientation_" + image_id}
                            className="text-xs"
                        >
                            Page Orientation
                        </Label>
                        <RadioGroup
                            className="flex"
                            id={"page_orientation_" + image_id}
                        // name={"page_orientation_" + image_id}
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
                </div>
            </CardContent>
        </Card>
    );
};

export default ImageBoard;
