import { useRender } from "@base-ui/react/use-render";
import { useSidebarStyles } from "./sidebar-provider";

interface SidebarMenuActionProps extends useRender.ComponentProps<"button"> {}

const defaultRender = <button type="button" />;

export function SidebarMenuAction({ className, render = defaultRender, ...props }: SidebarMenuActionProps) {
  const styles = useSidebarStyles();
  return useRender({
    render,
    props: { ...props, className: styles.menuAction({ class: className }), "data-slot": "sidebar-menu-action" },
  });
}
