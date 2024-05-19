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
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getServerAuthSession();
  return (
    <main className="w-full min-h-screen">
      <div className="flex items-center justify-evenly gap-8 m-auto h-screen">
        <div className="w-[85%] md:w-[65%] flex flex-col items-end md:items-center justify-center">
          {/* <img src="/Rectangle Logo.svg" className="md:w-[15%] w-[80%] rounded-full" /> */}
          <TatanationPDFLogo />
          <div className="flex flex-col md:flex-row gap-4 w-[70%] md:w-[80%] items-end justify-center">
            <h1
              className="font-bold 
                    text-4xl
                    text-right
                    md:text-right
                    font-sans
                    sm:text-5xl
                    md:text-7xl whitespace-normal
                    bg-clip-text
                    "
            >
              Tatanation PDF
            </h1>
            <span className="md:px-[1px] md:py-[4%] px-[45%] py-[1px] bg-border" />
            {/* <Separator decorative /> */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl w-[30%] font-semibold tracking-tight transition-colors text-right md:text-left">
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

async function T3Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="https://create.t3.gg/en/usage/first-steps"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">First Steps →</h3>
            <div className="text-lg">
              Just the basics - Everything you need to know to set up your
              database and authentication.
            </div>
          </Link>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
            href="https://create.t3.gg/en/introduction"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">Documentation →</h3>
            <div className="text-lg">
              Learn more about Create T3 App, the libraries it uses, and how to
              deploy it.
            </div>
          </Link>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {hello ? hello.greeting : "Loading tRPC query..."}
          </p>

          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
              {session && <span>Logged in as {session.user?.name}</span>}
            </p>
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              {session ? "Sign out" : "Sign in"}
            </Link>
          </div>
        </div>

        <CrudShowcase />
      </div>
    </main>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestPost = await api.post.getLatest();

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}
