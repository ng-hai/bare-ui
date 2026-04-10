import { tv } from "@/lib/tv.config";

export const checkboxStyles = tv({
  slots: {
    root: [
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow-sm",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[checked]:bg-primary data-[checked]:text-primary-foreground",
    ],
    indicator: ["flex items-center justify-center text-current"],
  },
  variants: {
    size: {
      sm: { root: "h-3.5 w-3.5" },
      md: { root: "h-4 w-4" },
      lg: { root: "h-5 w-5" },
    },
  },
  defaultVariants: {
    size: "md",
  },
});
