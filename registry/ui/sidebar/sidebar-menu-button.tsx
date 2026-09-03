import { useRender } from "@base-ui/react/use-render";
import { useSidebarStyles } from "./sidebar-provider";

interface SidebarMenuButtonProps extends useRender.ComponentProps<"button"> {
  /** Marks the current item: sets `aria-current="page"` and `data-active`. */
  active?: boolean;
}

export function SidebarMenuButton({ className, active, render = <button type="button" />, ...props }: SidebarMenuButtonProps) {
  const styles = useSidebarStyles();
  return useRender({
    render,
    props: {
      ...(active && { "aria-current": "page", "data-active": "" }),
      ...props,
      className: styles.menuButton({ class: className }),
      "data-slot": "sidebar-menu-button",
    },
  });
}
