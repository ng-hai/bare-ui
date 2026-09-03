import type { ComponentProps } from "react";
import { inputStyles } from "./styles";

interface InputGroupProps extends ComponentProps<"div"> {
  className?: string;
}

export function InputGroup({ className, ...props }: InputGroupProps) {
  const styles = inputStyles();
  return <div {...props} className={styles.group({ class: className })} data-slot="input-group" />;
}
