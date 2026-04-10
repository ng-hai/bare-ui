import { Select as SelectPrimitive } from "@base-ui/react/select";
import { useSelectStyles } from "./select-root";

interface SelectTriggerProps extends SelectPrimitive.Trigger.Props {
  className?: string;
}

export function SelectTrigger({ className, ...props }: SelectTriggerProps) {
  const styles = useSelectStyles();
  return (
    <SelectPrimitive.Trigger
      {...props}
      className={styles.trigger({ class: className })}
      data-slot="select-trigger"
    />
  );
}

interface SelectValueProps extends SelectPrimitive.Value.Props {
  className?: string;
}

export function SelectValue({ className, ...props }: SelectValueProps) {
  const styles = useSelectStyles();
  return (
    <SelectPrimitive.Value
      {...props}
      className={styles.value({ class: className })}
      data-slot="select-value"
    />
  );
}

interface SelectIconProps extends SelectPrimitive.Icon.Props {
  className?: string;
}

export function SelectIcon({ className, ...props }: SelectIconProps) {
  const styles = useSelectStyles();
  return (
    <SelectPrimitive.Icon
      {...props}
      className={styles.icon({ class: className })}
      data-slot="select-icon"
    />
  );
}

interface SelectPortalProps extends SelectPrimitive.Portal.Props {}

export function SelectPortal(props: SelectPortalProps) {
  return <SelectPrimitive.Portal {...props} data-slot="select-portal" />;
}

interface SelectBackdropProps extends SelectPrimitive.Backdrop.Props {
  className?: string;
}

export function SelectBackdrop({
  className,
  ...props
}: SelectBackdropProps) {
  const styles = useSelectStyles();
  return (
    <SelectPrimitive.Backdrop
      {...props}
      className={styles.backdrop({ class: className })}
      data-slot="select-backdrop"
    />
  );
}

interface SelectPositionerProps extends SelectPrimitive.Positioner.Props {
  className?: string;
}

export function SelectPositioner({
  className,
  ...props
}: SelectPositionerProps) {
  const styles = useSelectStyles();
  return (
    <SelectPrimitive.Positioner
      {...props}
      className={styles.positioner({ class: className })}
      data-slot="select-positioner"
    />
  );
}

interface SelectPopupProps extends SelectPrimitive.Popup.Props {
  className?: string;
}

export function SelectPopup({ className, ...props }: SelectPopupProps) {
  const styles = useSelectStyles();
  return (
    <SelectPrimitive.Popup
      {...props}
      className={styles.popup({ class: className })}
      data-slot="select-popup"
    />
  );
}

interface SelectItemProps extends SelectPrimitive.Item.Props {
  className?: string;
}

export function SelectItem({ className, ...props }: SelectItemProps) {
  const styles = useSelectStyles();
  return (
    <SelectPrimitive.Item
      {...props}
      className={styles.item({ class: className })}
      data-slot="select-item"
    />
  );
}

interface SelectItemTextProps extends SelectPrimitive.ItemText.Props {
  className?: string;
}

export function SelectItemText({
  className,
  ...props
}: SelectItemTextProps) {
  const styles = useSelectStyles();
  return (
    <SelectPrimitive.ItemText
      {...props}
      className={styles.itemText({ class: className })}
      data-slot="select-item-text"
    />
  );
}

interface SelectItemIndicatorProps
  extends SelectPrimitive.ItemIndicator.Props {
  className?: string;
}

export function SelectItemIndicator({
  className,
  ...props
}: SelectItemIndicatorProps) {
  const styles = useSelectStyles();
  return (
    <SelectPrimitive.ItemIndicator
      {...props}
      className={styles.itemIndicator({ class: className })}
      data-slot="select-item-indicator"
    />
  );
}

interface SelectGroupProps extends SelectPrimitive.Group.Props {
  className?: string;
}

export function SelectGroup({ className, ...props }: SelectGroupProps) {
  const styles = useSelectStyles();
  return (
    <SelectPrimitive.Group
      {...props}
      className={styles.group({ class: className })}
      data-slot="select-group"
    />
  );
}

interface SelectGroupLabelProps extends SelectPrimitive.GroupLabel.Props {
  className?: string;
}

export function SelectGroupLabel({
  className,
  ...props
}: SelectGroupLabelProps) {
  const styles = useSelectStyles();
  return (
    <SelectPrimitive.GroupLabel
      {...props}
      className={styles.groupLabel({ class: className })}
      data-slot="select-group-label"
    />
  );
}

interface SelectArrowProps extends SelectPrimitive.Arrow.Props {
  className?: string;
}

export function SelectArrow({ className, ...props }: SelectArrowProps) {
  const styles = useSelectStyles();
  return (
    <SelectPrimitive.Arrow
      {...props}
      className={styles.arrow({ class: className })}
      data-slot="select-arrow"
    />
  );
}

interface SelectSeparatorProps extends SelectPrimitive.Separator.Props {
  className?: string;
}

export function SelectSeparator({
  className,
  ...props
}: SelectSeparatorProps) {
  const styles = useSelectStyles();
  return (
    <SelectPrimitive.Separator
      {...props}
      className={styles.separator({ class: className })}
      data-slot="select-separator"
    />
  );
}
