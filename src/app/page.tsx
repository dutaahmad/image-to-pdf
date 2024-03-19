import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="w-full min-h-screen">
      <div className="flex items-center justify-evenly gap-8 m-auto h-screen">
        <div className="w-[45%] flex flex-col items-center justify-center">
          <div className="flex gap-4 w-full items-center">
            <h1
              className="font-bold
                    text-4xl
                    text-right
                    font-inter
                    sm:text-5xl
                    md:text-7xl whitespace-normal
                    bg-clip-text
                    "
            >
              Tatanation PDF
            </h1>
            <span className="px-[1px] py-[5rem] bg-border" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight transition-colors text-left">
              Your Simple PDF Toolkit!
            </h2>
          </div>
          <Separator className="my-4" decorative />
          <div className="flex gap-4 items-end justify-evenly w-full h-8 ">
            <Link href="/single-image-to-pdf">
              <h2 className="scroll-m-20 text-2xl font-light tracking-tight transition-colors">
                Single Image to PDF
              </h2>
            </Link>
            <Separator orientation="vertical" decorative />
            <Link href="/multiple-image-to-pdf">
              <h2 className="scroll-m-20 text-2xl font-light tracking-tight transition-colors">
                Multiple Images to PDF
              </h2>
            </Link>
            <Separator orientation="vertical" decorative />
            <Link href="/merge-pdfs">
              <h2 className="scroll-m-20 text-2xl font-light tracking-tight transition-colors">
                Merge PDFs
              </h2>
            </Link>
            <Separator orientation="vertical" decorative />
            {/* <Link href="/compress-pdf"> */}
            <h2 className="scroll-m-20 text-2xl font-light tracking-tight transition-colors">
              Compress PDF <Badge variant={"secondary"}>Soon</Badge>
            </h2>
            {/* </Link> */}
          </div>
        </div>
        {/* <Separator orientation="vertical" decorative />
        <DiceCube modelURL={diceURL} /> */}
        {/* <DiceCube dice /> */}
      </div>
    </main>
  );
}
