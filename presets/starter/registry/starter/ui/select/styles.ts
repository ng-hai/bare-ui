import { tv } from "@/lib/tv.config";

export const selectStyles = tv({
  slots: {
    root: [""],
    trigger: [
      "flex h-9 w-full items-center justify-between gap-2 whitespace-nowrap",
      "rounded-md border border-input bg-transparent px-3 py-2",
      "text-sm shadow-sm",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
      "disabled:cursor-not-allowed disabled:opacity-50",
    ],
    value: ["truncate"],
    icon: ["flex h-4 w-4 shrink-0 opacity-50"],
    portal: [""],
    backdrop: [""],
    positioner: [""],
    popup: [
      "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
      "p-1",
    ],
    item: [
      "relative flex w-full cursor-default select-none items-center gap-2",
      "rounded-sm px-2 py-1.5 text-sm outline-none",
      "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    ],
    itemText: [""],
    itemIndicator: ["flex h-3.5 w-3.5 items-center justify-center"],
    group: [""],
    groupLabel: ["px-2 py-1.5 text-xs font-semibold text-muted-foreground"],
    arrow: [""],
    separator: ["-mx-1 my-1 h-px bg-muted"],
  },
  variants: {
    size: {
      sm: { trigger: "h-8 px-2 text-xs" },
      md: { trigger: "h-9 px-3" },
      lg: { trigger: "h-10 px-4 text-base" },
    },
  },
  defaultVariants: {
    size: "md",
  },
});
