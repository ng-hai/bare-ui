import { tv } from "@/lib/tv.config";

export const popoverStyles = tv({
  slots: {
    root: [""],
    trigger: [""],
    portal: [""],
    backdrop: [""],
    positioner: [""],
    popup: [
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
      "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
      "data-[ending-style]:opacity-0 data-[ending-style]:scale-95",
      "transition-all duration-150",
    ],
    arrow: ["fill-popover stroke-border"],
    title: ["font-medium leading-none"],
    description: ["text-sm text-muted-foreground"],
    close: [
      "absolute right-2 top-2 rounded-sm opacity-70",
      "hover:opacity-100",
    ],
  },
});
