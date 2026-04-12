import { tv } from "@/lib/tv.config";

export const inputStyles = tv({
  slots: {
    root: [
      "flex h-10 w-full rounded-default border-2 border-border bg-surface px-3 py-1 text-sm",
      "transition-colors placeholder:text-muted",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      "disabled:cursor-not-allowed disabled:opacity-50",
    ],
  },
});
