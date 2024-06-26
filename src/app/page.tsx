import Menu from "@/components/main-menu";
import TatanationPDFLogo from "@/components/tatanation-pdf-logo";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import dynamic from "next/dynamic";
import Link from "next/link";

const MainMenu = dynamic(() => import("@/components/main-menu"), {
  ssr: false,
});

export default async function Home() {
  return (
    <main className="w-full min-h-screen">
      <div className="flex items-center justify-evenly gap-8 m-auto h-screen">
        <div className="w-[85%] md:w-[75%] flex flex-col items-end md:items-center justify-center">
          {/* <img src="/Rectangle Logo.svg" className="md:w-[15%] w-[80%] rounded-full" /> */}
          <TatanationPDFLogo />
          <div className="flex flex-col md:flex-row gap-4 w-[70%] md:w-[80%] items-end m-auto">
            <h1
              className="font-bold 
                    text-4xl
                    text-right
                    md:text-right
                    font-inter
                    sm:text-5xl
                    md:text-8xl whitespace-normal
                    bg-clip-text
                    "
            >
              Tatanation PDF
            </h1>
            <span className="md:px-[1px] md:py-[4%] px-[45%] py-[1px] bg-border" />
            {/* <Separator decorative /> */}
            <h2 className="text-2xl sm:text-3xl md:text-5xl w-[30%] font-semibold tracking-tight transition-colors text-right md:text-left">
              Your Simple, PDF Toolkit!
            </h2>
          </div>
          <Separator className="my-4 w-[80%]" decorative />
          <MainMenu />
        </div>
      </div>
    </main>
  );
}
