import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";

export default ({ children, tooltipContent }: { children: React.ReactNode, tooltipContent: React.ReactNode | string }) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent>
                {typeof tooltipContent === "string" ? <p>{tooltipContent}</p> : tooltipContent}
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
)