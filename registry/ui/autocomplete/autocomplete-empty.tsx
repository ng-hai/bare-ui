import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import { useAutocompleteStyles } from "./autocomplete-root";

interface AutocompleteEmptyProps extends AutocompletePrimitive.Empty.Props {
  className?: string;
}

/**
 * Base UI keeps the Empty live region mounted (and warns against hiding it),
 * so the styled slot lives on an inner element that Base UI only renders
 * while the list is empty. Consumer padding then never shows as a blank band.
 */
export function AutocompleteEmpty({ className, children, ...props }: AutocompleteEmptyProps) {
  const styles = useAutocompleteStyles();
  return (
    <AutocompletePrimitive.Empty {...props}>
      <div className={styles.empty({ class: className })} data-slot="autocomplete-empty">
        {children}
      </div>
    </AutocompletePrimitive.Empty>
  );
}
