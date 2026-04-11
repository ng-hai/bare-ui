# bare-ui

A [shadcn](https://ui.shadcn.com) registry of **unstyled** React components built on [`@base-ui/react`](https://base-ui.com). You install components into your project with the `shadcn` CLI, own the source, and bring your own styles.

Every component ships with an empty Tailwind Variants slot config — the behavior, ARIA, and composition are baked in; the look is yours.

## Set up the registry

Add `@bare-ui` to your project's `components.json`:

```json
{
  "registries": {
    "@bare-ui": "https://raw.githubusercontent.com/ng-hai/bare-ui/main/public/r/{name}.json"
  }
}
```

## Install a component

```bash
pnpm dlx shadcn@latest add @bare-ui/button
```

This copies the component source into `components/ui/button/` and the shared helpers (`tv.config.ts`, `split-variant-props.ts`, and — for multi-part components — `create-style-context.ts`) into `lib/`. Transitive dependencies (`@bare-ui/tv-config`, `@bare-ui/split-variant-props`, etc.) are resolved automatically.

Available components: `button`, `input`, `checkbox`, `avatar`, `select`, `dialog`, `popover`, `tabs`, `accordion`, `tooltip`.

> Don't want the namespace config? You can also install via raw URL: `pnpm dlx shadcn@latest add https://raw.githubusercontent.com/ng-hai/bare-ui/main/public/r/button.json`.

## Use it

Components are exposed as namespaces — the root and every part are accessed as dotted members. A single-part component still uses `.Root`:

```tsx
import { Button } from "@/components/ui/button";

export function Example() {
  return <Button.Root onClick={() => console.log("clicked")}>Save</Button.Root>;
}
```

Multi-part components compose from the same namespace:

```tsx
import { Checkbox } from "@/components/ui/checkbox";

<Checkbox.Root>
  <Checkbox.Indicator />
</Checkbox.Root>;
```

```tsx
import { Select } from "@/components/ui/select";

<Select.Root>
  <Select.Trigger>
    <Select.Value />
    <Select.Icon />
  </Select.Trigger>
  <Select.Portal>
    <Select.Positioner>
      <Select.Popup>
        <Select.Item value="a">
          <Select.ItemText>A</Select.ItemText>
        </Select.Item>
      </Select.Popup>
    </Select.Positioner>
  </Select.Portal>
</Select.Root>;
```

Out of the box every component renders with no classes. Styling happens in one place: the component's own `styles.ts`.

## Styling

Each installed component folder contains a `styles.ts` file with a `tv({ slots, variants })` call. Fill in the slot arrays and add variants:

```ts
// components/ui/button/styles.ts
import { tv } from "@/lib/tv.config";

export const buttonStyles = tv({
  slots: {
    root: "inline-flex items-center justify-center rounded-md text-sm font-medium",
  },
  variants: {
    variant: {
      solid: { root: "bg-primary text-primary-foreground hover:bg-primary/90" },
      ghost: { root: "hover:bg-accent" },
    },
    size: {
      sm: { root: "h-8 px-3" },
      md: { root: "h-9 px-4" },
    },
  },
  defaultVariants: { variant: "solid", size: "md" },
});
```

Variant props are inferred automatically — `<Button.Root variant="ghost" size="sm" />` just works because the root uses `createPropSplitter` to separate variants from HTML props at runtime.

For multi-part components, add a slot per part and the matching root will publish them via context so every part picks up its slot automatically:

```ts
// components/ui/checkbox/styles.ts
export const checkboxStyles = tv({
  slots: {
    root: "h-4 w-4 rounded border border-input",
    indicator: "flex items-center justify-center text-primary",
  },
});
```

Every rendered element also emits a `data-slot="<name>"` attribute, so you can reach parts from global CSS too:

```css
[data-slot="checkbox"][data-checked] {
  background: hsl(var(--primary));
}
```

## Per-instance style override

Every root accepts an optional `styles` prop — a pre-computed TV result — that replaces the styles for a single instance. Every component also exports its `*Styles` object alongside the component, so you can compose from it.

**Lock in a variant** by calling the exported styles with the variant you want and passing the result:

```tsx
import { Button, buttonStyles } from "@/components/ui/button";

const large = buttonStyles({ size: "lg" });

<Button.Root styles={large}>Save</Button.Root>;
```

**Extend** by creating a new TV instance off the existing one — add slots, add variants, or append classes — then call it and pass the result:

```tsx
import { tv } from "@/lib/tv.config";
import { Button, buttonStyles } from "@/components/ui/button";

const danger = tv({
  extend: buttonStyles,
  slots: {
    root: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  },
});

<Button.Root styles={danger()}>Delete</Button.Root>;
```

When `styles` is passed, the root's own variant resolution is skipped — variant props on the element won't be re-evaluated, so bake them into the call above.

## License

MIT
