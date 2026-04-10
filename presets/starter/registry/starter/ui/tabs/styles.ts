import { tv } from "@/lib/tv.config";

export const tabsStyles = tv({
  slots: {
    root: [""],
    list: [
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
    ],
    tab: [
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1",
      "text-sm font-medium transition-all",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[selected]:bg-background data-[selected]:text-foreground data-[selected]:shadow-sm",
    ],
    indicator: [""],
    panel: [
      "mt-2",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    ],
  },
  variants: {
    variant: {
      default: {},
      underline: {
        list: "rounded-none border-b bg-transparent p-0",
        tab: [
          "rounded-none border-b-2 border-transparent",
          "data-[selected]:border-primary data-[selected]:bg-transparent data-[selected]:shadow-none",
        ],
      },
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
