import type { ComponentProps } from "react";
import { useAlertStyles } from "./alert-root";

interface AlertTitleProps extends ComponentProps<"p"> {}

export function AlertTitle({ className, ...props }: AlertTitleProps) {
  const styles = useAlertStyles();
  return <p {...props} className={styles.title({ class: className })} data-slot="alert-title" />;
}
