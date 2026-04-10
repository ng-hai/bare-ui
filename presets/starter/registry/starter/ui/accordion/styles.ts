import { tv } from "@/lib/tv.config";

export const accordionStyles = tv({
  slots: {
    root: [""],
    item: ["border-b"],
    header: ["flex"],
    trigger: [
      "flex flex-1 items-center justify-between py-4 text-sm font-medium",
      "transition-all hover:underline",
      "[&[data-panel-open]>svg]:rotate-180",
    ],
    panel: [
      "overflow-hidden text-sm",
      "data-[starting-style]:h-0 data-[ending-style]:h-0",
      "transition-all duration-200",
    ],
  },
});
