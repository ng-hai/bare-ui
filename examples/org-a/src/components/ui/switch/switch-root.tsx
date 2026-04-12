import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { createStyleContext } from "@/lib/create-style-context";
import { createPropSplitter } from "@/lib/split-variant-props";
import { switchStyles } from "./styles";
import type { VariantProps } from "@/lib/tv.config";

type SwitchStyles = ReturnType<typeof switchStyles>;
type SwitchVariantProps = VariantProps<typeof switchStyles>;

const { StyleContext, useStyles } = createStyleContext<SwitchStyles>("Switch");
const splitProps = createPropSplitter(switchStyles);

export { useStyles as useSwitchStyles };

interface SwitchRootProps extends SwitchPrimitive.Root.Props, SwitchVariantProps {
  className?: string;
  styles?: SwitchStyles;
}

export function SwitchRoot(props: SwitchRootProps) {
  const [variantProps, { className, styles, ...htmlProps }] = splitProps(props as Record<string, any>);
  const s = styles ?? switchStyles(variantProps);
  return (
    <StyleContext value={s}>
      <SwitchPrimitive.Root {...htmlProps} className={s.root({ class: className })} data-slot="switch" />
    </StyleContext>
  );
}
