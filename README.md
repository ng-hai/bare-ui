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

This tracks `main` — every merge is immediately installable. For a reproducible pin, use a release tag instead (see below).

## Pin to a release (optional)

Releases are tagged `v<major>.<minor>.<patch>` (see [`CHANGELOG.md`](./CHANGELOG.md) for the list). Swap `main` in the registry URL for a tag to lock every install to that version:

```json
{
  "registries": {
    "@bare-ui": "https://raw.githubusercontent.com/ng-hai/bare-ui/v0.1.0/public/r/{name}.json"
  }
}
```

Commit `components.json` so the whole team installs the same version. To upgrade, bump the tag string and re-run `shadcn add` for the components you want to refresh.

### Mix pinned and bleeding-edge channels

Register both under different namespaces:

```json
{
  "registries": {
    "@bare-ui": "https://raw.githubusercontent.com/ng-hai/bare-ui/v0.1.0/public/r/{name}.json",
    "@bare-ui-next": "https://raw.githubusercontent.com/ng-hai/bare-ui/main/public/r/{name}.json"
  }
}
```

Then `shadcn add @bare-ui-next/dialog` pulls `dialog` from `main` while the rest of the project stays on `v0.1.0`.

### One-off install via raw URL

Skip `components.json` entirely and point at a tagged JSON directly — useful for scripts or when you want one component from a different version than the rest:

```bash
pnpm dlx shadcn@latest add https://raw.githubusercontent.com/ng-hai/bare-ui/v0.1.0/public/r/button.json
```

**Heads up:** `shadcn` resolves `registryDependencies` from the same registry URL it was invoked with, so transitive deps (`tv-config`, `create-style-context`, etc.) are always version-consistent with the component you installed. Tags are immutable; `main` is not — if you mix pinned and floating channels, the floating one can drift between installs.

## Set up the Claude Code skill (optional)

bare-ui ships a [Claude Code skill](https://docs.claude.com/en/docs/claude-code/skills) — `skills/bare-ui/SKILL.md` — that teaches Claude the conventions of this registry: the root/parts layering, `createPropSplitter`, `StyleContext`, the `styles` prop escape hatch, private-registry auth, and common pitfalls. With it installed, Claude Code can add, extend, and style bare-ui components idiomatically without you pasting context every time.

### Install

> You only need `.claude/skills/bare-ui/SKILL.md` in your project — don't recreate the `skills/` directory you see in this repo. That's bare-ui's internal layout, kept so the file is browsable on GitHub; the consumer-side path is dictated by Claude Code, not by us.

Drop the skill into your project's [`.claude/skills/`](https://docs.claude.com/en/docs/claude-code/skills) directory — that's the path Claude Code scans for project-scoped skills. It's picked up automatically on the next session.

```bash
mkdir -p .claude/skills/bare-ui
curl -fsSL https://raw.githubusercontent.com/ng-hai/bare-ui/main/skills/bare-ui/SKILL.md \
  -o .claude/skills/bare-ui/SKILL.md
```

Commit the file so your whole team gets it:

```bash
git add .claude/skills/bare-ui/SKILL.md
git commit -m "chore: add bare-ui Claude Code skill"
```

### Private registry repo

If `ng-hai/bare-ui` is a fork in a private org, `curl` needs an auth token. Use the GitHub CLI:

```bash
gh api repos/<org>/bare-ui/contents/skills/bare-ui/SKILL.md \
  -H "Accept: application/vnd.github.raw" \
  > .claude/skills/bare-ui/SKILL.md
```

### Stay in sync (optional)

If you want updates to flow automatically, add the upstream as a sparse git subtree instead of a one-time copy:

```bash
git subtree add --prefix=.claude/skills/bare-ui \
  https://github.com/ng-hai/bare-ui.git main --squash
# later, to pull updates:
git subtree pull --prefix=.claude/skills/bare-ui \
  https://github.com/ng-hai/bare-ui.git main --squash
```

Subtree pulls the whole repo under the prefix, so pair it with a sparse-checkout or prefer the `curl` route if you only want the single `SKILL.md`.

### Verify

Open Claude Code in your project and run `/skills` — you should see `bare-ui` in the list with the description `Rules for working with bare-ui unstyled components …`. Next time you ask Claude to add or style a bare-ui component, it will invoke the skill automatically.

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
