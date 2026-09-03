import type { ComponentProps } from "react";
import { useSidebarStyles } from "./sidebar-provider";

interface SidebarMenuSubProps extends ComponentProps<"ul"> {}

export function SidebarMenuSub({ className, ...props }: SidebarMenuSubProps) {
  const styles = useSidebarStyles();
  return <ul {...props} className={styles.menuSub({ class: className })} data-slot="sidebar-menu-sub" />;
}
