import type { ComponentProps } from "react";
import { useSidebarStyles } from "./sidebar-provider";

interface SidebarInsetProps extends ComponentProps<"main"> {}

export function SidebarInset({ className, ...props }: SidebarInsetProps) {
  const styles = useSidebarStyles();
  return <main {...props} className={styles.inset({ class: className })} data-slot="sidebar-inset" />;
}
