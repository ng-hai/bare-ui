import type { ComponentProps } from "react";
import { useSidebarStyles } from "./sidebar-provider";

interface SidebarHeaderProps extends ComponentProps<"div"> {}

export function SidebarHeader({ className, ...props }: SidebarHeaderProps) {
  const styles = useSidebarStyles();
  return <div {...props} className={styles.header({ class: className })} data-slot="sidebar-header" />;
}
