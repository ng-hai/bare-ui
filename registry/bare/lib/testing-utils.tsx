import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import type { ReactNode } from "react";

interface SlotConfig {
  /** The expected data-slot attribute value */
  slot: string;
  /** If true, this part doesn't render a DOM element (provider, portal, etc.) */
  skipRender?: boolean;
}

interface DescribeSlotsOptions {
  /** Wrapper that provides required parent context (e.g. <Dialog.Root open>) */
  wrapper?: (children: ReactNode) => ReactNode;
}

/**
 * Generates standard tests for a bare-ui component's parts:
 * - data-slot attribute presence
 * - className merge into slot
 * - Context error when rendered outside wrapper (multi-part only)
 */
export function describeSlots(
  name: string,
  Component: Record<string, any>,
  slots: Record<string, SlotConfig>,
  options?: DescribeSlotsOptions,
) {
  const { wrapper } = options ?? {};

  for (const [partName, config] of Object.entries(slots)) {
    const Part = Component[partName];
    if (!Part) {
      throw new Error(`Component.${partName} is undefined — check index.parts.ts exports`);
    }

    describe(partName, () => {
      if (config.skipRender) {
        it.skip("skipped (no DOM element)", () => {});
        return;
      }

      it(`renders with data-slot="${config.slot}"`, () => {
        const ui = <Part />;
        const { container } = render(wrapper ? (wrapper(ui) as any) : ui);
        const el = container.querySelector(`[data-slot="${config.slot}"]`);
        expect(el).toBeInTheDocument();
      });

      it("merges className into slot", () => {
        const ui = <Part className="__test-class__" />;
        const { container } = render(wrapper ? (wrapper(ui) as any) : ui);
        const el = container.querySelector(`[data-slot="${config.slot}"]`);
        expect(el).toHaveClass("__test-class__");
      });

      if (wrapper) {
        it("throws when rendered outside Root", () => {
          expect(() => render(<Part />)).toThrow("must be used within");
        });
      }
    });
  }
}
