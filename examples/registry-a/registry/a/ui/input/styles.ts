import { tv } from "@/lib/tv.config";

export const inputStyles = tv({
  slots: {
    root: [
      "flex h-9 w-full rounded-default border border-border bg-surface px-4 py-1 text-sm",
      "transition-colors placeholder:text-muted",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      "disabled:cursor-not-allowed disabled:opacity-50",
    ],
  },
});
