import Link from "next/link";
import dynamic from "next/dynamic";

import { CreatePost } from "@/app/_components/create-post";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import TatanationPDFLogo from "@/components/tatanation-pdf-logo";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const MainMenu = dynamic(() => import("@/components/main-menu"), {
  ssr: false,
});

export default async function Home() {
  const session = await getServerAuthSession();
  console.log("session", session);
  return (
    <main className="w-full min-h-screen">
      <div className="flex justify-evenly items-center gap-8 m-auto h-screen">
        <div className="flex flex-col justify-center items-end md:items-center w-[85%] md:w-[65%]">
          <TatanationPDFLogo />
          <div className="flex md:flex-row flex-col justify-center items-end gap-4 w-[70%] md:w-[80%]">
            <h1
              className="text-right md:text-right bg-clip-text font-bold font-sans text-4xl sm:text-5xl md:text-7xl whitespace-normal"
            >
              Tatanation PDF
            </h1>
            <span className="px-[45%] md:px-[1px] py-[1px] md:py-[4%] bg-border" />
            {/* <Separator decorative /> */}
            <h2 className="text-right w-[30%] font-semibold text-2xl sm:text-3xl md:text-4xl md:text-left tracking-tight transition-colors">
              Your Simple, PDF Toolkit!
            </h2>
          </div>
          <Separator className="my-4 w-[80%]" decorative />
          {!session ?
            (<Button asChild className="rounded-xl" size={"lg"}>
              <Link href="/api/auth/signin" className="px-10 py-3 font-semibold">Sign in</Link>
            </Button>)
            :
            (<MainMenu />)}
        </div>
      </div>
    </main>
  );
}