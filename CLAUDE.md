# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`bare-ui` is a **shadcn registry** of **unstyled** React components built on top of [`@base-ui/react`](https://base-ui.com). Consumers install components via the `shadcn` CLI, and the component code is copied into their project. There is no build output, no published npm package, and no app shell — the components themselves are the product.

The repo ships a single registry:

- **`registry.json`** (root) — the "bare" components under `registry/bare/**`. Styles are intentionally empty slots; consumers fill them in themselves. Referenced via the `@bare-ui` namespace.

Built registry JSON lives under `public/r/*.json`, consumed over `https://raw.githubusercontent.com/ng-hai/bare-ui/main/public/r/<name>.json`.

## Presets and theme files

Default Tailwind `@theme` CSS files are shipped as `registry:file` items with an explicit `target` path (e.g. `target: "styles/bare-ui-theme.css"`). This is the correct type for plain CSS files that have no `@/` imports to rewrite. Example registry entry:

```json
{
  "name": "theme",
  "type": "registry:file",
  "files": [
    {
      "path": "registry/bare/theme/default.css",
      "type": "registry:file",
      "target": "styles/bare-ui-theme.css"
    }
  ]
}
```

Theme CSS files live under `registry/bare/theme/`. Consumers install via `shadcn add @bare-ui/theme` and then `@import` the file in their `globals.css`. They can replace it with their own `@theme` — the separation between tokens (CSS) and styles (`styles.ts`) is intentional.

## Commands

```bash
pnpm registry:build    # shadcn build → public/r/*.json
```

There are no tests, no lint script, and no dev server. `tsc --noEmit` is the only typecheck path (TS is set to `noEmit: true`). Run `pnpm registry:build` any time `registry.json` or any file it references changes, and commit the regenerated `public/r/*.json`.

## Release process

There is no npm release — consumers fetch `public/r/*.json` directly from `raw.githubusercontent.com/ng-hai/bare-ui/main/...`, so **anything merged to `main` is live**. To ship a change:

1. Edit the component source and/or `registry.json`.
2. `pnpm registry:build` to regenerate `public/r/*.json`.
3. `pnpm tsc --noEmit` to typecheck.
4. Commit both the source changes **and** the regenerated `public/r/*.json` in the same commit (the built JSON is the published artifact).
5. Push to `main`. The new version is immediately available via `pnpm dlx shadcn@latest add @bare-ui/<name>`.

Because `main` is the release channel, never push a commit where `public/r/*.json` is out of sync with source — consumers will install broken components. If you forget to rebuild, the fix is another commit, not a force-push.

## Component architecture

Every component follows the same layering, and Claude should preserve it when adding new components:

1. **Primitive** — `@base-ui/react/<component>` provides behavior/ARIA.
2. **Styles (`styles.ts`)** — a `tv({ slots, variants })` call from `@/registry/bare/lib/tv.config`. Slot arrays are empty strings — consumers fill them in after install. Slot names define the public surface (`root`, `trigger`, `popup`, etc.).
3. **Root (`<name>-root.tsx`)** — imports the primitive `Root`, runs `createPropSplitter(styles)` to separate TV variant props from HTML props, resolves styles via `styles ?? componentStyles(variantProps)`, and renders `<Primitive.Root className={s.root({ class: className })} data-slot="<name>" />`. For multi-part components it wraps children in `<StyleContext value={s}>` from `createStyleContext<StylesType>("Name")`.
4. **Parts (`<name>-<part>.tsx`, one file per part)** — each sibling part lives in its own file named `<name>-<part>.tsx` (e.g. `select-trigger.tsx`, `dialog-popup.tsx`), calls `useStyles()` from the root's style context, and applies the matching slot, e.g. `className={styles.trigger({ class: className })}`. All parts must set `data-slot` for consumer CSS hooks. Don't combine multiple parts into a single `<name>-parts.tsx` file.
5. **Barrels**
   - `index.parts.ts` — re-exports each part under its short name (`Root`, `Trigger`, `Popup`, etc.), aliased from the full component export (`SelectTrigger as Trigger`). This is the namespaced surface.
   - `index.ts` — the public export consumed by shadcn. Does `export * as <Name> from "./index.parts"` plus `export { <name>Styles } from "./styles"`. Consumers use it as `<Select.Root>`, `<Select.Trigger>`, etc.

Every component — including single-part ones like `button` and `input` — follows this barrel pattern so the public API is uniform (`<Button.Root>`, `<Input.Root>`). Single-part components still skip the style-context; their `index.parts.ts` just exports `Root`.

### Invariants to keep

- **Every component goes through `createPropSplitter`.** Don't hand-pluck variant props — `variantKeys` comes from the TV config at runtime, so the splitter stays in sync when variants change.
- **Every rendered primitive sets `data-slot="..."`** matching the component/part name (kebab-case). This is the consumer-visible styling hook.
- **Multi-part components use `createStyleContext`, not prop drilling.** `checkbox-root.tsx` and `select-root.tsx` are the reference implementations; the root exports `useStyles` as `use<Name>Styles` for siblings.
- **Bare components must stay unstyled.** `styles.ts` slot arrays should be `[""]` or empty. Consumers fill them in after install.
- **`styles` prop escape hatch.** Root accepts an optional `styles?: ReturnType<typeof componentStyles>` so consumers can inject a preset without recomputing variants — preserve this.

## Adding or modifying a component

1. Create files under `registry/bare/ui/<name>/` following the structure of a sibling (use `dialog/` or `select/` for multi-part — one file per part, `button/` for single-part). Every component ships both `index.ts` and `index.parts.ts`.
2. Add an entry to **`registry.json`**:
   - `type: "registry:ui"` for components, `registry:lib` for shared utils.
   - `registryDependencies` uses the `@bare-ui/<dep>` namespace form (e.g. `@bare-ui/tv-config`, `@bare-ui/split-variant-props`, and — for multi-part — `@bare-ui/create-style-context`). Never hardcode raw GitHub URLs.
   - `dependencies: ["@base-ui/react"]`.
   - `categories: [...]` for discoverability (`form`, `overlay`, `display`, `navigation`, `disclosure`, etc.).
   - List every file in the component folder under `files` (including `index.parts.ts`), each with `type: "registry:ui"` (so shadcn places them in `components/ui/` in consumer projects).
3. Run `pnpm registry:build` and commit both `registry.json` **and** the regenerated `public/r/*.json`.

## Path aliases

`tsconfig.json` maps `@/*` to the repo root. Component source uses `@/registry/bare/lib/...` — these imports get rewritten by `shadcn build` based on the consumer's aliases, so don't flatten them to relative paths.
