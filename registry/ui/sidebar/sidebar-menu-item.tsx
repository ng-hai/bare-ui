import type { ComponentProps } from "react";
import { useSidebarStyles } from "./sidebar-provider";

interface SidebarMenuItemProps extends ComponentProps<"li"> {}

export function SidebarMenuItem({ className, ...props }: SidebarMenuItemProps) {
  const styles = useSidebarStyles();
  return <li {...props} className={styles.menuItem({ class: className })} data-slot="sidebar-menu-item" />;
}
