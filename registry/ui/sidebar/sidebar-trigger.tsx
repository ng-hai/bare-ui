import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { useSidebar, useSidebarStyles } from "./sidebar-provider";

interface SidebarTriggerProps extends useRender.ComponentProps<"button"> {}

export function SidebarTrigger({ className, render = <button type="button" />, ...props }: SidebarTriggerProps) {
  const styles = useSidebarStyles();
  const { open, toggle } = useSidebar();
  return useRender({
    render,
    props: {
      ...mergeProps<"button">({ onClick: toggle, "aria-expanded": open }, props),
      className: styles.trigger({ class: className }),
      "data-slot": "sidebar-trigger",
    },
  });
}
