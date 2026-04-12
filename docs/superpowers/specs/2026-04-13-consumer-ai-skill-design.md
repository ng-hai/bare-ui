# Consumer AI Skill — Design Spec

## Goal

Ship a single `SKILL.md` that consumers install via `npx skills add ng-hai/bare-ui`. Once installed, any AI coding assistant (Claude Code, Cursor, Copilot, etc.) understands bare-ui's architecture and can correctly style, extend, and troubleshoot components without the consumer explaining conventions each time.

## Delivery

- **File:** `skills/bare-ui/SKILL.md`
- **Install:** `npx skills add ng-hai/bare-ui`
- **Mechanism:** The `skills` CLI discovers `skills/bare-ui/SKILL.md` and symlinks it into whatever agents the consumer has installed.

## Skill metadata

```yaml
---
name: bare-ui
description: Rules for working with bare-ui unstyled components — styling, extending, theming, and troubleshooting
---
```

## Content sections

The skill covers five sections, each concise and rule-oriented with short code examples.

### Section 1: What bare-ui is

One paragraph establishing context:

- Unstyled shadcn registry built on `@base-ui/react`
- Components are copied into the consumer's project via `shadcn add`
- No npm package — code lives in `components/ui/<name>/`
- Styles are intentionally empty; the consumer fills them in

### Section 2: Component anatomy

Teach the 5-layer structure the consumer sees in `components/ui/<name>/`:

| File | Purpose |
|---|---|
| `styles.ts` | `tv({ slots, variants })` — Tailwind Variants definition. Slots are empty by default. |
| `<name>-root.tsx` | Imports primitive, splits variant props via `createPropSplitter`, provides style context for multi-part components. |
| `<name>-<part>.tsx` | One file per part. Consumes styles via `useStyles()` from style context. Sets `data-slot`. |
| `index.parts.ts` | Re-exports parts under short names (`Root`, `Trigger`, `Popup`). |
| `index.ts` | Public export: `export * as <Name> from "./index.parts"` plus `export { <name>Styles }`. |

Include two examples:

- **Single-part** (button): `styles.ts` has one `root` slot, one root file, barrel exports just `Root`.
- **Multi-part** (select): `styles.ts` has many slots (`root`, `trigger`, `popup`, `item`, etc.), root provides `StyleContext`, sibling parts call `useStyles()`.

Consumer usage pattern:
```tsx
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

<Button.Root variant="solid" size="md">Click</Button.Root>

<Select.Root>
  <Select.Trigger>
    <Select.Value />
  </Select.Trigger>
  <Select.Portal>
    <Select.Positioner>
      <Select.Popup>
        <Select.Item value="a"><Select.ItemText>A</Select.ItemText></Select.Item>
      </Select.Popup>
    </Select.Positioner>
  </Select.Portal>
</Select.Root>
```

### Section 3: How to style components

This is the primary consumer task. Rules:

**Filling in slots:**
- Open `styles.ts`, add Tailwind classes to the slot arrays
- Each slot maps to a part — `root` styles apply to `<Name>.Root`, `trigger` to `<Name>.Trigger`, etc.
- Example: show a filled-in button `styles.ts` with `variant` (solid/outline/ghost/destructive) and `size` (sm/md/lg) variants, modeled on the preset-default button

**Adding variants:**
- Add a `variants` block and `defaultVariants` to the `tv()` call
- `createPropSplitter` discovers new variant keys at runtime — no changes to `.tsx` files needed
- Variant props become available on the root component automatically

**Design tokens via `@theme`:**
- Create a CSS file with a `@theme` block defining custom properties
- `@import` it in `globals.css`
- Reference tokens in `styles.ts` via Tailwind classes (e.g. `bg-primary`, `rounded-default`)
- Example: show the theme.css structure

**One-off overrides:**
- Use the `className` prop on any part: `<Button.Root className="mt-4">`
- `className` merges with slot styles via `twMerge`

**Preset injection:**
- Root components accept a `styles` prop to inject a pre-computed styles object
- This bypasses variant resolution: `<Button.Root styles={myPrecomputedStyles}>`

### Section 4: How to extend components

Rules for adding new parts to an existing component:

1. Create `components/ui/<name>/<name>-<new-part>.tsx`
2. Import `use<Name>Styles` from the root file
3. Call `const styles = use<Name>Styles()` to get the resolved styles
4. Add a corresponding slot in `styles.ts`
5. Render with `className={styles.<slotName>({ class: className })}` and set `data-slot="<name>-<new-part>"`
6. Export from `index.parts.ts` as `export { <Name><NewPart> as <NewPart> } from "./<name>-<new-part>"`
7. No changes needed to `index.ts` — it re-exports everything from `index.parts.ts`

Example: adding a `CloseButton` part to dialog (reference the preset-default pattern).

### Section 5: Invariants — things to never break

Hard rules the AI must follow:

- **Never hand-pluck variant props.** Always use `createPropSplitter`. It reads `variantKeys` at runtime and stays in sync when variants change.
- **Never remove `data-slot` attributes.** Consumers use these as CSS hooks (`[data-slot="button"]`).
- **Never merge multiple parts into one file.** Each part gets its own `<name>-<part>.tsx` file.
- **Never put Tailwind classes in `.tsx` files.** All styling goes in `styles.ts` slot arrays. The only exception is `className` pass-through for consumer overrides.
- **Never remove the `styles` prop from root components.** It's the escape hatch for preset injection.
- **Never modify shared libs** (`tv.config.ts`, `create-style-context.ts`, `split-variant-props.ts`) when working on a specific component.
- **Always keep barrel exports in sync.** If you add a part, it must appear in `index.parts.ts`.

## What this does NOT cover

- How to build bare-ui itself (that's the maintainer CLAUDE.md)
- The `registry.json` format or `pnpm registry:build` workflow
- How to create third-party registries or presets
- Base UI primitive API details (consumers should reference base-ui.com)

## Estimated size

~150-200 lines of markdown. Concise enough to not bloat AI context, comprehensive enough to make the assistant competent with all 36 components.

## Build & verify steps

1. Create `skills/bare-ui/SKILL.md` with frontmatter and all 5 sections
2. Test by reading the skill and verifying examples match actual component code
3. Commit to `main`
