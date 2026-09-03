import type { ComponentProps } from "react";
import { useSidebarStyles } from "./sidebar-provider";

interface SidebarGroupBadgeProps extends ComponentProps<"span"> {}

export function SidebarGroupBadge({ className, ...props }: SidebarGroupBadgeProps) {
  const styles = useSidebarStyles();
  return <span {...props} className={styles.groupBadge({ class: className })} data-slot="sidebar-group-badge" />;
}
