"use client";
import { useCallback, useEffect, useState } from "react";
import { DialogProps } from "@radix-ui/react-dialog";
import { CircleCheck, Cross } from "lucide-react";

import Uppy, {
    type UppyFile,
    type SuccessResponse,
    type UploadResult,
} from "@uppy/core";
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
import supabase, {
    SUPABASE_PROJECT_URL,
    SUPABASE_PUBLIC_KEY,
    SUPABASE_SERVICE_KEY,
} from "@/lib/supabase";
import { addImageData } from "@/server/server-functions";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

type UploaderProps = { multiple?: boolean };

function Uploader({ multiple = false }: UploaderProps) {
    const { states } = useParams<{ states: string[] }>();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isThereFile, setIsThereFile] = useState<boolean>(false);
    const [uppy] = useState(() =>
        new Uppy({
            restrictions: {
                maxNumberOfFiles: multiple ? 10 : 1,
                maxFileSize: 5 * 1024 * 1024,
                allowedFileTypes: ["image/jpg", "image/jpeg"],
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

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);

            return params.toString();
        },
        [searchParams]
    );

    uppy.on("file-added", (file) => {
        file.meta = {
            ...file.meta,
            bucketName: "images",
            contentType: file.type,
        };
        setIsThereFile(true);
    });

    uppy.on("file-removed", () => {
        setIsThereFile(false);
    });

    const onSingleUploadSuccess = async (
        file:
            | UppyFile<Record<string, unknown>, Record<string, unknown>>
            | undefined,
        response: SuccessResponse
    ) => {
        try {
            // @ts-ignore
            const fileObjectName: string = file?.meta.objectName;
            const { data } = supabase.storage
                .from("images")
                .getPublicUrl(fileObjectName);
            await addImageData({
                id: fileObjectName,
                name: file!.name,
                url: data.publicUrl,
            });
            toast(
                <div className="flex gap-8 items-center p-2">
                    <p className="text-base text-right">
                        Image ready to be converted to PDF.
                    </p>
                    <CircleCheck className="h-12 w-12" />
                </div>,
                {
                    description: <p>{new Date().toLocaleDateString()}</p>,
                    duration: 3000,
                }
            );
            router.push(`/single-image-to-pdf/${fileObjectName}`);
        } catch (error) {
            console.error(
                "Error happened while processing storage data to database. Errors : ",
                error
            );
            toast.error(
                <div className="flex gap-4">
                    <p>
                        Error happened while processing storage data to
                        database!
                    </p>
                    <Cross className="h-4 w-4" />
                </div>,
                {
                    description: new Date().toLocaleDateString(),
                }
            );
        }
    };

    const onUploadsComplete = async (
        result: UploadResult<Record<string, unknown>, Record<string, unknown>>
    ) => {
        try {
            const files = result.successful;
            const filesQueryStringArray: string[] = [];
            for (const file of files) {
                // @ts-ignore
                const fileObjectName: string = file.meta.objectName;
                const { data } = supabase.storage
                    .from("images")
                    .getPublicUrl(fileObjectName);
                await addImageData({
                    id: fileObjectName,
                    name: file!.name,
                    url: data.publicUrl,
                });
                toast(
                    <div className="flex gap-8 items-center p-2">
                        <p className="text-base text-right">
                            Image {fileObjectName} ready to be converted to PDF.
                        </p>
                        <CircleCheck className="h-12 w-12" />
                    </div>,
                    {
                        description: <p>{new Date().toLocaleDateString()}</p>,
                        duration: 3000,
                    }
                );
                const fileQueryString =
                    createQueryString("file", fileObjectName) + "&";
                filesQueryStringArray.push(fileQueryString);
            }
            const filesQueryString = filesQueryStringArray.join("");
            toast(
                <div className="flex gap-8 items-center p-2">
                    <p className="text-base text-right">
                        Images ready to be converted to PDF. Redirecting to
                        convert page...
                    </p>
                    <CircleCheck className="h-12 w-12" />
                </div>,
                {
                    description: <p>{new Date().toLocaleDateString()}</p>,
                    duration: 3000,
                }
            );
            router.push("/multiple-images-to-pdf?" + filesQueryString);
        } catch (error) {
            console.error(
                "Error happened while processing storage data to database. Errors : ",
                error
            );
            toast.error(
                <div className="flex gap-4">
                    <p>
                        Error happened while processing storage data to
                        database!
                    </p>
                    <Cross className="h-4 w-4" />
                </div>,
                {
                    description: new Date().toLocaleDateString(),
                }
            );
        }
    };

    const handleUpload = () => {
        setIsThereFile(false);
        if (multiple) {
            const files = uppy.getFiles();
            for (const file of files) {
                const customObjectName = crypto.randomUUID();
                uppy.setFileMeta(file.id, {
                    objectName: customObjectName,
                });
                uppy.upload();
            }
        } else {
            const customObjectName = crypto.randomUUID();
            uppy.setFileMeta(uppy.getFiles()[0].id, {
                objectName: customObjectName,
            });
            uppy.upload();
        }
    };

    useEffect(() => {
        if (multiple) {
            uppy.on("complete", onUploadsComplete);
            return () => {
                uppy.off("complete", onUploadsComplete);
            };
        } else {
            uppy.on("upload-success", onSingleUploadSuccess);
            // Tell React to remove the old listener if a different function is passed to the `handleFileUploaded` prop:
            return () => {
                uppy.off("upload-success", onSingleUploadSuccess);
            };
        }
    }, [onSingleUploadSuccess, onUploadsComplete]);

    return (
        <Dialog>
            <DialogTrigger asChild disabled={!!states}>
                <Button>Upload</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-w-sm">
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
