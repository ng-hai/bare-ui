import { useRender } from "@base-ui/react/use-render";
import { useSidebarStyles } from "./sidebar-provider";

interface SidebarGroupActionProps extends useRender.ComponentProps<"button"> {}

const defaultRender = <button type="button" />;

export function SidebarGroupAction({ className, render = defaultRender, ...props }: SidebarGroupActionProps) {
  const styles = useSidebarStyles();
  return useRender({
    render,
    props: { ...props, className: styles.groupAction({ class: className }), "data-slot": "sidebar-group-action" },
  });
}
