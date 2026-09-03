import type { ComponentProps } from "react";
import { useSidebar, useSidebarStyles } from "./sidebar-provider";

interface SidebarRootProps extends ComponentProps<"aside"> {}

export function SidebarRoot({ className, ...props }: SidebarRootProps) {
  const styles = useSidebarStyles();
  const { open } = useSidebar();
  return (
    <aside
      {...props}
      className={styles.root({ class: className })}
      data-slot="sidebar"
      data-state={open ? "expanded" : "collapsed"}
    />
  );
}
