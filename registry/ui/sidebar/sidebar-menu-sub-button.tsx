import { useRender } from "@base-ui/react/use-render";
import { useSidebarStyles } from "./sidebar-provider";

interface SidebarMenuSubButtonProps extends useRender.ComponentProps<"button"> {
  /** Marks the current item: sets `aria-current="page"` and `data-active`. */
  active?: boolean;
}

export function SidebarMenuSubButton({ className, active, render = <button type="button" />, ...props }: SidebarMenuSubButtonProps) {
  const styles = useSidebarStyles();
  return useRender({
    render,
    props: {
      ...(active && { "aria-current": "page", "data-active": "" }),
      ...props,
      className: styles.menuSubButton({ class: className }),
      "data-slot": "sidebar-menu-sub-button",
    },
  });
}
