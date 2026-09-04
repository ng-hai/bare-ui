import type { ComponentProps } from "react";
import { inputStyles } from "./styles";

interface InputAddonProps extends ComponentProps<"span"> {
  className?: string;
}

/**
 * Decorative prefix/suffix inside `Input.Group`. Pair the `addon` slot with
 * `pointer-events-none select-none *:pointer-events-auto` so clicks on text
 * addons focus the input while interactive children remain clickable.
 */
export function InputAddon({ className, ...props }: InputAddonProps) {
  const styles = inputStyles();
  return <span {...props} className={styles.addon({ class: className })} data-slot="input-addon" />;
}
