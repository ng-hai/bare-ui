import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { useTabsStyles } from "./tabs-root";

interface TabsListProps extends TabsPrimitive.List.Props {
  className?: string;
}

export function TabsList({ className, ...props }: TabsListProps) {
  const styles = useTabsStyles();
  return (
    <TabsPrimitive.List
      {...props}
      className={styles.list({ class: className })}
      data-slot="tabs-list"
    />
  );
}

interface TabsTabProps extends TabsPrimitive.Tab.Props {
  className?: string;
}

export function TabsTab({ className, ...props }: TabsTabProps) {
  const styles = useTabsStyles();
  return (
    <TabsPrimitive.Tab
      {...props}
      className={styles.tab({ class: className })}
      data-slot="tabs-tab"
    />
  );
}

interface TabsIndicatorProps extends TabsPrimitive.Indicator.Props {
  className?: string;
}

export function TabsIndicator({
  className,
  ...props
}: TabsIndicatorProps) {
  const styles = useTabsStyles();
  return (
    <TabsPrimitive.Indicator
      {...props}
      className={styles.indicator({ class: className })}
      data-slot="tabs-indicator"
    />
  );
}

interface TabsPanelProps extends TabsPrimitive.Panel.Props {
  className?: string;
}

export function TabsPanel({ className, ...props }: TabsPanelProps) {
  const styles = useTabsStyles();
  return (
    <TabsPrimitive.Panel
      {...props}
      className={styles.panel({ class: className })}
      data-slot="tabs-panel"
    />
  );
}
