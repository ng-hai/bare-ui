import type { ComponentProps } from "react";
import { useSidebarStyles } from "./sidebar-provider";

interface SidebarMenuSubItemProps extends ComponentProps<"li"> {}

export function SidebarMenuSubItem({ className, ...props }: SidebarMenuSubItemProps) {
  const styles = useSidebarStyles();
  return <li {...props} className={styles.menuSubItem({ class: className })} data-slot="sidebar-menu-sub-item" />;
}
