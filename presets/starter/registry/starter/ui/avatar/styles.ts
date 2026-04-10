import { tv } from "@/lib/tv.config";

export const avatarStyles = tv({
  slots: {
    root: ["relative flex shrink-0 overflow-hidden rounded-full"],
    image: ["aspect-square h-full w-full"],
    fallback: [
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
    ],
  },
  variants: {
    size: {
      sm: { root: "h-8 w-8", fallback: "text-xs" },
      md: { root: "h-10 w-10", fallback: "text-sm" },
      lg: { root: "h-12 w-12", fallback: "text-base" },
      xl: { root: "h-16 w-16", fallback: "text-lg" },
    },
  },
  defaultVariants: {
    size: "md",
  },
});
