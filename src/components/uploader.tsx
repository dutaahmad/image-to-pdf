"use client";

import Uppy, { type UppyFile, type SuccessResponse } from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Tus from "@uppy/tus";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import supabase, {
    SUPABASE_PROJECT_URL,
    SUPABASE_PUBLIC_KEY,
    SUPABASE_SERVICE_KEY,
} from "@/lib/supabase";
import { addImageData } from "@/server/server-functions";
import { useParams, useRouter } from "next/navigation";

function Uploader() {
    const { states } = useParams<{ states: string[] }>()
    const router = useRouter();
    const [isThereFile, setIsThereFile] = useState<boolean>(false);
    const [uppy] = useState(() =>
        new Uppy({
            restrictions: {
                maxNumberOfFiles: 1,
                maxFileSize: 5 * 1024 * 1024,
                allowedFileTypes: ["image/*"],
            },
        }).use(Tus, {
            endpoint: SUPABASE_PROJECT_URL + "/storage/v1/upload/resumable",
            allowedMetaFields: [
                "bucketName",
                "objectName",
                "contentType",
                "cacheControl",
            ],
            onBeforeRequest: async (req, file) => {
                req.setHeader(
                    "Authorization",
                    `Bearer ${SUPABASE_SERVICE_KEY}`
                );
                req.setHeader("apikey", SUPABASE_PUBLIC_KEY);
            },
            chunkSize: 6 * 1024 * 1024,
        })
    );

    uppy.on("file-added", (files) => {
        files.meta = {
            ...files.meta,
            bucketName: "images",
            contentType: files.type,
        };
        setIsThereFile(true);
    });

    uppy.on("file-removed", () => {
        setIsThereFile(false);
    });

    const onUploadSuccess = async (
        file:
            | UppyFile<Record<string, unknown>, Record<string, unknown>>
            | undefined,
        response: SuccessResponse
    ) => {
        try {
            // @ts-ignore
            const fileObjectName: string = file?.meta.objectName
            const { data } = supabase.storage
                .from("images")
                .getPublicUrl(fileObjectName);
            const response = await addImageData({
                id: fileObjectName,
                name: file!.name,
                url: data.publicUrl,

            });
            router.push(`/single-image-to-pdf/${fileObjectName}`)
            console.log("Image data added successfully. response: ", response);

        } catch (error) {
            console.error(
                "Error happened whil processing storage data to database. Errors : ",
                error
            );
        }
    };

    const handleUpload = () => {
        setIsThereFile(false);
        console.log("Uploading...");
        const customObjectName = crypto.randomUUID();
        uppy.setFileMeta(uppy.getFiles()[0].id, {
            objectName: customObjectName,
        });
        uppy.upload();
    };

    console.log("current params.states : ", states);

    useEffect(() => {
        uppy.on("upload-success", onUploadSuccess);
        // Tell React to remove the old listener if a different function is passed to the `handleFileUploaded` prop:
        return () => {
            uppy.off("upload-success", onUploadSuccess);
        };
    }, [onUploadSuccess]);

    return (
        <Dialog>
            <DialogTrigger asChild disabled={!!states}>
                <Button>Upload</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Upload Image</DialogTitle>
                    <DialogDescription>
                        Upload your desired image to be converted to PDF.
                    </DialogDescription>
                </DialogHeader>
                <div className="w-full space-y-[1rem]">
                    <Dashboard uppy={uppy} hideUploadButton />
                    <Button
                        onClick={handleUpload}
                        type="button"
                        className="w-full"
                        disabled={!isThereFile}
                    >
                        Upload
                    </Button>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default Uploader;
