import { cn } from "@/lib/utils";

type SpinnerSize = {
    height: number;
    width: number;
};

const Spinner = ({ height, width }: SpinnerSize) => {
    return (
        <div
            className={cn(
                "p-3 animate-spin drop-shadow-2xl bg-gradient-to-bl from-pink-400 via-purple-400 to-indigo-600 aspect-square rounded-full",
                `h-[${height}px]`,
                `w-[${width}px]`,
                `mr-2`
            )}
        >
            <div className="rounded-full h-full w-full bg-slate-100 dark:bg-zinc-900 background-blur-md"></div>
        </div>
    );
};

export default Spinner;
