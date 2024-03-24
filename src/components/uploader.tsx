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
import { addImageData, generateUUID } from "@/server/server-functions";

function Uploader() {
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

    const onUploadSuccess = async (
        file:
            | UppyFile<Record<string, unknown>, Record<string, unknown>>
            | undefined,
        response: SuccessResponse
    ) => {
        try {
            const { data } = supabase.storage
                .from("images")
                // @ts-ignore
                .getPublicUrl(file?.meta.objectName);
            // await addImageData({
            //     name: file!.name,
            //     url: data.publicUrl
            // })
            const response = await fetch("/api/upload-image", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: file!.name,
                    url: data.publicUrl,
                }),
            });

            if (!response.ok) {
                throw new Error("Error adding image data to database");
            }

            console.log("Image data added successfully. response: ", await response.json());
            uppy.off("upload-success", onUploadSuccess); // Remove listener after success
        } catch (error) {
            console.error(
                "Error happened whil processing storage data to database. Errors : ",
                error
            );
        }
    };

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

    // uppy.on("upload-success", onUploadSuccess);

    const handleUpload = () => {
        setIsThereFile(false);
        console.log("Uploading...");
        const customObjectName = crypto.randomUUID();
        uppy.setFileMeta(uppy.getFiles()[0].id, {
            objectName: customObjectName,
        });
        uppy.upload();
    };

    useEffect(() => {
        uppy.on('upload-success', onUploadSuccess);
        // Tell React to remove the old listener if a different function is passed to the `handleFileUploaded` prop:
        return () => {
            uppy.off('upload-success', onUploadSuccess);
        };
    }, [onUploadSuccess]);

    return (
        <Dialog>
            <DialogTrigger asChild>
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
