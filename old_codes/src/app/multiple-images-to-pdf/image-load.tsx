"use client";

import React from "react";
import Image from "next/image";
import supabaseLoader from "../../../supabase.image.loader";

type ImageLoadProps = {
    image_id: string;
};

const ImageLoad = ({ image_id }: ImageLoadProps) => {
    return (
        <Image
            src={image_id}
            alt="missing image"
            fill
            className="object-scale-down"
            priority
            loader={supabaseLoader}
        />
    );
};

export default ImageLoad;
