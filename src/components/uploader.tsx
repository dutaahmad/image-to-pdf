"use client";

import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Tus from "@uppy/tus";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

import { CopyIcon } from "@radix-ui/react-icons";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
    SUPABASE_PROJECT_URL,
    SUPABASE_PUBLIC_KEY,
    SUPABASE_SERVICE_KEY,
} from "@/lib/supabase";

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
            },
            chunkSize: 6 * 1024 * 1024,
        })
    );

    uppy.on("file-added", (files) => {
        files.meta = {
            ...files.meta,
            // name: ,
            bucketName: "images",
            contentType: files.type,
        };
        setIsThereFile(true);
    });

    uppy.on("file-removed", () => {
        setIsThereFile(false);
    });

    uppy.on("upload-error", (file, error) => {
        console.log("Upload Error : ", error);
    });

    uppy.on("upload-success", (file, response) => {
        console.log("Upload Success : ", {
            file,
            response,
        });
    });

    const handleUpload = () => {
        console.log("uploading...");

        uppy.setFileMeta(uppy.getFiles()[0].id, {
            objectName: uppy.getFiles()[0].id,
        });
        uppy.upload();
    };

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
