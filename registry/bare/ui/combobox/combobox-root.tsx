import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { createStyleContext } from "@/registry/bare/lib/create-style-context";
import { createPropSplitter } from "@/registry/bare/lib/split-variant-props";
import { comboboxStyles } from "./styles";
import type { VariantProps } from "@/registry/bare/lib/tv.config";

type ComboboxStyles = ReturnType<typeof comboboxStyles>;
type ComboboxVariantProps = VariantProps<typeof comboboxStyles>;

const { StyleContext, useStyles } = createStyleContext<ComboboxStyles>("Combobox");
const splitProps = createPropSplitter(comboboxStyles);

export { useStyles as useComboboxStyles };

type ComboboxRootProps<Value, Multiple extends boolean | undefined = false> = ComboboxPrimitive.Root.Props<
  Value,
  Multiple
> &
  ComboboxVariantProps & {
    styles?: ComboboxStyles;
  };

export function ComboboxRoot<Value, Multiple extends boolean | undefined = false>(
  props: ComboboxRootProps<Value, Multiple>,
) {
  const [variantProps, { styles, ...htmlProps }] = splitProps(props as Record<string, any>);
  const s = styles ?? comboboxStyles(variantProps);
  return (
    <StyleContext value={s}>
      <ComboboxPrimitive.Root {...(htmlProps as ComboboxPrimitive.Root.Props<Value, Multiple>)} />
    </StyleContext>
  );
}
