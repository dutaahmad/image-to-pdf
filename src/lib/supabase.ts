import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
    process.env.SUPABASE_PROJECT_URL!,
    process.env.SUPABASE_PUBLIC_KEY!,
    {
        global: {
            headers: {
                Authorization: "Bearer " + process.env.SUPABASE_SERVICE_KEY,
            },
        },
    }
);

export default supabase;
