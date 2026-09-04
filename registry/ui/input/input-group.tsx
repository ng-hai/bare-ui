import type { ComponentProps, PointerEvent } from "react";
import { inputStyles } from "./styles";

interface InputGroupProps extends ComponentProps<"div"> {
  className?: string;
}

/**
 * Wraps an `Input.Root` with one or more `Input.Addon`s. Pressing anywhere on
 * the group (padding, a text addon) focuses the input inside it. This runs on
 * `pointerdown` and prevents the default so focus lands on the input on press,
 * without the group briefly taking focus first.
 *
 * Styling recipe for the `addon` slot: `pointer-events-none select-none
 * *:pointer-events-auto` — text addons fall through to this click handler
 * while buttons or links placed inside an addon stay clickable.
 */
export function InputGroup({ className, onPointerDown, ...props }: InputGroupProps) {
  const styles = inputStyles();
  return (
    <div
      {...props}
      onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
        onPointerDown?.(event);
        if (event.defaultPrevented) return;
        const target = event.target as HTMLElement;
        if (target.closest("input, button, a, select, textarea, [tabindex]")) return;
        const input = event.currentTarget.querySelector("input");
        if (!input) return;
        event.preventDefault();
        input.focus();
      }}
      className={styles.group({ class: className })}
      data-slot="input-group"
    />
  );
}
