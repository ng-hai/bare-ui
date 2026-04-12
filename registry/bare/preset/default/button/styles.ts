import { tv } from "@/registry/bare/lib/tv.config";

export const buttonStyles = tv({
  slots: {
    root: [
      "inline-flex items-center justify-center gap-2 rounded-default font-medium",
      "transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
      "disabled:pointer-events-none disabled:opacity-50",
    ],
  },
  variants: {
    variant: {
      solid: {
        root: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
      },
      outline: {
        root: "border border-border text-primary hover:bg-primary/10",
      },
      ghost: {
        root: "text-primary hover:bg-primary/10",
      },
      destructive: {
        root: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
      },
    },
    size: {
      sm: { root: "h-8 px-3 text-xs" },
      md: { root: "h-10 px-4 text-sm" },
      lg: { root: "h-12 px-6 text-base" },
    },
  },
  defaultVariants: {
    variant: "solid",
    size: "md",
  },
});
