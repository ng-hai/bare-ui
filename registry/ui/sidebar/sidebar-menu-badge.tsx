import type { ComponentProps } from "react";
import { useSidebarStyles } from "./sidebar-provider";

interface SidebarMenuBadgeProps extends ComponentProps<"span"> {}

export function SidebarMenuBadge({ className, ...props }: SidebarMenuBadgeProps) {
  const styles = useSidebarStyles();
  return <span {...props} className={styles.menuBadge({ class: className })} data-slot="sidebar-menu-badge" />;
}
