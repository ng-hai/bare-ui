import { tv } from "@/lib/tv.config";

export const checkboxStyles = tv({
  slots: {
    root: [
      "peer h-4 w-4 shrink-0 rounded-sm border border-border cursor-pointer",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[checked]:bg-primary data-[checked]:text-primary-foreground",
    ],
    indicator: ["flex items-center justify-center text-current"],
  },
});
