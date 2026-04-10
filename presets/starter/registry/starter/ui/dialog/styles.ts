import { tv } from "@/lib/tv.config";

export const dialogStyles = tv({
  slots: {
    root: [""],
    trigger: [""],
    portal: [""],
    backdrop: [
      "fixed inset-0 z-50 bg-black/80",
      "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
      "transition-opacity duration-150",
    ],
    popup: [
      "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2",
      "gap-4 border bg-background p-6 shadow-lg sm:rounded-lg",
      "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
      "data-[ending-style]:opacity-0 data-[ending-style]:scale-95",
      "transition-all duration-150",
    ],
    title: ["text-lg font-semibold leading-none tracking-tight"],
    description: ["text-sm text-muted-foreground"],
    close: [
      "absolute right-4 top-4 rounded-sm opacity-70",
      "hover:opacity-100",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    ],
  },
  variants: {
    size: {
      sm: { popup: "max-w-sm" },
      md: { popup: "max-w-lg" },
      lg: { popup: "max-w-2xl" },
      full: { popup: "max-w-[calc(100vw-2rem)]" },
    },
  },
  defaultVariants: {
    size: "md",
  },
});
