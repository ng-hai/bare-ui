import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";
import { createPropSplitter } from "@/lib/split-variant-props";
import { buttonStyles } from "./styles";
import type { VariantProps } from "@/lib/tv.config";

type ButtonStyles = ReturnType<typeof buttonStyles>;
type ButtonVariantProps = VariantProps<typeof buttonStyles>;
const splitProps = createPropSplitter(buttonStyles);

interface ButtonRootProps extends useRender.ComponentProps<"button">, ButtonVariantProps {
  styles?: ButtonStyles;
}

export function ButtonRoot(props: ButtonRootProps) {
  const [variantProps, { className, styles, render, ...htmlProps }] = splitProps(props as Record<string, any>);
  const s = styles ?? buttonStyles(variantProps);

  const defaultProps = {
    type: render ? undefined : ("button" as const),
    "data-slot": "button",
    className: s.root({ class: className }),
  };

  return useRender({
    render,
    defaultTagName: "button",
    props: mergeProps<"button">(defaultProps, htmlProps),
  });
}
