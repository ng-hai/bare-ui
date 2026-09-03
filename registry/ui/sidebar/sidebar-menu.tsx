import type { ComponentProps } from "react";
import { useSidebarStyles } from "./sidebar-provider";

interface SidebarMenuProps extends ComponentProps<"ul"> {}

export function SidebarMenu({ className, ...props }: SidebarMenuProps) {
  const styles = useSidebarStyles();
  return <ul {...props} className={styles.menu({ class: className })} data-slot="sidebar-menu" />;
}
