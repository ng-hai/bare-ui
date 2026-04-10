import { tv } from "@/lib/tv.config";

export const inputStyles = tv({
  slots: {
    root: [
      "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1",
      "text-sm shadow-sm transition-colors",
      "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
      "placeholder:text-muted-foreground",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
      "disabled:cursor-not-allowed disabled:opacity-50",
    ],
  },
  variants: {
    size: {
      sm: { root: "h-8 px-2 text-xs" },
      md: { root: "h-9 px-3" },
      lg: { root: "h-10 px-4 text-base" },
    },
  },
  defaultVariants: {
    size: "md",
  },
});
