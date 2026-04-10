import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { useDialogStyles } from "./dialog-root";

interface DialogTriggerProps extends DialogPrimitive.Trigger.Props {
  className?: string;
}

export function DialogTrigger({ className, ...props }: DialogTriggerProps) {
  const styles = useDialogStyles();
  return (
    <DialogPrimitive.Trigger
      {...props}
      className={styles.trigger({ class: className })}
      data-slot="dialog-trigger"
    />
  );
}

interface DialogPortalProps extends DialogPrimitive.Portal.Props {}

export function DialogPortal(props: DialogPortalProps) {
  return <DialogPrimitive.Portal {...props} />;
}

interface DialogBackdropProps extends DialogPrimitive.Backdrop.Props {
  className?: string;
}

export function DialogBackdrop({
  className,
  ...props
}: DialogBackdropProps) {
  const styles = useDialogStyles();
  return (
    <DialogPrimitive.Backdrop
      {...props}
      className={styles.backdrop({ class: className })}
      data-slot="dialog-backdrop"
    />
  );
}

interface DialogPopupProps extends DialogPrimitive.Popup.Props {
  className?: string;
}

export function DialogPopup({ className, ...props }: DialogPopupProps) {
  const styles = useDialogStyles();
  return (
    <DialogPrimitive.Popup
      {...props}
      className={styles.popup({ class: className })}
      data-slot="dialog-popup"
    />
  );
}

interface DialogTitleProps extends DialogPrimitive.Title.Props {
  className?: string;
}

export function DialogTitle({ className, ...props }: DialogTitleProps) {
  const styles = useDialogStyles();
  return (
    <DialogPrimitive.Title
      {...props}
      className={styles.title({ class: className })}
      data-slot="dialog-title"
    />
  );
}

interface DialogDescriptionProps extends DialogPrimitive.Description.Props {
  className?: string;
}

export function DialogDescription({
  className,
  ...props
}: DialogDescriptionProps) {
  const styles = useDialogStyles();
  return (
    <DialogPrimitive.Description
      {...props}
      className={styles.description({ class: className })}
      data-slot="dialog-description"
    />
  );
}

interface DialogCloseProps extends DialogPrimitive.Close.Props {
  className?: string;
}

export function DialogClose({ className, ...props }: DialogCloseProps) {
  const styles = useDialogStyles();
  return (
    <DialogPrimitive.Close
      {...props}
      className={styles.close({ class: className })}
      data-slot="dialog-close"
    />
  );
}
