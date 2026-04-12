import { tv } from "@/lib/tv.config";

export const buttonStyles = tv({
  slots: {
    root: [
      "inline-flex items-center justify-center gap-2 rounded-default text-sm font-medium",
      "transition-colors cursor-pointer",
      "disabled:pointer-events-none disabled:opacity-50",
      "bg-primary text-primary-foreground hover:bg-primary-hover",
      "h-9 px-5 py-2",
    ],
  },
});
