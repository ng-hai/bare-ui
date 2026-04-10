import { tv } from "@/lib/tv.config";

export const buttonStyles = tv({
  slots: {
    root: [
      "inline-flex items-center justify-center gap-2 whitespace-nowrap",
      "rounded-md text-sm font-medium transition-colors",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
      "disabled:pointer-events-none disabled:opacity-50",
    ],
  },
  variants: {
    variant: {
      solid: {
        root: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
      },
      outline: {
        root: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
      },
      ghost: {
        root: "hover:bg-accent hover:text-accent-foreground",
      },
      link: {
        root: "text-primary underline-offset-4 hover:underline",
      },
    },
    size: {
      sm: { root: "h-8 rounded-md px-3 text-xs" },
      md: { root: "h-9 px-4 py-2" },
      lg: { root: "h-10 rounded-md px-6 text-base" },
      icon: { root: "h-9 w-9" },
    },
  },
  defaultVariants: {
    variant: "solid",
    size: "md",
  },
});
