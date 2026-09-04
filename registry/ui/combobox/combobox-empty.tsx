import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { useComboboxStyles } from "./combobox-root";

interface ComboboxEmptyProps extends ComboboxPrimitive.Empty.Props {
  className?: string;
}

/**
 * Base UI keeps the Empty live region mounted (and warns against hiding it),
 * so the styled slot lives on an inner element that Base UI only renders
 * while the list is empty. Consumer padding then never shows as a blank band.
 */
export function ComboboxEmpty({ className, children, ...props }: ComboboxEmptyProps) {
  const styles = useComboboxStyles();
  return (
    <ComboboxPrimitive.Empty {...props}>
      <div className={styles.empty({ class: className })} data-slot="combobox-empty">
        {children}
      </div>
    </ComboboxPrimitive.Empty>
  );
}
