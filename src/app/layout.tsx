import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from '@vercel/speed-insights/next';

import "./globals.css";
import clsx from "clsx";
import { ThemeProvider } from "@/components/theme-provider";
import NavbarSimplified from "@/components/navbar-simplified";
import { Toaster } from "@/components/ui/sonner";
import dynamic from "next/dynamic";
// import Footer from "@/components/footer";

const Footer = dynamic(() => import("@/components/footer"), { ssr: false })

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tatanation PDF",
  description: "Your Simple PDF Toolkit!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(inter.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavbarSimplified />
          <main className="h-full w-full ">
            {children}
          </main>
          <Footer />
          <Toaster />
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
