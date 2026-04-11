import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { createStyleContext } from "@/registry/bare/lib/create-style-context";
import { createPropSplitter } from "@/registry/bare/lib/split-variant-props";
import { dialogStyles } from "./styles";
import type { VariantProps } from "@/registry/bare/lib/tv.config";

type DialogStyles = ReturnType<typeof dialogStyles>;
type DialogVariantProps = VariantProps<typeof dialogStyles>;

const { StyleContext, useStyles } = createStyleContext<DialogStyles>("Dialog");
const splitProps = createPropSplitter(dialogStyles);

export { useStyles as useDialogStyles };

interface DialogRootProps extends DialogPrimitive.Root.Props, DialogVariantProps {
  styles?: DialogStyles;
}

export function DialogRoot(props: DialogRootProps) {
  const [variantProps, { styles, ...htmlProps }] = splitProps(props as Record<string, any>);
  const s = styles ?? dialogStyles(variantProps);
  return (
    <StyleContext value={s}>
      <DialogPrimitive.Root {...htmlProps} />
    </StyleContext>
  );
}
