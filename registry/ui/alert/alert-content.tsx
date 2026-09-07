import type { ComponentProps } from "react";
import { useAlertStyles } from "./alert-root";

interface AlertContentProps extends ComponentProps<"div"> {}

export function AlertContent({ className, ...props }: AlertContentProps) {
  const styles = useAlertStyles();
  return <div {...props} className={styles.content({ class: className })} data-slot="alert-content" />;
}
