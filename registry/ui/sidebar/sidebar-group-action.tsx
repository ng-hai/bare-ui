import { useRender } from "@base-ui/react/use-render";
import { useSidebarStyles } from "./sidebar-provider";

interface SidebarGroupActionProps extends useRender.ComponentProps<"button"> {}

export function SidebarGroupAction({ className, render = <button type="button" />, ...props }: SidebarGroupActionProps) {
  const styles = useSidebarStyles();
  return useRender({
    render,
    props: { ...props, className: styles.groupAction({ class: className }), "data-slot": "sidebar-group-action" },
  });
}
