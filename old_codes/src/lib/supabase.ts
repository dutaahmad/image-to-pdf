import { createClient } from "@supabase/supabase-js";

export const SUPABASE_PROJECT_URL = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL!;
export const SUPABASE_PUBLIC_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY!;
export const SUPABASE_SERVICE_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!;

// Create a single supabase client for interacting with your database
const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_PUBLIC_KEY);


export default supabase;
