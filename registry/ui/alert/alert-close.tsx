import type { ComponentProps } from "react";
import { useAlertStyles } from "./alert-root";

interface AlertCloseProps extends ComponentProps<"button"> {}

/** Dismisses the alert; the consumer wires `onClick` and supplies the glyph. */
export function AlertClose({ className, type = "button", ...props }: AlertCloseProps) {
  const styles = useAlertStyles();
  return <button {...props} type={type} className={styles.close({ class: className })} data-slot="alert-close" />;
}
