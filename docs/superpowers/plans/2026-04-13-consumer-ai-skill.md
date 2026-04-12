# Consumer AI Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create `skills/bare-ui/SKILL.md` — a single reference ruleset that teaches AI coding assistants how to work with bare-ui components in consumer projects.

**Architecture:** One markdown file with YAML frontmatter, five content sections covering component anatomy, styling, extending, theming, and invariants. Installed via `npx skills add ng-hai/bare-ui`.

**Tech Stack:** Markdown with YAML frontmatter (Agent Skills specification)

---

### Task 1: Create the SKILL.md file with frontmatter and Section 1

**Files:**
- Create: `skills/bare-ui/SKILL.md`

- [ ] **Step 1: Create directory and file**

```bash
mkdir -p skills/bare-ui
```

Write `skills/bare-ui/SKILL.md` with the YAML frontmatter and Section 1:

````markdown
---
name: bare-ui
description: Rules for working with bare-ui unstyled components — styling, extending, theming, and troubleshooting
---

# bare-ui

bare-ui is an unstyled component registry built on [@base-ui/react](https://base-ui.com). Components are installed via `shadcn add` and copied into your project under `components/ui/<name>/`. There is no npm package — you own the code. Styles are intentionally empty; you fill them in with Tailwind classes.

## Component anatomy

Every component in `components/ui/<name>/` follows the same structure:

| File | Purpose |
|---|---|
| `styles.ts` | Tailwind Variants definition — `tv({ slots, variants })`. Slot arrays are empty by default. |
| `<name>-root.tsx` | Wires up the Base UI primitive. Splits variant props via `createPropSplitter`. For multi-part components, wraps children in a `StyleContext`. |
| `<name>-<part>.tsx` | One file per part. Consumes styles from the root's `StyleContext` via `useStyles()`. Sets `data-slot`. |
| `index.parts.ts` | Re-exports parts under short names (`Root`, `Trigger`, `Popup`, etc.). |
| `index.ts` | Public entry — `export * as <Name> from "./index.parts"` plus `export { <name>Styles }`. |

**Single-part example (button):**

```
components/ui/button/
├── button-root.tsx      ← renders <button> with styles from root slot
├── styles.ts            ← one slot: root
├── index.parts.ts       ← exports Root
└── index.ts             ← export * as Button from "./index.parts"
```

**Multi-part example (select):**

```
components/ui/select/
├── select-root.tsx      ← provides StyleContext to children
├── select-trigger.tsx   ← useSelectStyles().trigger
├── select-popup.tsx     ← useSelectStyles().popup
├── select-item.tsx      ← useSelectStyles().item
├── ...                  ← one file per part
├── styles.ts            ← slots: root, trigger, popup, item, ...
├── index.parts.ts       ← exports Root, Trigger, Popup, Item, ...
└── index.ts             ← export * as Select from "./index.parts"
```

**Usage pattern — all components use namespaced imports:**

```tsx
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

<Button.Root>Click me</Button.Root>

<Select.Root>
  <Select.Trigger>
    <Select.Value />
  </Select.Trigger>
  <Select.Portal>
    <Select.Positioner>
      <Select.Popup>
        <Select.Item value="a">
          <Select.ItemText>Option A</Select.ItemText>
        </Select.Item>
      </Select.Popup>
    </Select.Positioner>
  </Select.Portal>
</Select.Root>
```
````

- [ ] **Step 2: Verify frontmatter is valid YAML**

Read back `skills/bare-ui/SKILL.md` and confirm the `---` delimited frontmatter contains `name` and `description` fields.

- [ ] **Step 3: Commit**

```bash
git add skills/bare-ui/SKILL.md
git commit -m "feat(skill): add bare-ui consumer skill — frontmatter and anatomy section"
```

---

### Task 2: Add Section 3 — How to style components

**Files:**
- Modify: `skills/bare-ui/SKILL.md`

- [ ] **Step 1: Append the styling section**

Add the following after the component anatomy section:

````markdown
## How to style components

### Fill in slot arrays

Open `styles.ts` and add Tailwind classes to the slot arrays. Each slot maps to a component part — `root` styles the `<Name>.Root`, `trigger` styles `<Name>.Trigger`, etc.

**Before (unstyled):**

```ts
import { tv } from "@/lib/tv.config";

export const buttonStyles = tv({
  slots: {
    root: [""],
  },
});
```

**After (styled with variants):**

```ts
import { tv } from "@/lib/tv.config";

export const buttonStyles = tv({
  slots: {
    root: [
      "inline-flex items-center justify-center gap-2 rounded-default font-medium",
      "transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
      "disabled:pointer-events-none disabled:opacity-50",
    ],
  },
  variants: {
    variant: {
      solid: { root: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" },
      outline: { root: "border border-border text-primary hover:bg-primary/10" },
      ghost: { root: "text-primary hover:bg-primary/10" },
      destructive: { root: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90" },
    },
    size: {
      sm: { root: "h-8 px-3 text-xs" },
      md: { root: "h-10 px-4 text-sm" },
      lg: { root: "h-12 px-6 text-base" },
    },
  },
  defaultVariants: {
    variant: "solid",
    size: "md",
  },
});
```

### Add variants

Add a `variants` block and `defaultVariants` to the `tv()` call. `createPropSplitter` in the root component discovers new variant keys at runtime — no changes to `.tsx` files needed. Variant props become available on the root component automatically:

```tsx
<Button.Root variant="outline" size="lg">Click me</Button.Root>
```

### Design tokens via @theme

Create a CSS file with a Tailwind `@theme` block and `@import` it in your `globals.css`:

```css
/* styles/theme.css */
@theme {
  --color-primary: oklch(0.55 0.25 262);
  --color-primary-foreground: oklch(0.97 0.01 255);
  --color-destructive: oklch(0.58 0.22 29);
  --color-destructive-foreground: oklch(0.97 0.01 29);
  --color-surface: oklch(1 0 0);
  --color-surface-foreground: oklch(0.15 0.01 286);
  --color-border: oklch(0.9 0.01 262);
  --color-ring: oklch(0.7 0.16 262);
  --radius-default: 0.5rem;
  --shadow-sm: 0 1px 2px 0 oklch(0 0 0 / 5%);
}
```

Then reference tokens in `styles.ts` via Tailwind utility classes: `bg-primary`, `text-surface-foreground`, `rounded-default`, etc.

### One-off overrides

Use the `className` prop on any part. It merges with slot styles via `twMerge`:

```tsx
<Button.Root className="mt-4 w-full">Full width button</Button.Root>
```

### Preset injection

Root components accept an optional `styles` prop to inject a pre-computed styles object, bypassing variant resolution:

```tsx
const precomputed = buttonStyles({ variant: "solid", size: "lg" });
<Button.Root styles={precomputed}>Preset button</Button.Root>
```
````

- [ ] **Step 2: Read back file and verify examples match actual code patterns**

Confirm the `styles.ts` examples use the same import path (`@/lib/tv.config`) and structure (`tv({ slots, variants, defaultVariants })`) as the real components. Note: in consumer projects, shadcn rewrites `@/registry/bare/lib/` to `@/lib/`.

- [ ] **Step 3: Commit**

```bash
git add skills/bare-ui/SKILL.md
git commit -m "feat(skill): add styling section — slots, variants, tokens, overrides"
```

---

### Task 3: Add Section 4 — How to extend components

**Files:**
- Modify: `skills/bare-ui/SKILL.md`

- [ ] **Step 1: Append the extending section**

Add the following after the styling section:

````markdown
## How to extend components

To add a new part to an existing multi-part component:

1. **Add a slot** in `styles.ts`:

```ts
export const dialogStyles = tv({
  slots: {
    // ... existing slots
    closeButton: [
      "absolute top-4 right-4 inline-flex items-center justify-center",
      "rounded-sm size-6 text-muted-foreground hover:text-surface-foreground",
      "transition-colors",
    ],
  },
});
```

2. **Create the part file** `components/ui/dialog/dialog-close-button.tsx`:

```tsx
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { useDialogStyles } from "./dialog-root";

interface DialogCloseButtonProps extends DialogPrimitive.Close.Props {
  className?: string;
}

export function DialogCloseButton({ className, children, ...props }: DialogCloseButtonProps) {
  const styles = useDialogStyles();
  return (
    <DialogPrimitive.Close
      {...props}
      className={styles.closeButton({ class: className })}
      data-slot="dialog-close-button"
    >
      {children ?? (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )}
    </DialogPrimitive.Close>
  );
}
```

3. **Export from `index.parts.ts`:**

```ts
// Add to existing exports:
export { DialogCloseButton as CloseButton } from "./dialog-close-button";
```

No changes to `index.ts` — it re-exports everything from `index.parts.ts` via `export * as Dialog from "./index.parts"`.

The pattern for every new part:
- One file per part, named `<component>-<part>.tsx`
- Get styles via `use<Name>Styles()` from the root
- Apply the matching slot: `className={styles.<slotName>({ class: className })}`
- Set `data-slot="<component>-<part>"`
- Export from `index.parts.ts` under a short name
````

- [ ] **Step 2: Verify the example matches the actual `dialog-close-button.tsx`**

Read `registry/bare/preset/default/dialog/dialog-close-button.tsx` and confirm the skill example follows the same pattern (imports, style context usage, data-slot, className merge).

- [ ] **Step 3: Commit**

```bash
git add skills/bare-ui/SKILL.md
git commit -m "feat(skill): add extending section — new parts with example"
```

---

### Task 4: Add Section 5 — Invariants

**Files:**
- Modify: `skills/bare-ui/SKILL.md`

- [ ] **Step 1: Append the invariants section**

Add the following after the extending section:

````markdown
## Rules

These are invariants. Never break them when modifying bare-ui components.

- **All styling goes in `styles.ts`.** Never put Tailwind classes directly in `.tsx` files. The only exception is the `className` prop pass-through for consumer overrides.
- **Never hand-pluck variant props.** The root component uses `createPropSplitter` which reads `variantKeys` at runtime. When you add variants to `styles.ts`, the root component picks them up automatically. Don't destructure variant props manually.
- **One file per part.** Each component part lives in its own `<name>-<part>.tsx` file. Never combine multiple parts into a single file.
- **Always set `data-slot`.** Every rendered primitive must have `data-slot="<component-name>"` or `data-slot="<component>-<part>"`. Consumers use these as CSS selector hooks.
- **Keep the `styles` prop.** Root components accept an optional `styles` prop for preset injection. Never remove it.
- **Keep barrel exports in sync.** If you add or remove a part, update `index.parts.ts`. The `index.ts` file re-exports from `index.parts.ts` and rarely needs changes.
- **Don't modify shared libs.** `lib/tv.config.ts`, `lib/create-style-context.ts`, and `lib/split-variant-props.ts` are shared infrastructure. Don't edit them when working on a specific component.
- **Use Base UI primitives.** Components wrap `@base-ui/react` primitives for behavior and ARIA. Refer to [base-ui.com](https://base-ui.com) for the primitive API.
````

- [ ] **Step 2: Read back the full file and verify completeness**

Read `skills/bare-ui/SKILL.md` from top to bottom. Confirm it has:
1. Valid YAML frontmatter with `name` and `description`
2. Section: what bare-ui is (intro paragraph)
3. Section: component anatomy (table, two examples, usage pattern)
4. Section: how to style (slots, variants, tokens, overrides, preset injection)
5. Section: how to extend (step-by-step with dialog example)
6. Section: rules/invariants (8 rules)

Confirm no placeholders, TBDs, or TODOs remain.

- [ ] **Step 3: Commit**

```bash
git add skills/bare-ui/SKILL.md
git commit -m "feat(skill): add invariants section — complete consumer skill"
```

---

### Task 5: Final verification and squash commit

**Files:**
- Read: `skills/bare-ui/SKILL.md`

- [ ] **Step 1: Verify file structure**

```bash
ls skills/bare-ui/SKILL.md
```

Expected: file exists.

- [ ] **Step 2: Count lines and verify size target**

```bash
wc -l skills/bare-ui/SKILL.md
```

Expected: ~150-200 lines. If significantly over 200, trim verbose examples. If under 120, check for missing content against the spec.

- [ ] **Step 3: Verify YAML frontmatter parses correctly**

```bash
head -4 skills/bare-ui/SKILL.md
```

Expected output:
```
---
name: bare-ui
description: Rules for working with bare-ui unstyled components — styling, extending, theming, and troubleshooting
---
```

- [ ] **Step 4: Cross-check import paths for consumer context**

Read through the file and verify all import paths use consumer-project paths:
- `@/lib/tv.config` (not `@/registry/bare/lib/tv.config`)
- `@/components/ui/<name>` (not `@/registry/bare/ui/<name>`)
- `./dialog-root` for relative imports within a component (stays the same)

These paths reflect what shadcn produces after install, not the bare-ui repo source paths.

- [ ] **Step 5: Squash into a single commit for main**

If the previous tasks made incremental commits, squash them into one clean commit:

```bash
git add skills/bare-ui/SKILL.md
git commit -m "feat: add consumer AI skill for bare-ui components"
```
