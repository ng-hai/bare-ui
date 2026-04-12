import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { useDialogStyles } from "@/registry/bare/ui/dialog/dialog-root";
import type { dialogStyles } from "./styles";

type PresetDialogStyles = ReturnType<typeof dialogStyles>;

interface DialogCloseButtonProps extends DialogPrimitive.Close.Props {
  className?: string;
}

export function DialogCloseButton({
  className,
  children,
  ...props
}: DialogCloseButtonProps) {
  const styles = useDialogStyles() as PresetDialogStyles;
  return (
    <DialogPrimitive.Close
      {...props}
      className={styles.closeButton({ class: className })}
      data-slot="dialog-close-button"
    >
      {children ?? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )}
    </DialogPrimitive.Close>
  );
}
