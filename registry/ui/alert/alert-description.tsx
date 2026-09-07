import type { ComponentProps } from "react";
import { useAlertStyles } from "./alert-root";

interface AlertDescriptionProps extends ComponentProps<"p"> {}

export function AlertDescription({ className, ...props }: AlertDescriptionProps) {
  const styles = useAlertStyles();
  return <p {...props} className={styles.description({ class: className })} data-slot="alert-description" />;
}
