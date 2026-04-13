# Test Infrastructure Design

## Goal

Add test infrastructure to bare-ui so that shared utilities and all 34 components are tested for correctness. Tests verify what bare-ui owns — prop splitting, style context wiring, slot application, `data-slot` attributes, and registry build integrity — not the underlying base-ui primitives.

## Tooling

| Package | Purpose |
|---|---|
| `vitest` | Test runner. Native ESM, fast, works with `"type": "module"` |
| `@testing-library/react` | Component rendering and DOM queries |
| `@testing-library/jest-dom` | DOM matchers (`toHaveAttribute`, `toHaveClass`, etc.) |
| `jsdom` | DOM environment for Vitest |

## Configuration

### `vitest.config.ts`

- Environment: `jsdom`
- Path alias: `@/*` → repo root (mirrors `tsconfig.json`)
- Setup file: `vitest.setup.ts` (imports `@testing-library/jest-dom/vitest`)
- Include: `registry/**/*.test.{ts,tsx}`

### `vitest.setup.ts`

Imports `@testing-library/jest-dom/vitest` to register DOM matchers globally.

### `package.json` changes

- Add `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom` to `devDependencies`
- Add scripts: `"test": "vitest run"`, `"test:watch": "vitest"`

### `tsconfig.json`

No changes needed — `registry/**/*` is already included, so test files are covered.

## Test Architecture

### Shared helper: `registry/bare/lib/testing-utils.tsx`

Two exports:

**`renderComponent(ui, options?)`** — thin wrapper around `@testing-library/react`'s `render`. Single import point that can grow if components ever need a shared provider.

**`describeSlots(name, Component, slots, options?)`** — generates standard assertions for any component. Parameters:

- `name` — component name (e.g. `"button"`, `"dialog"`)
- `Component` — the namespace export (e.g. `Button`, `Dialog`)
- `slots` — map of part names to config:
  ```ts
  {
    Root: { slot: "button" },
  }
  // or for multi-part:
  {
    Root: { slot: "dialog", skipRender: true },
    Trigger: { slot: "dialog-trigger" },
    Popup: { slot: "dialog-popup" },
  }
  ```
- `options.wrapper?` — function that wraps parts in required parent context

For each slot entry (unless `skipRender: true`), it generates:

1. **`data-slot` test** — renders the part, asserts `data-slot="<expected>"` is present
2. **className merge test** — passes `className="test-class"`, asserts it appears on the element
3. **Context error test** (multi-part only, when wrapper is provided) — renders the part _outside_ Root, asserts it throws the expected `createStyleContext` error

`skipRender: true` is for parts that don't render a DOM element (context providers, portals, logical wrappers).

### Helper self-test: `registry/bare/lib/testing-utils.test.ts`

Verifies that `describeSlots` actually generates and runs assertions, not silently passing.

## Utility Tests

### `registry/bare/lib/split-variant-props.test.ts`

Tests for `createPropSplitter`:

- Correctly splits known variant keys from HTML props
- Passes through unknown props as rest
- Handles empty props
- Handles all-variant props
- Handles no-variant props
- Works with the `variantKeys` array that `tv()` attaches at runtime

### `registry/bare/lib/create-style-context.test.tsx`

Tests for `createStyleContext`:

- `useStyles()` returns the value provided by `StyleContext`
- `useStyles()` throws with the correct component name when used outside context
- Context value updates propagate to consumers

### `registry/bare/lib/tv.config.test.ts`

Sanity tests for `tv`:

- `tv()` returns a function with a `variantKeys` property
- Slot functions accept `{ class: "..." }` and merge it
- `twMerge` is enabled (conflicting Tailwind classes resolve correctly)

## Component Tests

One test file per component, colocated next to source. Each file calls `describeSlots` with the component's parts map.

### Single-part example: `registry/bare/ui/button/button.test.tsx`

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

### Multi-part example: `registry/bare/ui/dialog/dialog.test.tsx`

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

### Test output structure

```
Dialog
  ├── Root
  │   └── ✓ skipped (no DOM element)
  ├── Trigger
  │   ├── ✓ renders with data-slot="dialog-trigger"
  │   ├── ✓ merges className into slot
  │   └── ✓ throws when rendered outside Root
  ├── Popup
  │   ├── ✓ renders with data-slot="dialog-popup"
  │   ├── ✓ merges className into slot
  │   └── ✓ throws when rendered outside Root
  ...
```

## Registry Build Integrity Test

### `registry/bare/registry-build.test.ts`

- Runs `pnpm registry:build` via `child_process`
- Checks `git diff --name-only public/r/` for changes
- Fails with a clear message if `public/r/*.json` is out of sync with source

## File Inventory

### New files (42 total)

| File | Purpose |
|---|---|
| `vitest.config.ts` | Vitest configuration |
| `vitest.setup.ts` | Global test setup |
| `registry/bare/lib/testing-utils.tsx` | Shared test helpers |
| `registry/bare/lib/testing-utils.test.ts` | Helper self-test |
| `registry/bare/lib/split-variant-props.test.ts` | `createPropSplitter` tests |
| `registry/bare/lib/create-style-context.test.tsx` | `createStyleContext` tests |
| `registry/bare/lib/tv.config.test.ts` | `tv` config tests |
| `registry/bare/registry-build.test.ts` | Build integrity test |
| `registry/bare/ui/<name>/<name>.test.tsx` | One per component (34 files) |

### Modified files (1)

| File | Change |
|---|---|
| `package.json` | Add devDependencies + test scripts |

### Not modified

- `registry.json` — test files are not registry items
- `public/r/*.json` — no rebuild needed
- `tsconfig.json` — `registry/**/*` already covers test files
