# Test Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Vitest + Testing Library test infrastructure covering shared utilities, all 34 UI components, and registry build integrity.

**Architecture:** Shared `describeSlots` helper generates data-slot, className-merge, and context-error tests for each component from a declarative slot map. Utility tests cover `createPropSplitter`, `createStyleContext`, and `tv` config directly. A registry build test verifies `public/r/*.json` stays in sync.

**Tech Stack:** Vitest, @testing-library/react, @testing-library/jest-dom, jsdom

---

### Task 1: Install dependencies and configure Vitest

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`

- [ ] **Step 1: Install test dependencies**

Run:
```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 2: Add test scripts to package.json**

In `package.json`, add to the `"scripts"` object:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Create vitest.config.ts**

Create `vitest.config.ts` at repo root:

```ts
import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
    },
  },
  test: {
    environment: "jsdom",
    include: ["registry/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
```

- [ ] **Step 4: Create vitest.setup.ts**

Create `vitest.setup.ts` at repo root:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 5: Verify vitest runs (no tests yet)**

Run:
```bash
pnpm test
```
Expected: Vitest starts, finds no test files, exits cleanly.

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml vitest.config.ts vitest.setup.ts
git commit -m "chore: add vitest test infrastructure"
```

---

### Task 2: Test createPropSplitter utility

**Files:**
- Test: `registry/bare/lib/split-variant-props.test.ts`
- Reference: `registry/bare/lib/split-variant-props.ts`

- [ ] **Step 1: Write the tests**

Create `registry/bare/lib/split-variant-props.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { tv } from "@/registry/bare/lib/tv.config";
import { createPropSplitter } from "./split-variant-props";

const styles = tv({
  slots: { root: [""] },
  variants: {
    size: { sm: { root: "" }, lg: { root: "" } },
    color: { red: { root: "" }, blue: { root: "" } },
  },
});

const splitProps = createPropSplitter(styles);

describe("createPropSplitter", () => {
  it("splits variant keys from HTML props", () => {
    const [variantProps, rest] = splitProps({
      size: "sm",
      color: "red",
      className: "my-class",
      onClick: () => {},
    });
    expect(variantProps).toEqual({ size: "sm", color: "red" });
    expect(rest).toEqual({ className: "my-class", onClick: expect.any(Function) });
  });

  it("returns empty variant props when none match", () => {
    const [variantProps, rest] = splitProps({ className: "test", id: "x" });
    expect(variantProps).toEqual({});
    expect(rest).toEqual({ className: "test", id: "x" });
  });

  it("returns empty rest when all props are variants", () => {
    const [variantProps, rest] = splitProps({ size: "lg", color: "blue" });
    expect(variantProps).toEqual({ size: "lg", color: "blue" });
    expect(rest).toEqual({});
  });

  it("handles empty props", () => {
    const [variantProps, rest] = splitProps({});
    expect(variantProps).toEqual({});
    expect(rest).toEqual({});
  });

  it("works with tv() variantKeys at runtime", () => {
    expect((styles as any).variantKeys).toEqual(expect.arrayContaining(["size", "color"]));
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

Run:
```bash
pnpm test registry/bare/lib/split-variant-props.test.ts
```
Expected: All 5 tests PASS.

- [ ] **Step 3: Commit**

```bash
git add registry/bare/lib/split-variant-props.test.ts
git commit -m "test: add createPropSplitter tests"
```

---

### Task 3: Test createStyleContext utility

**Files:**
- Test: `registry/bare/lib/create-style-context.test.tsx`
- Reference: `registry/bare/lib/create-style-context.ts`

- [ ] **Step 1: Write the tests**

Create `registry/bare/lib/create-style-context.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createStyleContext } from "./create-style-context";

type MockStyles = { root: () => string };

const { StyleContext, useStyles } = createStyleContext<MockStyles>("TestComponent");

function Consumer() {
  const styles = useStyles();
  return <div data-testid="consumer">{styles.root()}</div>;
}

describe("createStyleContext", () => {
  it("provides styles to consumers via context", () => {
    const mockStyles: MockStyles = { root: () => "test-class" };
    render(
      <StyleContext value={mockStyles}>
        <Consumer />
      </StyleContext>,
    );
    expect(screen.getByTestId("consumer")).toHaveTextContent("test-class");
  });

  it("throws when useStyles is called outside provider", () => {
    expect(() => render(<Consumer />)).toThrow(
      "TestComponent parts must be used within <TestComponent.Root>",
    );
  });

  it("propagates updated context values", () => {
    const stylesA: MockStyles = { root: () => "class-a" };
    const stylesB: MockStyles = { root: () => "class-b" };

    const { rerender } = render(
      <StyleContext value={stylesA}>
        <Consumer />
      </StyleContext>,
    );
    expect(screen.getByTestId("consumer")).toHaveTextContent("class-a");

    rerender(
      <StyleContext value={stylesB}>
        <Consumer />
      </StyleContext>,
    );
    expect(screen.getByTestId("consumer")).toHaveTextContent("class-b");
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

Run:
```bash
pnpm test registry/bare/lib/create-style-context.test.tsx
```
Expected: All 3 tests PASS.

- [ ] **Step 3: Commit**

```bash
git add registry/bare/lib/create-style-context.test.tsx
git commit -m "test: add createStyleContext tests"
```

---

### Task 4: Test tv.config utility

**Files:**
- Test: `registry/bare/lib/tv.config.test.ts`
- Reference: `registry/bare/lib/tv.config.ts`

- [ ] **Step 1: Write the tests**

Create `registry/bare/lib/tv.config.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { tv } from "./tv.config";

describe("tv config", () => {
  it("returns a function with variantKeys property", () => {
    const styles = tv({
      slots: { root: [""] },
      variants: { size: { sm: { root: "" } } },
    });
    expect((styles as any).variantKeys).toContain("size");
  });

  it("slot functions merge class via { class } option", () => {
    const styles = tv({
      slots: { root: ["base-class"] },
    });
    const s = styles();
    expect(s.root({ class: "extra" })).toContain("extra");
  });

  it("resolves conflicting Tailwind classes via twMerge", () => {
    const styles = tv({
      slots: { root: ["p-2"] },
    });
    const s = styles();
    const result = s.root({ class: "p-4" });
    expect(result).toContain("p-4");
    expect(result).not.toContain("p-2");
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

Run:
```bash
pnpm test registry/bare/lib/tv.config.test.ts
```
Expected: All 3 tests PASS.

- [ ] **Step 3: Commit**

```bash
git add registry/bare/lib/tv.config.test.ts
git commit -m "test: add tv config sanity tests"
```

---

### Task 5: Build the describeSlots test helper

**Files:**
- Create: `registry/bare/lib/testing-utils.tsx`
- Test: `registry/bare/lib/testing-utils.test.tsx`

- [ ] **Step 1: Create the test helper**

Create `registry/bare/lib/testing-utils.tsx`:

```tsx
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
```

- [ ] **Step 2: Write the helper self-test**

Create `registry/bare/lib/testing-utils.test.tsx`:

```tsx
import { describe, it, expect, vi } from "vitest";
import { describeSlots } from "./testing-utils";

function FakeRoot({ className }: { className?: string }) {
  return <div data-slot="fake" className={className} />;
}

const FakeComponent = { Root: FakeRoot };

describe("describeSlots helper", () => {
  it("throws if a part name does not exist on the component", () => {
    expect(() => {
      describeSlots("fake", FakeComponent, {
        NonExistent: { slot: "nope" },
      });
    }).toThrow("Component.NonExistent is undefined");
  });
});
```

- [ ] **Step 3: Run tests to verify**

Run:
```bash
pnpm test registry/bare/lib/testing-utils.test.tsx
```
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add registry/bare/lib/testing-utils.tsx registry/bare/lib/testing-utils.test.tsx
git commit -m "test: add describeSlots shared test helper"
```

---

### Task 6: Test single-part components (8 components)

**Files:**
- Create: `registry/bare/ui/button/button.test.tsx`
- Create: `registry/bare/ui/input/input.test.tsx`
- Create: `registry/bare/ui/separator/separator.test.tsx`
- Create: `registry/bare/ui/toggle/toggle.test.tsx`
- Create: `registry/bare/ui/toggle-group/toggle-group.test.tsx`
- Create: `registry/bare/ui/checkbox-group/checkbox-group.test.tsx`
- Create: `registry/bare/ui/menubar/menubar.test.tsx`
- Create: `registry/bare/ui/form/form.test.tsx`

Note: Form is a direct re-export of `@base-ui/react/form` with no bare-ui wrapper, styles, or data-slot. It gets a minimal existence test only.

- [ ] **Step 1: Create button.test.tsx**

```tsx
import { describe } from "vitest";
import { Button } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Button", () => {
  describeSlots("button", Button, {
    Root: { slot: "button" },
  });
});
```

- [ ] **Step 2: Create input.test.tsx**

```tsx
import { describe } from "vitest";
import { Input } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Input", () => {
  describeSlots("input", Input, {
    Root: { slot: "input" },
  });
});
```

- [ ] **Step 3: Create separator.test.tsx**

```tsx
import { describe } from "vitest";
import { Separator } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Separator", () => {
  describeSlots("separator", Separator, {
    Root: { slot: "separator" },
  });
});
```

- [ ] **Step 4: Create toggle.test.tsx**

```tsx
import { describe } from "vitest";
import { Toggle } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Toggle", () => {
  describeSlots("toggle", Toggle, {
    Root: { slot: "toggle" },
  });
});
```

- [ ] **Step 5: Create toggle-group.test.tsx**

```tsx
import { describe } from "vitest";
import { ToggleGroup } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("ToggleGroup", () => {
  describeSlots("toggle-group", ToggleGroup, {
    Root: { slot: "toggle-group" },
  });
});
```

- [ ] **Step 6: Create checkbox-group.test.tsx**

```tsx
import { describe } from "vitest";
import { CheckboxGroup } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("CheckboxGroup", () => {
  describeSlots("checkbox-group", CheckboxGroup, {
    Root: { slot: "checkbox-group" },
  });
});
```

- [ ] **Step 7: Create menubar.test.tsx**

```tsx
import { describe } from "vitest";
import { Menubar } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Menubar", () => {
  describeSlots("menubar", Menubar, {
    Root: { slot: "menubar" },
  });
});
```

- [ ] **Step 8: Create form.test.tsx**

Form is a direct re-export from base-ui with no bare-ui wrapper. Minimal existence test:

```tsx
import { describe, it, expect } from "vitest";
import { Form } from "./index";

describe("Form", () => {
  it("exports Root", () => {
    expect(Form.Root).toBeDefined();
  });
});
```

- [ ] **Step 9: Run all single-part tests**

Run:
```bash
pnpm test registry/bare/ui/button registry/bare/ui/input registry/bare/ui/separator registry/bare/ui/toggle registry/bare/ui/toggle-group registry/bare/ui/checkbox-group registry/bare/ui/menubar registry/bare/ui/form
```
Expected: All tests PASS.

- [ ] **Step 10: Commit**

```bash
git add registry/bare/ui/button/button.test.tsx registry/bare/ui/input/input.test.tsx registry/bare/ui/separator/separator.test.tsx registry/bare/ui/toggle/toggle.test.tsx registry/bare/ui/toggle-group/toggle-group.test.tsx registry/bare/ui/checkbox-group/checkbox-group.test.tsx registry/bare/ui/menubar/menubar.test.tsx registry/bare/ui/form/form.test.tsx
git commit -m "test: add single-part component tests"
```

---

### Task 7: Test self-contained multi-part components (no portal/popup required)

These components render all their parts inline without requiring portals or open state for DOM elements to appear.

**Files:**
- Create: `registry/bare/ui/accordion/accordion.test.tsx`
- Create: `registry/bare/ui/avatar/avatar.test.tsx`
- Create: `registry/bare/ui/checkbox/checkbox.test.tsx`
- Create: `registry/bare/ui/collapsible/collapsible.test.tsx`
- Create: `registry/bare/ui/field/field.test.tsx`
- Create: `registry/bare/ui/fieldset/fieldset.test.tsx`
- Create: `registry/bare/ui/meter/meter.test.tsx`
- Create: `registry/bare/ui/number-field/number-field.test.tsx`
- Create: `registry/bare/ui/progress/progress.test.tsx`
- Create: `registry/bare/ui/radio/radio.test.tsx`
- Create: `registry/bare/ui/scroll-area/scroll-area.test.tsx`
- Create: `registry/bare/ui/slider/slider.test.tsx`
- Create: `registry/bare/ui/switch/switch.test.tsx`
- Create: `registry/bare/ui/tabs/tabs.test.tsx`
- Create: `registry/bare/ui/toolbar/toolbar.test.tsx`

- [ ] **Step 1: Create accordion.test.tsx**

```tsx
import { describe } from "vitest";
import { Accordion } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Accordion", () => {
  describeSlots("accordion", Accordion, {
    Root: { slot: "accordion" },
    Item: { slot: "accordion-item" },
    Header: { slot: "accordion-header" },
    Trigger: { slot: "accordion-trigger" },
    Panel: { slot: "accordion-panel" },
  }, {
    wrapper: (children) => (
      <Accordion.Root>{children}</Accordion.Root>
    ),
  });
});
```

Note: Accordion.Root renders a DOM element AND provides style context, so it does NOT have `skipRender`. The wrapper wraps sibling parts inside the root for context. The Root slot test renders a standalone `<Accordion.Root />` without the wrapper.

However, the `describeSlots` helper uses the wrapper for ALL parts including Root. This means Root gets wrapped inside another Root. To handle this, the Root entry should use `skipRender: true` when Root is tested as the wrapper provider, OR Root should be tested separately outside `describeSlots`.

**Revised approach**: For components where Root itself renders DOM (like Accordion), we test Root separately and use `describeSlots` with `skipRender: true` for Root. Let me revise:

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Accordion } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Accordion", () => {
  describe("Root", () => {
    it('renders with data-slot="accordion"', () => {
      const { container } = render(<Accordion.Root />);
      expect(container.querySelector('[data-slot="accordion"]')).toBeInTheDocument();
    });

    it("merges className into slot", () => {
      const { container } = render(<Accordion.Root className="__test-class__" />);
      expect(container.querySelector('[data-slot="accordion"]')).toHaveClass("__test-class__");
    });
  });

  describeSlots("accordion", Accordion, {
    Root: { slot: "accordion", skipRender: true },
    Item: { slot: "accordion-item" },
    Header: { slot: "accordion-header" },
    Trigger: { slot: "accordion-trigger" },
    Panel: { slot: "accordion-panel" },
  }, {
    wrapper: (children) => (
      <Accordion.Root>
        <Accordion.Item>{children}</Accordion.Item>
      </Accordion.Root>
    ),
  });
});
```

Note: Accordion Header/Trigger/Panel must be inside an Item, so the wrapper nests `Root > Item > {children}`.

- [ ] **Step 2: Create avatar.test.tsx**

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Avatar } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Avatar", () => {
  describe("Root", () => {
    it('renders with data-slot="avatar"', () => {
      const { container } = render(<Avatar.Root />);
      expect(container.querySelector('[data-slot="avatar"]')).toBeInTheDocument();
    });

    it("merges className into slot", () => {
      const { container } = render(<Avatar.Root className="__test-class__" />);
      expect(container.querySelector('[data-slot="avatar"]')).toHaveClass("__test-class__");
    });
  });

  describeSlots("avatar", Avatar, {
    Root: { slot: "avatar", skipRender: true },
    Image: { slot: "avatar-image" },
    Fallback: { slot: "avatar-fallback" },
  }, {
    wrapper: (children) => (
      <Avatar.Root>{children}</Avatar.Root>
    ),
  });
});
```

- [ ] **Step 3: Create checkbox.test.tsx**

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Checkbox } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Checkbox", () => {
  describe("Root", () => {
    it('renders with data-slot="checkbox"', () => {
      const { container } = render(<Checkbox.Root />);
      expect(container.querySelector('[data-slot="checkbox"]')).toBeInTheDocument();
    });

    it("merges className into slot", () => {
      const { container } = render(<Checkbox.Root className="__test-class__" />);
      expect(container.querySelector('[data-slot="checkbox"]')).toHaveClass("__test-class__");
    });
  });

  describeSlots("checkbox", Checkbox, {
    Root: { slot: "checkbox", skipRender: true },
    Indicator: { slot: "checkbox-indicator" },
  }, {
    wrapper: (children) => (
      <Checkbox.Root>{children}</Checkbox.Root>
    ),
  });
});
```

- [ ] **Step 4: Create collapsible.test.tsx**

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Collapsible } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Collapsible", () => {
  describe("Root", () => {
    it('renders with data-slot="collapsible"', () => {
      const { container } = render(<Collapsible.Root />);
      expect(container.querySelector('[data-slot="collapsible"]')).toBeInTheDocument();
    });

    it("merges className into slot", () => {
      const { container } = render(<Collapsible.Root className="__test-class__" />);
      expect(container.querySelector('[data-slot="collapsible"]')).toHaveClass("__test-class__");
    });
  });

  describeSlots("collapsible", Collapsible, {
    Root: { slot: "collapsible", skipRender: true },
    Trigger: { slot: "collapsible-trigger" },
    Panel: { slot: "collapsible-panel" },
  }, {
    wrapper: (children) => (
      <Collapsible.Root>{children}</Collapsible.Root>
    ),
  });
});
```

- [ ] **Step 5: Create field.test.tsx**

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Field } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Field", () => {
  describe("Root", () => {
    it('renders with data-slot="field"', () => {
      const { container } = render(<Field.Root />);
      expect(container.querySelector('[data-slot="field"]')).toBeInTheDocument();
    });

    it("merges className into slot", () => {
      const { container } = render(<Field.Root className="__test-class__" />);
      expect(container.querySelector('[data-slot="field"]')).toHaveClass("__test-class__");
    });
  });

  describeSlots("field", Field, {
    Root: { slot: "field", skipRender: true },
    Label: { slot: "field-label" },
    Error: { slot: "field-error" },
    Description: { slot: "field-description" },
    Control: { slot: "field-control" },
    Validity: { slot: "field-validity", skipRender: true },
    Item: { slot: "field-item" },
  }, {
    wrapper: (children) => (
      <Field.Root>{children}</Field.Root>
    ),
  });
});
```

- [ ] **Step 6: Create fieldset.test.tsx**

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Fieldset } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Fieldset", () => {
  describe("Root", () => {
    it('renders with data-slot="fieldset"', () => {
      const { container } = render(<Fieldset.Root />);
      expect(container.querySelector('[data-slot="fieldset"]')).toBeInTheDocument();
    });

    it("merges className into slot", () => {
      const { container } = render(<Fieldset.Root className="__test-class__" />);
      expect(container.querySelector('[data-slot="fieldset"]')).toHaveClass("__test-class__");
    });
  });

  describeSlots("fieldset", Fieldset, {
    Root: { slot: "fieldset", skipRender: true },
    Legend: { slot: "fieldset-legend" },
  }, {
    wrapper: (children) => (
      <Fieldset.Root>{children}</Fieldset.Root>
    ),
  });
});
```

- [ ] **Step 7: Create meter.test.tsx**

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Meter } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Meter", () => {
  describe("Root", () => {
    it('renders with data-slot="meter"', () => {
      const { container } = render(<Meter.Root value={50} />);
      expect(container.querySelector('[data-slot="meter"]')).toBeInTheDocument();
    });

    it("merges className into slot", () => {
      const { container } = render(<Meter.Root value={50} className="__test-class__" />);
      expect(container.querySelector('[data-slot="meter"]')).toHaveClass("__test-class__");
    });
  });

  describeSlots("meter", Meter, {
    Root: { slot: "meter", skipRender: true },
    Track: { slot: "meter-track" },
    Indicator: { slot: "meter-indicator" },
    Value: { slot: "meter-value" },
    Label: { slot: "meter-label" },
  }, {
    wrapper: (children) => (
      <Meter.Root value={50}>{children}</Meter.Root>
    ),
  });
});
```

- [ ] **Step 8: Create number-field.test.tsx**

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { NumberField } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("NumberField", () => {
  describe("Root", () => {
    it('renders with data-slot="number-field"', () => {
      const { container } = render(<NumberField.Root />);
      expect(container.querySelector('[data-slot="number-field"]')).toBeInTheDocument();
    });

    it("merges className into slot", () => {
      const { container } = render(<NumberField.Root className="__test-class__" />);
      expect(container.querySelector('[data-slot="number-field"]')).toHaveClass("__test-class__");
    });
  });

  describeSlots("number-field", NumberField, {
    Root: { slot: "number-field", skipRender: true },
    Group: { slot: "number-field-group" },
    Increment: { slot: "number-field-increment" },
    Decrement: { slot: "number-field-decrement" },
    Input: { slot: "number-field-input" },
    ScrubArea: { slot: "number-field-scrub-area" },
    ScrubAreaCursor: { slot: "number-field-scrub-area-cursor" },
  }, {
    wrapper: (children) => (
      <NumberField.Root>{children}</NumberField.Root>
    ),
  });
});
```

- [ ] **Step 9: Create progress.test.tsx**

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Progress } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Progress", () => {
  describe("Root", () => {
    it('renders with data-slot="progress"', () => {
      const { container } = render(<Progress.Root value={50} />);
      expect(container.querySelector('[data-slot="progress"]')).toBeInTheDocument();
    });

    it("merges className into slot", () => {
      const { container } = render(<Progress.Root value={50} className="__test-class__" />);
      expect(container.querySelector('[data-slot="progress"]')).toHaveClass("__test-class__");
    });
  });

  describeSlots("progress", Progress, {
    Root: { slot: "progress", skipRender: true },
    Track: { slot: "progress-track" },
    Indicator: { slot: "progress-indicator" },
    Value: { slot: "progress-value" },
    Label: { slot: "progress-label" },
  }, {
    wrapper: (children) => (
      <Progress.Root value={50}>{children}</Progress.Root>
    ),
  });
});
```

- [ ] **Step 10: Create radio.test.tsx**

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Radio } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Radio", () => {
  describe("Root", () => {
    it('renders with data-slot="radio"', () => {
      const { container } = render(<Radio.Root />);
      expect(container.querySelector('[data-slot="radio"]')).toBeInTheDocument();
    });

    it("merges className into slot", () => {
      const { container } = render(<Radio.Root className="__test-class__" />);
      expect(container.querySelector('[data-slot="radio"]')).toHaveClass("__test-class__");
    });
  });

  describeSlots("radio", Radio, {
    Root: { slot: "radio", skipRender: true },
    Item: { slot: "radio-item" },
    Indicator: { slot: "radio-indicator" },
  }, {
    wrapper: (children) => (
      <Radio.Root>
        <Radio.Item value="test">{children}</Radio.Item>
      </Radio.Root>
    ),
  });
});
```

- [ ] **Step 11: Create scroll-area.test.tsx**

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ScrollArea } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("ScrollArea", () => {
  describe("Root", () => {
    it('renders with data-slot="scroll-area"', () => {
      const { container } = render(<ScrollArea.Root />);
      expect(container.querySelector('[data-slot="scroll-area"]')).toBeInTheDocument();
    });

    it("merges className into slot", () => {
      const { container } = render(<ScrollArea.Root className="__test-class__" />);
      expect(container.querySelector('[data-slot="scroll-area"]')).toHaveClass("__test-class__");
    });
  });

  describeSlots("scroll-area", ScrollArea, {
    Root: { slot: "scroll-area", skipRender: true },
    Viewport: { slot: "scroll-area-viewport" },
    Scrollbar: { slot: "scroll-area-scrollbar" },
    Content: { slot: "scroll-area-content" },
    Thumb: { slot: "scroll-area-thumb" },
    Corner: { slot: "scroll-area-corner" },
  }, {
    wrapper: (children) => (
      <ScrollArea.Root>{children}</ScrollArea.Root>
    ),
  });
});
```

- [ ] **Step 12: Create slider.test.tsx**

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Slider } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Slider", () => {
  describe("Root", () => {
    it('renders with data-slot="slider"', () => {
      const { container } = render(<Slider.Root />);
      expect(container.querySelector('[data-slot="slider"]')).toBeInTheDocument();
    });

    it("merges className into slot", () => {
      const { container } = render(<Slider.Root className="__test-class__" />);
      expect(container.querySelector('[data-slot="slider"]')).toHaveClass("__test-class__");
    });
  });

  describeSlots("slider", Slider, {
    Root: { slot: "slider", skipRender: true },
    Label: { slot: "slider-label" },
    Value: { slot: "slider-value" },
    Control: { slot: "slider-control" },
    Track: { slot: "slider-track" },
    Thumb: { slot: "slider-thumb" },
    Indicator: { slot: "slider-indicator" },
  }, {
    wrapper: (children) => (
      <Slider.Root>{children}</Slider.Root>
    ),
  });
});
```

- [ ] **Step 13: Create switch.test.tsx**

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Switch } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Switch", () => {
  describe("Root", () => {
    it('renders with data-slot="switch"', () => {
      const { container } = render(<Switch.Root />);
      expect(container.querySelector('[data-slot="switch"]')).toBeInTheDocument();
    });

    it("merges className into slot", () => {
      const { container } = render(<Switch.Root className="__test-class__" />);
      expect(container.querySelector('[data-slot="switch"]')).toHaveClass("__test-class__");
    });
  });

  describeSlots("switch", Switch, {
    Root: { slot: "switch", skipRender: true },
    Thumb: { slot: "switch-thumb" },
  }, {
    wrapper: (children) => (
      <Switch.Root>{children}</Switch.Root>
    ),
  });
});
```

- [ ] **Step 14: Create tabs.test.tsx**

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Tabs } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Tabs", () => {
  describe("Root", () => {
    it('renders with data-slot="tabs"', () => {
      const { container } = render(<Tabs.Root />);
      expect(container.querySelector('[data-slot="tabs"]')).toBeInTheDocument();
    });

    it("merges className into slot", () => {
      const { container } = render(<Tabs.Root className="__test-class__" />);
      expect(container.querySelector('[data-slot="tabs"]')).toHaveClass("__test-class__");
    });
  });

  describeSlots("tabs", Tabs, {
    Root: { slot: "tabs", skipRender: true },
    List: { slot: "tabs-list" },
    Tab: { slot: "tabs-tab" },
    Indicator: { slot: "tabs-indicator" },
    Panel: { slot: "tabs-panel" },
  }, {
    wrapper: (children) => (
      <Tabs.Root defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">A</Tabs.Tab>
        </Tabs.List>
        {children}
      </Tabs.Root>
    ),
  });
});
```

- [ ] **Step 15: Create toolbar.test.tsx**

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Toolbar } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Toolbar", () => {
  describe("Root", () => {
    it('renders with data-slot="toolbar"', () => {
      const { container } = render(<Toolbar.Root />);
      expect(container.querySelector('[data-slot="toolbar"]')).toBeInTheDocument();
    });

    it("merges className into slot", () => {
      const { container } = render(<Toolbar.Root className="__test-class__" />);
      expect(container.querySelector('[data-slot="toolbar"]')).toHaveClass("__test-class__");
    });
  });

  describeSlots("toolbar", Toolbar, {
    Root: { slot: "toolbar", skipRender: true },
    Group: { slot: "toolbar-group" },
    Button: { slot: "toolbar-button" },
    Link: { slot: "toolbar-link" },
    Input: { slot: "toolbar-input" },
    Separator: { slot: "toolbar-separator" },
  }, {
    wrapper: (children) => (
      <Toolbar.Root>{children}</Toolbar.Root>
    ),
  });
});
```

- [ ] **Step 16: Run all self-contained multi-part tests**

Run:
```bash
pnpm test registry/bare/ui/accordion registry/bare/ui/avatar registry/bare/ui/checkbox registry/bare/ui/collapsible registry/bare/ui/field registry/bare/ui/fieldset registry/bare/ui/meter registry/bare/ui/number-field registry/bare/ui/progress registry/bare/ui/radio registry/bare/ui/scroll-area registry/bare/ui/slider registry/bare/ui/switch registry/bare/ui/tabs registry/bare/ui/toolbar
```
Expected: All tests PASS. If any fail due to base-ui rendering quirks (e.g. a part needs specific required props, or a part doesn't accept className), fix the specific test — the pattern is correct but some primitives may have constraints.

- [ ] **Step 17: Commit**

```bash
git add registry/bare/ui/accordion/accordion.test.tsx registry/bare/ui/avatar/avatar.test.tsx registry/bare/ui/checkbox/checkbox.test.tsx registry/bare/ui/collapsible/collapsible.test.tsx registry/bare/ui/field/field.test.tsx registry/bare/ui/fieldset/fieldset.test.tsx registry/bare/ui/meter/meter.test.tsx registry/bare/ui/number-field/number-field.test.tsx registry/bare/ui/progress/progress.test.tsx registry/bare/ui/radio/radio.test.tsx registry/bare/ui/scroll-area/scroll-area.test.tsx registry/bare/ui/slider/slider.test.tsx registry/bare/ui/switch/switch.test.tsx registry/bare/ui/tabs/tabs.test.tsx registry/bare/ui/toolbar/toolbar.test.tsx
git commit -m "test: add self-contained multi-part component tests"
```

---

### Task 8: Test overlay multi-part components (dialog, drawer, popover, etc.)

These components have Root that doesn't render DOM (pure context provider), and parts that require open state or portals.

**Files:**
- Create: `registry/bare/ui/dialog/dialog.test.tsx`
- Create: `registry/bare/ui/alert-dialog/alert-dialog.test.tsx`
- Create: `registry/bare/ui/drawer/drawer.test.tsx`
- Create: `registry/bare/ui/popover/popover.test.tsx`
- Create: `registry/bare/ui/preview-card/preview-card.test.tsx`
- Create: `registry/bare/ui/tooltip/tooltip.test.tsx`

- [ ] **Step 1: Create dialog.test.tsx**

```tsx
import { describe } from "vitest";
import { Dialog } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Dialog", () => {
  describeSlots("dialog", Dialog, {
    Root: { slot: "dialog", skipRender: true },
    Trigger: { slot: "dialog-trigger" },
    Portal: { slot: "dialog-portal", skipRender: true },
    Backdrop: { slot: "dialog-backdrop" },
    Popup: { slot: "dialog-popup" },
    Viewport: { slot: "dialog-viewport" },
    Title: { slot: "dialog-title" },
    Description: { slot: "dialog-description" },
    Close: { slot: "dialog-close" },
  }, {
    wrapper: (children) => (
      <Dialog.Root open>{children}</Dialog.Root>
    ),
  });
});
```

- [ ] **Step 2: Create alert-dialog.test.tsx**

```tsx
import { describe } from "vitest";
import { AlertDialog } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("AlertDialog", () => {
  describeSlots("alert-dialog", AlertDialog, {
    Root: { slot: "alert-dialog", skipRender: true },
    Trigger: { slot: "alert-dialog-trigger" },
    Portal: { slot: "alert-dialog-portal", skipRender: true },
    Backdrop: { slot: "alert-dialog-backdrop" },
    Popup: { slot: "alert-dialog-popup" },
    Viewport: { slot: "alert-dialog-viewport" },
    Title: { slot: "alert-dialog-title" },
    Description: { slot: "alert-dialog-description" },
    Close: { slot: "alert-dialog-close" },
  }, {
    wrapper: (children) => (
      <AlertDialog.Root open>{children}</AlertDialog.Root>
    ),
  });
});
```

- [ ] **Step 3: Create drawer.test.tsx**

```tsx
import { describe } from "vitest";
import { Drawer } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Drawer", () => {
  describeSlots("drawer", Drawer, {
    Root: { slot: "drawer", skipRender: true },
    Provider: { slot: "drawer-provider", skipRender: true },
    Trigger: { slot: "drawer-trigger" },
    Portal: { slot: "drawer-portal", skipRender: true },
    Backdrop: { slot: "drawer-backdrop" },
    Popup: { slot: "drawer-popup" },
    SwipeArea: { slot: "drawer-swipe-area" },
    Content: { slot: "drawer-content" },
    Viewport: { slot: "drawer-viewport" },
    Title: { slot: "drawer-title" },
    Description: { slot: "drawer-description" },
    Close: { slot: "drawer-close" },
    Indent: { slot: "drawer-indent" },
    IndentBackground: { slot: "drawer-indent-background" },
  }, {
    wrapper: (children) => (
      <Drawer.Root open>{children}</Drawer.Root>
    ),
  });
});
```

- [ ] **Step 4: Create popover.test.tsx**

```tsx
import { describe } from "vitest";
import { Popover } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Popover", () => {
  describeSlots("popover", Popover, {
    Root: { slot: "popover", skipRender: true },
    Trigger: { slot: "popover-trigger" },
    Portal: { slot: "popover-portal", skipRender: true },
    Backdrop: { slot: "popover-backdrop" },
    Positioner: { slot: "popover-positioner" },
    Popup: { slot: "popover-popup" },
    Arrow: { slot: "popover-arrow" },
    Title: { slot: "popover-title" },
    Description: { slot: "popover-description" },
    Close: { slot: "popover-close" },
  }, {
    wrapper: (children) => (
      <Popover.Root open>{children}</Popover.Root>
    ),
  });
});
```

- [ ] **Step 5: Create preview-card.test.tsx**

```tsx
import { describe } from "vitest";
import { PreviewCard } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("PreviewCard", () => {
  describeSlots("preview-card", PreviewCard, {
    Root: { slot: "preview-card", skipRender: true },
    Trigger: { slot: "preview-card-trigger" },
    Portal: { slot: "preview-card-portal", skipRender: true },
    Backdrop: { slot: "preview-card-backdrop" },
    Positioner: { slot: "preview-card-positioner" },
    Popup: { slot: "preview-card-popup" },
    Arrow: { slot: "preview-card-arrow" },
    Viewport: { slot: "preview-card-viewport" },
  }, {
    wrapper: (children) => (
      <PreviewCard.Root open>{children}</PreviewCard.Root>
    ),
  });
});
```

- [ ] **Step 6: Create tooltip.test.tsx**

```tsx
import { describe } from "vitest";
import { Tooltip } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Tooltip", () => {
  describeSlots("tooltip", Tooltip, {
    Root: { slot: "tooltip", skipRender: true },
    Trigger: { slot: "tooltip-trigger" },
    Portal: { slot: "tooltip-portal", skipRender: true },
    Positioner: { slot: "tooltip-positioner" },
    Popup: { slot: "tooltip-popup" },
    Arrow: { slot: "tooltip-arrow" },
  }, {
    wrapper: (children) => (
      <Tooltip.Root open>{children}</Tooltip.Root>
    ),
  });
});
```

- [ ] **Step 7: Run overlay tests**

Run:
```bash
pnpm test registry/bare/ui/dialog registry/bare/ui/alert-dialog registry/bare/ui/drawer registry/bare/ui/popover registry/bare/ui/preview-card registry/bare/ui/tooltip
```
Expected: All tests PASS.

- [ ] **Step 8: Commit**

```bash
git add registry/bare/ui/dialog/dialog.test.tsx registry/bare/ui/alert-dialog/alert-dialog.test.tsx registry/bare/ui/drawer/drawer.test.tsx registry/bare/ui/popover/popover.test.tsx registry/bare/ui/preview-card/preview-card.test.tsx registry/bare/ui/tooltip/tooltip.test.tsx
git commit -m "test: add overlay multi-part component tests"
```

---

### Task 9: Test complex multi-part components (select, menu, combobox, etc.)

These components have many parts and some non-DOM parts (Root, Value, Collection, SubmenuRoot).

**Files:**
- Create: `registry/bare/ui/select/select.test.tsx`
- Create: `registry/bare/ui/menu/menu.test.tsx`
- Create: `registry/bare/ui/context-menu/context-menu.test.tsx`
- Create: `registry/bare/ui/combobox/combobox.test.tsx`
- Create: `registry/bare/ui/autocomplete/autocomplete.test.tsx`
- Create: `registry/bare/ui/navigation-menu/navigation-menu.test.tsx`
- Create: `registry/bare/ui/toast/toast.test.tsx`

- [ ] **Step 1: Create select.test.tsx**

```tsx
import { describe } from "vitest";
import { Select } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Select", () => {
  describeSlots("select", Select, {
    Root: { slot: "select", skipRender: true },
    Trigger: { slot: "select-trigger" },
    Value: { slot: "select-value" },
    Icon: { slot: "select-icon" },
    Portal: { slot: "select-portal", skipRender: true },
    Backdrop: { slot: "select-backdrop" },
    Positioner: { slot: "select-positioner" },
    Popup: { slot: "select-popup" },
    Item: { slot: "select-item" },
    ItemText: { slot: "select-item-text" },
    ItemIndicator: { slot: "select-item-indicator" },
    Group: { slot: "select-group" },
    GroupLabel: { slot: "select-group-label" },
    Arrow: { slot: "select-arrow" },
    Separator: { slot: "select-separator" },
  }, {
    wrapper: (children) => (
      <Select.Root open>{children}</Select.Root>
    ),
  });
});
```

- [ ] **Step 2: Create menu.test.tsx**

```tsx
import { describe } from "vitest";
import { Menu } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Menu", () => {
  describeSlots("menu", Menu, {
    Root: { slot: "menu", skipRender: true },
    SubmenuRoot: { slot: "menu-submenu", skipRender: true },
    Trigger: { slot: "menu-trigger" },
    SubmenuTrigger: { slot: "menu-submenu-trigger" },
    Portal: { slot: "menu-portal", skipRender: true },
    Backdrop: { slot: "menu-backdrop" },
    Positioner: { slot: "menu-positioner" },
    Popup: { slot: "menu-popup" },
    Viewport: { slot: "menu-viewport" },
    Arrow: { slot: "menu-arrow" },
    Item: { slot: "menu-item" },
    LinkItem: { slot: "menu-link-item" },
    Group: { slot: "menu-group" },
    GroupLabel: { slot: "menu-group-label" },
    RadioGroup: { slot: "menu-radio-group" },
    RadioItem: { slot: "menu-radio-item" },
    RadioItemIndicator: { slot: "menu-radio-item-indicator" },
    CheckboxItem: { slot: "menu-checkbox-item" },
    CheckboxItemIndicator: { slot: "menu-checkbox-item-indicator" },
  }, {
    wrapper: (children) => (
      <Menu.Root open>{children}</Menu.Root>
    ),
  });
});
```

- [ ] **Step 3: Create context-menu.test.tsx**

```tsx
import { describe } from "vitest";
import { ContextMenu } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("ContextMenu", () => {
  describeSlots("context-menu", ContextMenu, {
    Root: { slot: "context-menu", skipRender: true },
    Trigger: { slot: "context-menu-trigger" },
    SubmenuRoot: { slot: "context-menu-submenu", skipRender: true },
    SubmenuTrigger: { slot: "context-menu-submenu-trigger" },
    Portal: { slot: "context-menu-portal", skipRender: true },
    Backdrop: { slot: "context-menu-backdrop" },
    Positioner: { slot: "context-menu-positioner" },
    Popup: { slot: "context-menu-popup" },
    Arrow: { slot: "context-menu-arrow" },
    Item: { slot: "context-menu-item" },
    LinkItem: { slot: "context-menu-link-item" },
    Group: { slot: "context-menu-group" },
    GroupLabel: { slot: "context-menu-group-label" },
    RadioGroup: { slot: "context-menu-radio-group" },
    RadioItem: { slot: "context-menu-radio-item" },
    RadioItemIndicator: { slot: "context-menu-radio-item-indicator" },
    CheckboxItem: { slot: "context-menu-checkbox-item" },
    CheckboxItemIndicator: { slot: "context-menu-checkbox-item-indicator" },
  }, {
    wrapper: (children) => (
      <ContextMenu.Root open>{children}</ContextMenu.Root>
    ),
  });
});
```

- [ ] **Step 4: Create combobox.test.tsx**

```tsx
import { describe } from "vitest";
import { Combobox } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Combobox", () => {
  describeSlots("combobox", Combobox, {
    Root: { slot: "combobox", skipRender: true },
    Value: { slot: "combobox-value", skipRender: true },
    Collection: { slot: "combobox-collection", skipRender: true },
    Label: { slot: "combobox-label" },
    Trigger: { slot: "combobox-trigger" },
    Input: { slot: "combobox-input" },
    InputGroup: { slot: "combobox-input-group" },
    Chips: { slot: "combobox-chips" },
    Chip: { slot: "combobox-chip" },
    ChipRemove: { slot: "combobox-chip-remove" },
    Clear: { slot: "combobox-clear" },
    Icon: { slot: "combobox-icon" },
    Portal: { slot: "combobox-portal", skipRender: true },
    Backdrop: { slot: "combobox-backdrop" },
    Positioner: { slot: "combobox-positioner" },
    Popup: { slot: "combobox-popup" },
    Arrow: { slot: "combobox-arrow" },
    List: { slot: "combobox-list" },
    Row: { slot: "combobox-row" },
    Item: { slot: "combobox-item" },
    ItemIndicator: { slot: "combobox-item-indicator" },
    Group: { slot: "combobox-group" },
    GroupLabel: { slot: "combobox-group-label" },
    Empty: { slot: "combobox-empty" },
    Status: { slot: "combobox-status" },
  }, {
    wrapper: (children) => (
      <Combobox.Root open>{children}</Combobox.Root>
    ),
  });
});
```

- [ ] **Step 5: Create autocomplete.test.tsx**

```tsx
import { describe } from "vitest";
import { Autocomplete } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Autocomplete", () => {
  describeSlots("autocomplete", Autocomplete, {
    Root: { slot: "autocomplete", skipRender: true },
    Value: { slot: "autocomplete-value", skipRender: true },
    Collection: { slot: "autocomplete-collection", skipRender: true },
    Trigger: { slot: "autocomplete-trigger" },
    Input: { slot: "autocomplete-input" },
    InputGroup: { slot: "autocomplete-input-group" },
    Icon: { slot: "autocomplete-icon" },
    Clear: { slot: "autocomplete-clear" },
    Portal: { slot: "autocomplete-portal", skipRender: true },
    Backdrop: { slot: "autocomplete-backdrop" },
    Positioner: { slot: "autocomplete-positioner" },
    Popup: { slot: "autocomplete-popup" },
    Arrow: { slot: "autocomplete-arrow" },
    List: { slot: "autocomplete-list" },
    Row: { slot: "autocomplete-row" },
    Item: { slot: "autocomplete-item" },
    Group: { slot: "autocomplete-group" },
    GroupLabel: { slot: "autocomplete-group-label" },
    Empty: { slot: "autocomplete-empty" },
    Status: { slot: "autocomplete-status" },
  }, {
    wrapper: (children) => (
      <Autocomplete.Root open>{children}</Autocomplete.Root>
    ),
  });
});
```

- [ ] **Step 6: Create navigation-menu.test.tsx**

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { NavigationMenu } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("NavigationMenu", () => {
  describe("Root", () => {
    it('renders with data-slot="navigation-menu"', () => {
      const { container } = render(<NavigationMenu.Root />);
      expect(container.querySelector('[data-slot="navigation-menu"]')).toBeInTheDocument();
    });

    it("merges className into slot", () => {
      const { container } = render(<NavigationMenu.Root className="__test-class__" />);
      expect(container.querySelector('[data-slot="navigation-menu"]')).toHaveClass("__test-class__");
    });
  });

  describeSlots("navigation-menu", NavigationMenu, {
    Root: { slot: "navigation-menu", skipRender: true },
    List: { slot: "navigation-menu-list" },
    Item: { slot: "navigation-menu-item" },
    Trigger: { slot: "navigation-menu-trigger" },
    Icon: { slot: "navigation-menu-icon" },
    Content: { slot: "navigation-menu-content" },
    Link: { slot: "navigation-menu-link" },
    Portal: { slot: "navigation-menu-portal", skipRender: true },
    Backdrop: { slot: "navigation-menu-backdrop" },
    Positioner: { slot: "navigation-menu-positioner" },
    Popup: { slot: "navigation-menu-popup" },
    Viewport: { slot: "navigation-menu-viewport" },
    Arrow: { slot: "navigation-menu-arrow" },
  }, {
    wrapper: (children) => (
      <NavigationMenu.Root>
        <NavigationMenu.List>
          <NavigationMenu.Item value="test">
            {children}
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    ),
  });
});
```

- [ ] **Step 7: Create toast.test.tsx**

Toast is unique: Provider wraps the whole tree, Root provides StyleContext AND renders DOM, and parts are nested inside Root.

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Toast } from "./index";
import { describeSlots } from "@/registry/bare/lib/testing-utils";

describe("Toast", () => {
  it("exports Provider", () => {
    expect(Toast.Provider).toBeDefined();
  });

  describeSlots("toast", Toast, {
    Provider: { slot: "toast-provider", skipRender: true },
    Portal: { slot: "toast-portal", skipRender: true },
    Viewport: { slot: "toast-viewport" },
    Positioner: { slot: "toast-positioner" },
    Root: { slot: "toast", skipRender: true },
    Content: { slot: "toast-content" },
    Title: { slot: "toast-title" },
    Description: { slot: "toast-description" },
    Action: { slot: "toast-action" },
    Close: { slot: "toast-close" },
    Arrow: { slot: "toast-arrow" },
  }, {
    wrapper: (children) => (
      <Toast.Provider>
        <Toast.Portal>
          <Toast.Viewport>
            <Toast.Positioner>
              <Toast.Root>
                {children}
              </Toast.Root>
            </Toast.Positioner>
          </Toast.Viewport>
        </Toast.Portal>
      </Toast.Provider>
    ),
  });
});
```

Note: Toast's complex nesting (Provider > Portal > Viewport > Positioner > Root > parts) means some parts may need the full hierarchy to render. The wrapper above covers this. If specific parts fail because base-ui requires toast state, mark those parts `skipRender` and add a comment explaining why.

- [ ] **Step 8: Run complex component tests**

Run:
```bash
pnpm test registry/bare/ui/select registry/bare/ui/menu registry/bare/ui/context-menu registry/bare/ui/combobox registry/bare/ui/autocomplete registry/bare/ui/navigation-menu registry/bare/ui/toast
```
Expected: All tests PASS. Some parts may need adjustments if base-ui primitives have specific prop requirements — fix as needed.

- [ ] **Step 9: Commit**

```bash
git add registry/bare/ui/select/select.test.tsx registry/bare/ui/menu/menu.test.tsx registry/bare/ui/context-menu/context-menu.test.tsx registry/bare/ui/combobox/combobox.test.tsx registry/bare/ui/autocomplete/autocomplete.test.tsx registry/bare/ui/navigation-menu/navigation-menu.test.tsx registry/bare/ui/toast/toast.test.tsx
git commit -m "test: add complex multi-part component tests"
```

---

### Task 10: Add registry build integrity test

**Files:**
- Create: `registry/bare/registry-build.test.ts`

- [ ] **Step 1: Write the test**

Create `registry/bare/registry-build.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { execSync } from "node:child_process";

describe("registry build integrity", () => {
  it("public/r/*.json is in sync with source", () => {
    execSync("pnpm registry:build", { stdio: "pipe" });

    const diff = execSync("git diff --name-only public/r/", { encoding: "utf-8" }).trim();

    expect(diff).toBe("");
  }, 30_000);
});
```

The 30-second timeout accounts for the shadcn build time.

- [ ] **Step 2: Run the test**

Run:
```bash
pnpm test registry/bare/registry-build.test.ts
```
Expected: PASS (assuming `public/r/*.json` is already in sync).

- [ ] **Step 3: Commit**

```bash
git add registry/bare/registry-build.test.ts
git commit -m "test: add registry build integrity check"
```

---

### Task 11: Run full test suite and verify

- [ ] **Step 1: Run all tests**

Run:
```bash
pnpm test
```
Expected: All tests pass. Note the total count — should be roughly:
- 5 (createPropSplitter) + 3 (createStyleContext) + 3 (tv config) + 1 (helper self-test) + ~120-180 component tests + 1 (registry build) ≈ 130-190 tests total.

- [ ] **Step 2: Run typecheck**

Run:
```bash
pnpm tsc --noEmit
```
Expected: No errors.

- [ ] **Step 3: Commit any fixes from the full run**

If any tests needed adjustments during the full run, commit those fixes:

```bash
git add -u
git commit -m "test: fix test adjustments from full suite run"
```
