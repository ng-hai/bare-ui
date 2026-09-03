import type { ComponentProps } from "react";
import { inputStyles } from "./styles";

interface InputAddonProps extends ComponentProps<"span"> {
  className?: string;
}

export function InputAddon({ className, ...props }: InputAddonProps) {
  const styles = inputStyles();
  return <span {...props} className={styles.addon({ class: className })} data-slot="input-addon" />;
}
