import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/env";

export const createClient = () =>
    createBrowserClient(
        env.NEXT_PUBLIC_SUPABASE_PROJECT_URL,
        env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY,
    );