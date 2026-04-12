import { tv } from "@/lib/tv.config";

export const switchStyles = tv({
  slots: {
    root: [
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-default",
      "border-2 border-transparent shadow-sm transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "bg-muted data-[checked]:bg-primary",
    ],
    thumb: [
      "pointer-events-none block h-4 w-4 rounded-default bg-surface shadow-lg ring-0",
      "transition-transform data-[checked]:translate-x-4 data-[unchecked]:translate-x-0",
    ],
  },
});
