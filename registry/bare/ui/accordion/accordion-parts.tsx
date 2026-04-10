import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { useAccordionStyles } from "./accordion-root";

interface AccordionItemProps extends AccordionPrimitive.Item.Props {
  className?: string;
}

export function AccordionItem({ className, ...props }: AccordionItemProps) {
  const styles = useAccordionStyles();
  return (
    <AccordionPrimitive.Item
      {...props}
      className={styles.item({ class: className })}
      data-slot="accordion-item"
    />
  );
}

interface AccordionHeaderProps extends AccordionPrimitive.Header.Props {
  className?: string;
}

export function AccordionHeader({
  className,
  ...props
}: AccordionHeaderProps) {
  const styles = useAccordionStyles();
  return (
    <AccordionPrimitive.Header
      {...props}
      className={styles.header({ class: className })}
      data-slot="accordion-header"
    />
  );
}

interface AccordionTriggerProps extends AccordionPrimitive.Trigger.Props {
  className?: string;
}

export function AccordionTrigger({
  className,
  ...props
}: AccordionTriggerProps) {
  const styles = useAccordionStyles();
  return (
    <AccordionPrimitive.Trigger
      {...props}
      className={styles.trigger({ class: className })}
      data-slot="accordion-trigger"
    />
  );
}

interface AccordionPanelProps extends AccordionPrimitive.Panel.Props {
  className?: string;
}

export function AccordionPanel({
  className,
  ...props
}: AccordionPanelProps) {
  const styles = useAccordionStyles();
  return (
    <AccordionPrimitive.Panel
      {...props}
      className={styles.panel({ class: className })}
      data-slot="accordion-panel"
    />
  );
}
