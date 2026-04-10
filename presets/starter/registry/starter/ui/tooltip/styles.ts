import { tv } from "@/lib/tv.config";

export const tooltipStyles = tv({
  slots: {
    root: [""],
    trigger: [""],
    portal: [""],
    positioner: [""],
    popup: [
      "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md",
      "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
      "data-[ending-style]:opacity-0 data-[ending-style]:scale-95",
      "transition-all duration-150",
    ],
    arrow: ["fill-primary"],
  },
});
