# Preset Theme PoC — Design Spec

## Goal

Prove that bare-ui's architecture supports **preset themes** — first-party or third-party packages that layer styled `styles.ts` files, `@theme` CSS tokens, and new component parts on top of the unstyled bare components.

The PoC ships a "default" preset inside `registry/bare/preset/default/` as both a usable first-party preset and a reference for how others create their own.

## What a preset contains

A preset is a set of registry items that override or extend bare-ui components:

1. **`@theme` CSS file** — Tailwind design tokens (colors, radii, shadows, fonts). Named `theme.css` and targeted to `styles/bare-ui-theme.css` in consumer projects.
2. **Replacement `styles.ts` files** — filled-in TV slot arrays with Tailwind classes, optionally adding variants (`variant`, `size`, etc.).
3. **New or overridden component parts** — `.tsx` files that extend a component (e.g., adding a `CloseButton` part to Dialog).
4. **Overridden barrel files** — `index.parts.ts` and `index.ts` updated to export new parts.

## File structure

```
registry/bare/preset/default/
├── theme.css                           ← @theme tokens
├── button/
│   └── styles.ts                       ← filled-in slots + variants
└── dialog/
    ├── styles.ts                       ← filled-in slots
    ├── dialog-close-button.tsx         ← new part
    ├── index.parts.ts                  ← override: adds CloseButton
    └── index.ts                        ← override: re-exports updated parts
```

## Design details

### 1. Theme CSS (`theme.css`)

A standalone `@theme` block defining CSS custom properties. Consumers `@import` this in their `globals.css`.

```css
@theme {
  --color-primary: oklch(0.55 0.25 262);
  --color-primary-foreground: oklch(0.97 0.01 255);
  --color-muted: oklch(0.55 0.02 286);
  --color-muted-foreground: oklch(0.45 0.02 286);
  --color-destructive: oklch(0.58 0.22 29);
  --color-destructive-foreground: oklch(0.97 0.01 29);
  --color-surface: oklch(1 0 0);
  --color-surface-foreground: oklch(0.15 0.01 286);
  --color-overlay: oklch(0 0 0 / 50%);
  --color-border: oklch(0.9 0.01 262);
  --color-ring: oklch(0.7 0.16 262);
  --radius-sm: 0.25rem;
  --radius-default: 0.5rem;
  --radius-lg: 0.75rem;
  --shadow-sm: 0 1px 2px 0 oklch(0 0 0 / 5%);
  --shadow-lg: 0 10px 15px -3px oklch(0 0 0 / 10%), 0 4px 6px -4px oklch(0 0 0 / 10%);
}
```

Registered as `registry:file` with `target: "styles/bare-ui-theme.css"`.

IntelliSense note: Tailwind CSS IntelliSense recognizes `@theme` blocks in any `.css` file as long as the project has Tailwind configured. No special filename required.

### 2. Button `styles.ts`

Fills in the empty `root` slot and adds `variant` and `size` variants. This works automatically because `button-root.tsx` uses `createPropSplitter`, which reads `variantKeys` at runtime — new variants are discovered without changing the root component.

```ts
import { tv } from "@/registry/bare/lib/tv.config";

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

### 3. Dialog `styles.ts`

Fills in all dialog slots. Adds a new `closeButton` slot for the new part.

```ts
import { tv } from "@/registry/bare/lib/tv.config";

export const dialogStyles = tv({
  slots: {
    root: [""],
    trigger: [""],
    portal: [""],
    backdrop: ["fixed inset-0 bg-overlay transition-opacity"],
    popup: [
      "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
      "bg-surface text-surface-foreground rounded-lg shadow-lg",
      "w-full max-w-md p-6",
    ],
    viewport: [""],
    title: ["text-lg font-semibold text-surface-foreground"],
    description: ["mt-2 text-sm text-muted-foreground"],
    close: [""],
    closeButton: [
      "absolute top-4 right-4 inline-flex items-center justify-center",
      "rounded-sm size-6 text-muted-foreground hover:text-surface-foreground",
      "transition-colors",
    ],
  },
});
```

### 4. `dialog-close-button.tsx` (new part)

A convenience part that renders an X icon inside `Dialog.Close`. Demonstrates presets can add entirely new parts.

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

### 5. Override `index.parts.ts` and `index.ts`

The preset ships overridden barrel files that add the new `CloseButton` export:

**`index.parts.ts`:**
```ts
export { DialogRoot as Root } from "./dialog-root";
export { DialogTrigger as Trigger } from "./dialog-trigger";
export { DialogPortal as Portal } from "./dialog-portal";
export { DialogBackdrop as Backdrop } from "./dialog-backdrop";
export { DialogPopup as Popup } from "./dialog-popup";
export { DialogViewport as Viewport } from "./dialog-viewport";
export { DialogTitle as Title } from "./dialog-title";
export { DialogDescription as Description } from "./dialog-description";
export { DialogClose as Close } from "./dialog-close";
export { DialogCloseButton as CloseButton } from "./dialog-close-button";
```

**`index.ts`:**
```ts
export * as Dialog from "./index.parts";
export { dialogStyles } from "./styles";
```

## Registry entries

Two items added to `registry.json`:

```json
{
  "name": "preset-default-theme",
  "type": "registry:file",
  "title": "Default Preset Theme",
  "description": "Tailwind @theme tokens for the default preset",
  "files": [
    {
      "path": "registry/bare/preset/default/theme.css",
      "type": "registry:file",
      "target": "styles/bare-ui-theme.css"
    }
  ]
},
{
  "name": "preset-default",
  "type": "registry:ui",
  "title": "Default Preset",
  "description": "Pre-styled theme preset for button and dialog with design tokens, filled-in styles, and a new DialogCloseButton part",
  "categories": ["preset"],
  "registryDependencies": [
    "@bare-ui/button",
    "@bare-ui/dialog",
    "@bare-ui/preset-default-theme"
  ],
  "dependencies": ["@base-ui/react"],
  "files": [
    { "path": "registry/bare/preset/default/button/styles.ts", "type": "registry:ui", "target": "components/ui/button/styles.ts" },
    { "path": "registry/bare/preset/default/dialog/styles.ts", "type": "registry:ui", "target": "components/ui/dialog/styles.ts" },
    { "path": "registry/bare/preset/default/dialog/dialog-close-button.tsx", "type": "registry:ui", "target": "components/ui/dialog/dialog-close-button.tsx" },
    { "path": "registry/bare/preset/default/dialog/index.parts.ts", "type": "registry:ui", "target": "components/ui/dialog/index.parts.ts" },
    { "path": "registry/bare/preset/default/dialog/index.ts", "type": "registry:ui", "target": "components/ui/dialog/index.ts" }
  ]
}
```

## Consumer workflow

```bash
# 1. Install bare components
pnpm dlx shadcn@latest add @bare-ui/button @bare-ui/dialog

# 2. Install the default preset on top
pnpm dlx shadcn@latest add @bare-ui/preset-default

# 3. Import theme in globals.css
#    @import "./styles/bare-ui-theme.css";
```

After step 2, the consumer's `components/ui/button/styles.ts` is overwritten with filled-in variants, `components/ui/dialog/` gains the `CloseButton` part, and `styles/bare-ui-theme.css` provides the design tokens.

The consumer can then:
- Edit any `styles.ts` to customize
- Replace `theme.css` with their own tokens
- Remove or modify the `CloseButton` part

## Third-party preset workflow

Anyone can create their own preset by:

1. Creating a new repo with its own `registry.json`
2. Listing `@bare-ui/*` components as `registryDependencies`
3. Shipping `styles.ts` overrides, new parts, and a `@theme` CSS file
4. Hosting the built `public/r/*.json` anywhere (GitHub raw, Vercel, etc.)
5. Consumers add the preset's registry URL to their `components.json` registries

## What this PoC proves

| Capability | Demonstrated by |
|---|---|
| Design tokens layer | `theme.css` with `@theme` block |
| Filled-in styles with variants | Button `styles.ts` with `variant` + `size` |
| Multi-part styling | Dialog `styles.ts` with all slots filled |
| Adding new component parts | `dialog-close-button.tsx` |
| Overriding barrel exports | `index.parts.ts` / `index.ts` with new export |
| Existing architecture unchanged | `createPropSplitter` auto-discovers new variants |
| Third-party extensibility | Pattern is replicable in any separate repo |

## Build & verify steps

1. Create all files under `registry/bare/preset/default/`
2. Add registry entries to `registry.json`
3. Run `pnpm registry:build`
4. Run `pnpm tsc --noEmit`
5. Commit source + regenerated `public/r/*.json`
