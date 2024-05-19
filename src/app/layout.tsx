import "@/styles/globals.css";

import { Metadata } from "next";
import dynamic from "next/dynamic";

import { GeistSans } from "geist/font/sans";
import clsx from "clsx";

import { ThemeProvider } from "@/components/theme-provider";
import _Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";

const Footer = dynamic(() => import("@/components/footer"), { ssr: false });

import { TRPCReactProvider } from "@/trpc/react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getServerAuthSession } from "@/server/auth";

export const metadata: Metadata = {
  title: "Tatanation PDF",
  description: "Your Simple PDF Toolkit!",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "icon", type: "shortcut", url: "/mstile-150x150.png" },
    { rel: "icon", type: "apple", url: "/apple-touch-icon-152x152.png" }
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="h-full w-full ">
              {children}
            </main>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </TRPCReactProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

const Navbar = async () => {
  const session = await getServerAuthSession();
  return <_Navbar session={session} />
}