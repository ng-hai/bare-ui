import type { ComponentProps } from "react";
import { useAlertStyles } from "./alert-root";

interface AlertIconProps extends ComponentProps<"span"> {}

/** Wraps the consumer's glyph; ships none of its own. Hidden from assistive tech — the text carries the meaning. */
export function AlertIcon({ className, ...props }: AlertIconProps) {
  const styles = useAlertStyles();
  return <span aria-hidden {...props} className={styles.icon({ class: className })} data-slot="alert-icon" />;
}
