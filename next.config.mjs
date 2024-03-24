/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        // remotePatterns: [
        //     {
        //         protocol: "https",
        //         hostname: NEXT_PUBLIC_SUPABASE_PROJECT_URL,
        //     },
        // ],
        loader: "custom",
        loaderFile: "./supabase.image.loader.js",
    },
};

export default nextConfig;
