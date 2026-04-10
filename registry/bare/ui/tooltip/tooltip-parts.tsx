import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { useTooltipStyles } from "./tooltip-root";

interface TooltipTriggerProps extends TooltipPrimitive.Trigger.Props {
  className?: string;
}

export function TooltipTrigger({
  className,
  ...props
}: TooltipTriggerProps) {
  const styles = useTooltipStyles();
  return (
    <TooltipPrimitive.Trigger
      {...props}
      className={styles.trigger({ class: className })}
      data-slot="tooltip-trigger"
    />
  );
}

interface TooltipPortalProps extends TooltipPrimitive.Portal.Props {}

export function TooltipPortal(props: TooltipPortalProps) {
  return <TooltipPrimitive.Portal {...props} />;
}

interface TooltipPositionerProps extends TooltipPrimitive.Positioner.Props {
  className?: string;
}

export function TooltipPositioner({
  className,
  ...props
}: TooltipPositionerProps) {
  const styles = useTooltipStyles();
  return (
    <TooltipPrimitive.Positioner
      {...props}
      className={styles.positioner({ class: className })}
      data-slot="tooltip-positioner"
    />
  );
}

interface TooltipPopupProps extends TooltipPrimitive.Popup.Props {
  className?: string;
}

export function TooltipPopup({ className, ...props }: TooltipPopupProps) {
  const styles = useTooltipStyles();
  return (
    <TooltipPrimitive.Popup
      {...props}
      className={styles.popup({ class: className })}
      data-slot="tooltip-popup"
    />
  );
}

interface TooltipArrowProps extends TooltipPrimitive.Arrow.Props {
  className?: string;
}

export function TooltipArrow({ className, ...props }: TooltipArrowProps) {
  const styles = useTooltipStyles();
  return (
    <TooltipPrimitive.Arrow
      {...props}
      className={styles.arrow({ class: className })}
      data-slot="tooltip-arrow"
    />
  );
}
