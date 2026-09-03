import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { useSidebarStyles } from "./sidebar-provider";

interface SidebarGroupLabelProps extends CollapsiblePrimitive.Trigger.Props {
  className?: string;
}

export function SidebarGroupLabel({ className, ...props }: SidebarGroupLabelProps) {
  const styles = useSidebarStyles();
  return (
    <CollapsiblePrimitive.Trigger
      {...props}
      className={styles.groupLabel({ class: className })}
      data-slot="sidebar-group-label"
    />
  );
}
