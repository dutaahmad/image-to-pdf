// "use client";
import ProcessConvertCard from "@/components/process-image-to-pdf-card";
import Uploader from "@/components/image-uploader";

import { getImageByID } from "@/server/server-functions";
import supabase from "@/lib/supabase";
import PDFViewIframe from "@/components/pdf-viewer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mergePDFsForm } from "@/server/forms";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PageOrientation, PageSize } from "@/lib/types";
import SubmitButton from "@/components/submit-button";
import { ScrollArea } from "@/components/ui/scroll-area";

const MergePDFs = async ({
    params,
    searchParams,
}: {
    params: { states: string[] };
    searchParams: { [key: string]: string | string[] | undefined };
}) => {
    if (
        searchParams &&
        searchParams["uploaded_source_pdf"] &&
        typeof searchParams === "object"
    ) {
        const pdf_ids = searchParams["uploaded_source_pdf"] as string[];
        const mergePDFFormsWithIDs = mergePDFsForm.bind(null, pdf_ids);
        return (
            <main className="flex flex-col items-center justify-center min-h-screen gap-8">
                <h1 className="mt-[8rem] font-semibold leading-none tracking-tight">
                    List of To Be Merged PDFs
                </h1>
                <div className="max-h-[70vh] w-[90%] flex gap-6 mb-6">
                    {/* <div className="flex-1 bg-red-400"> */}
                    <ScrollArea className="flex-1 rounded-md border">
                        {pdf_ids.map((pdf_id, index) => {
                            const {
                                data: { publicUrl: pdf_url },
                            } = supabase.storage.from("pdfs").getPublicUrl(pdf_id);
                            return (
                                <PDFViewIframe
                                    iFrameTitle={
                                        "(To be Merged) Page " + (index + 1)
                                    }
                                    className="w-[90%] md:w-[90%] mx-auto my-8"
                                    key={pdf_id}
                                    pdf_url={pdf_url}
                                />
                            );
                        })}
                    </ScrollArea>
                    {/* </div> */}
                    <Card className="flex-1">
                        <CardHeader>
                            <CardTitle className="scroll-m-20 border-b pb-2 text-xl md:text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                                Merge Options
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form
                                action={mergePDFFormsWithIDs}
                            // action={async (formData: FormData) => {
                            //     "use server";
                            //     console.log(formData);
                            // }}
                            >
                                {/* {pdf_ids.map((pdf_id, index) => (
                                    <div key={index} className=" flex flex-col justify-center h-full">
                                        <p className="scroll-m-20 border-b pb-2 text-lg font-semibold tracking-tight transition-colors first:mt-0">
                                            Page {index + 1} options :{" "}
                                        </p>
                                        <div className="flex gap-12 md:pb-4">
                                            <div>
                                                <Label
                                                    className="text-xs"
                                                    htmlFor={
                                                        "page_size_" + pdf_id
                                                    }
                                                >
                                                    Page Size
                                                </Label>
                                                <RadioGroup
                                                    className="flex"
                                                    id={"page_size_" + pdf_id}
                                                    name={"page_size_" + pdf_id}
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem
                                                            value={
                                                                PageSize.A4 as string
                                                            }
                                                        />
                                                        <Label className="text-xs">
                                                            A4
                                                        </Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem
                                                            value={
                                                                PageSize.F4 as string
                                                            }
                                                        />
                                                        <Label className="text-xs">
                                                            F4
                                                        </Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                            <div>
                                                <Label
                                                    htmlFor={
                                                        "page_orientation_" +
                                                        pdf_id
                                                    }
                                                    className="text-xs"
                                                >
                                                    Page Orientation
                                                </Label>
                                                <RadioGroup
                                                    className="flex"
                                                    id={
                                                        "page_orientation_" +
                                                        pdf_id
                                                    }
                                                    name={
                                                        "page_orientation_" +
                                                        pdf_id
                                                    }
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem
                                                            value={
                                                                PageOrientation.PORTRAIT as string
                                                            }
                                                        />
                                                        <Label className="text-xs">
                                                            Portrait
                                                        </Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem
                                                            value={
                                                                PageOrientation.LANDSCAPE as string
                                                            }
                                                        />
                                                        <Label className="text-xs">
                                                            Landscape
                                                        </Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                        </div>
                                    </div>
                                ))} */}
                                <SubmitButton buttonName="Merge" />
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        );
    }
    return (
        <main className="flex flex-col items-center justify-center min-h-screen gap-8">
            <div className="flex flex-col items-center">
                <h1 className="text-2xl font-semibold tracking-tight text-center scroll-m-20">
                    Upload maximum 10 (ten) PDF documents to our platform to
                    start merging them!
                </h1>
            </div>
            <Uploader multiple uploaderType="pdf" />
        </main>
    );
};

export default MergePDFs;
