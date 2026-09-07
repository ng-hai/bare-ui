import type { ComponentProps } from "react";
import { useAlertStyles } from "./alert-root";

interface AlertActionProps extends ComponentProps<"div"> {}

/** Holds the follow-up control (a link or button); the consumer supplies it. */
export function AlertAction({ className, ...props }: AlertActionProps) {
  const styles = useAlertStyles();
  return <div {...props} className={styles.action({ class: className })} data-slot="alert-action" />;
}
