import type { ComponentProps } from "react";
import { createStyleContext } from "@/registry/lib/create-style-context";
import { createPropSplitter } from "@/registry/lib/split-variant-props";
import { alertStyles } from "./styles";
import type { VariantProps } from "@/registry/lib/tv-config";

type AlertStyles = ReturnType<typeof alertStyles>;
type AlertVariantProps = VariantProps<typeof alertStyles>;

const { StyleContext, useStyles } = createStyleContext<AlertStyles>("Alert");
const splitProps = createPropSplitter(alertStyles);

export { useStyles as useAlertStyles };

interface AlertRootProps extends ComponentProps<"div">, AlertVariantProps {
  styles?: AlertStyles;
}

/**
 * An inline message that stays in the page flow. Defaults to `role="status"`, a polite live
 * region for passive information; pass `role="alert"` when the message answers a submit and
 * must be announced at once. Focusable (`tabIndex={-1}`) so a form can move focus to it.
 */
export function AlertRoot(props: AlertRootProps) {
  const [variantProps, { className, styles, role = "status", tabIndex = -1, ...htmlProps }] = splitProps(props);
  const s = styles ?? alertStyles(variantProps);
  return (
    <StyleContext value={s}>
      <div {...htmlProps} role={role} tabIndex={tabIndex} className={s.root({ class: className })} data-slot="alert" />
    </StyleContext>
  );
}
