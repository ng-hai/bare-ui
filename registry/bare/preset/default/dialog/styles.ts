import { tv } from "@/registry/bare/lib/tv.config";

export const dialogStyles = tv({
  slots: {
    root: [""],
    trigger: [""],
    portal: [""],
    backdrop: ["fixed inset-0 bg-overlay transition-opacity"],
    popup: [
      "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
      "bg-surface text-surface-foreground rounded-lg shadow-lg",
      "w-full max-w-md p-6",
    ],
    viewport: [""],
    title: ["text-lg font-semibold text-surface-foreground"],
    description: ["mt-2 text-sm text-muted-foreground"],
    close: [""],
    closeButton: [
      "absolute top-4 right-4 inline-flex items-center justify-center",
      "rounded-sm size-6 text-muted-foreground hover:text-surface-foreground",
      "transition-colors",
    ],
  },
});
