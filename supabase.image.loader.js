const NEXT_PUBLIC_SUPABASE_PROJECT_URL =
    process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL ||
    "https://teyxwtyylywkvgbzwhoe.supabase.co";

export default function supabaseLoader({ src, width, quality }) {
    return `${NEXT_PUBLIC_SUPABASE_PROJECT_URL}/storage/v1/object/public/images/${src}?width=${width}&quality=${
        quality || 75
    }`;
}
