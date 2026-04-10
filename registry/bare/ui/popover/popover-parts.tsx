import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { usePopoverStyles } from "./popover-root";

interface PopoverTriggerProps extends PopoverPrimitive.Trigger.Props {
  className?: string;
}

export function PopoverTrigger({
  className,
  ...props
}: PopoverTriggerProps) {
  const styles = usePopoverStyles();
  return (
    <PopoverPrimitive.Trigger
      {...props}
      className={styles.trigger({ class: className })}
      data-slot="popover-trigger"
    />
  );
}

interface PopoverPortalProps extends PopoverPrimitive.Portal.Props {}

export function PopoverPortal(props: PopoverPortalProps) {
  return <PopoverPrimitive.Portal {...props} />;
}

interface PopoverBackdropProps extends PopoverPrimitive.Backdrop.Props {
  className?: string;
}

export function PopoverBackdrop({
  className,
  ...props
}: PopoverBackdropProps) {
  const styles = usePopoverStyles();
  return (
    <PopoverPrimitive.Backdrop
      {...props}
      className={styles.backdrop({ class: className })}
      data-slot="popover-backdrop"
    />
  );
}

interface PopoverPositionerProps extends PopoverPrimitive.Positioner.Props {
  className?: string;
}

export function PopoverPositioner({
  className,
  ...props
}: PopoverPositionerProps) {
  const styles = usePopoverStyles();
  return (
    <PopoverPrimitive.Positioner
      {...props}
      className={styles.positioner({ class: className })}
      data-slot="popover-positioner"
    />
  );
}

interface PopoverPopupProps extends PopoverPrimitive.Popup.Props {
  className?: string;
}

export function PopoverPopup({ className, ...props }: PopoverPopupProps) {
  const styles = usePopoverStyles();
  return (
    <PopoverPrimitive.Popup
      {...props}
      className={styles.popup({ class: className })}
      data-slot="popover-popup"
    />
  );
}

interface PopoverArrowProps extends PopoverPrimitive.Arrow.Props {
  className?: string;
}

export function PopoverArrow({ className, ...props }: PopoverArrowProps) {
  const styles = usePopoverStyles();
  return (
    <PopoverPrimitive.Arrow
      {...props}
      className={styles.arrow({ class: className })}
      data-slot="popover-arrow"
    />
  );
}

interface PopoverTitleProps extends PopoverPrimitive.Title.Props {
  className?: string;
}

export function PopoverTitle({ className, ...props }: PopoverTitleProps) {
  const styles = usePopoverStyles();
  return (
    <PopoverPrimitive.Title
      {...props}
      className={styles.title({ class: className })}
      data-slot="popover-title"
    />
  );
}

interface PopoverDescriptionProps
  extends PopoverPrimitive.Description.Props {
  className?: string;
}

export function PopoverDescription({
  className,
  ...props
}: PopoverDescriptionProps) {
  const styles = usePopoverStyles();
  return (
    <PopoverPrimitive.Description
      {...props}
      className={styles.description({ class: className })}
      data-slot="popover-description"
    />
  );
}

interface PopoverCloseProps extends PopoverPrimitive.Close.Props {
  className?: string;
}

export function PopoverClose({ className, ...props }: PopoverCloseProps) {
  const styles = usePopoverStyles();
  return (
    <PopoverPrimitive.Close
      {...props}
      className={styles.close({ class: className })}
      data-slot="popover-close"
    />
  );
}
