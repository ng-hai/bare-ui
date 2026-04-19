# Contributing

This doc is written to be executable by both humans and AI assistants. The release runbook below is a deterministic procedure — follow the steps in order, and decide version bumps from the rule table, not from intuition.

## Release model

- **`main` is the default channel.** Anything merged is live for consumers who install from `main`.
- **Tags are stable refs.** Consumers who want reproducibility pin a tag in the registry URL.
- **No npm release.** The artifact is `public/r/*.json`, served via `raw.githubusercontent.com`.

### Consumer pinning

```json
{
  "registries": {
    "@bare-ui": "https://raw.githubusercontent.com/ng-hai/bare-ui/v0.1.0/public/r/{name}.json"
  }
}
```

Tag naming: `v<major>.<minor>.<patch>` — e.g. `v0.2.0`, `v1.0.0`. Never drop the leading `v`.

## Classification rules

Run these rules against the diff `git diff <latest-tag>..HEAD -- registry.json registry/** public/r/*.json`. Classify every change; the release's final bump is the **highest** classification that appears.

### MAJOR triggers — breaking

A change is MAJOR if **any** of these are true:

- A slot key in any `registry/bare/ui/<name>/styles.ts` was renamed or removed.
- A `data-slot="..."` attribute value in any component source was changed.
- A part file (`<name>-<part>.tsx`) was renamed or deleted (import path breaks for consumers who re-install).
- A barrel export in `index.ts` or `index.parts.ts` was renamed or removed (e.g. `Trigger` → `Button`).
- A required prop was added to a root or part.
- A prop's type was narrowed (e.g. `string` → `"a" | "b"`).
- A component entry in `registry.json` was removed.
- A `files[].path` or `files[].target` in `registry.json` was renamed or removed.
- A `registryDependencies` entry was removed from an existing component (consumers who re-install lose a transitive dep).

### MINOR triggers — additive

A change is MINOR if **none** of the MAJOR triggers apply and **any** of these are true:

- A new component folder was added under `registry/bare/ui/` and a new entry was added to `registry.json`.
- A new slot was added to an existing `styles.ts` (existing slots untouched).
- A new variant was added to an existing `tv()` call.
- A new optional prop was added to a root or part.
- A new part file was added to a multi-part component and exported from `index.parts.ts`.
- A new `categories` or `registryDependencies` entry was added to an existing registry item.

### PATCH triggers — invisible to installed consumers

A change is PATCH if **none** of the above apply and **any** of these are true:

- A bugfix in component logic that preserves the public API (same slots, same data-slots, same exports, same prop signatures).
- An internal refactor where the `public/r/*.json` diff is cosmetic (key reordering, formatting).
- In-file comments or JSDoc changes in component source (these ship to consumers).

### No-tag triggers — skip release

Don't tag if the diff only touches:

- `README.md`, `CLAUDE.md`, `CONTRIBUTING.md`, `CHANGELOG.md` body (below `[Unreleased]`).
- `skills/**` (the Claude Code skill is distributed separately).
- `.github/**`, `.vscode/**`, `.claude/**`, lockfiles with no functional effect.
- Any file that doesn't appear under `registry/bare/**`, `registry.json`, or `public/r/**`.

### Pre-1.0 softening

While the latest tag is `0.x.y`:

- A MAJOR-classified change bumps **minor** (not major). `0.x.0` signals instability.
- A MINOR-classified change bumps **minor**.
- A PATCH-classified change bumps **patch**.

Cut `1.0.0` when slot names, `data-slot` values, and barrel shape feel stable enough that renaming them would feel like a regret.

### Tie-breaker

When a change is hard to classify, diff `public/r/<name>.json` against the latest tag:

- Consumer TS/CSS could reference something that changed or disappeared → **MAJOR**
- Only new keys appeared → **MINOR**
- Whitespace or key reordering only → **PATCH** or no tag

## Release runbook

Execute these steps in order. Every command is copy-pasteable. Do not skip verification steps.

### 1. Pre-flight

```bash
# Must be on main with a clean tree.
git rev-parse --abbrev-ref HEAD   # expect: main
git status --porcelain            # expect: empty
git pull --ff-only origin main

# Registry must be in sync with source.
pnpm registry:build
git status --porcelain public/r   # expect: empty (otherwise commit the rebuild first)

# Typecheck must pass (always use `pnpm typecheck`, not `pnpm tsc` — the
# latter resolves to a global `tsc` on PATH and will report phantom errors).
pnpm typecheck
```

If any expectation fails, stop and resolve before continuing.

### 2. Determine the base tag

```bash
LATEST_TAG=$(git tag --list 'v*' --sort=-v:refname | head -n1)
echo "${LATEST_TAG:-<no tag yet — treat as pre-v0.1.0>}"
```

If there are no tags, the first release is `v0.1.0`; skip to step 4 with `NEXT_TAG=v0.1.0` and document everything currently in `public/r/` as **Added**.

### 3. Classify and compute the next tag

```bash
# List every changed file in the registry surface.
git diff --name-only "$LATEST_TAG"..HEAD -- registry.json registry 'public/r/*.json'
```

For each changed file, walk the classification rules above. Take the highest classification.

Compute `NEXT_TAG` from `LATEST_TAG` (`vMAJOR.MINOR.PATCH`):

| Current | Classification | Next       | Notes                                          |
| ------- | -------------- | ---------- | ---------------------------------------------- |
| `0.x.y` | MAJOR          | `0.(x+1).0` | Pre-1.0 softening: MAJOR bumps minor.          |
| `0.x.y` | MINOR          | `0.(x+1).0` |                                                |
| `0.x.y` | PATCH          | `0.x.(y+1)` |                                                |
| `X.Y.Z` (X≥1) | MAJOR    | `(X+1).0.0` |                                                |
| `X.Y.Z` (X≥1) | MINOR    | `X.(Y+1).0` |                                                |
| `X.Y.Z` (X≥1) | PATCH    | `X.Y.(Z+1)` |                                                |
| any     | no-tag         | —          | Stop. Do not tag.                              |

### 4. Write the changelog entry

Open `CHANGELOG.md` and:

1. Move the contents of `## [Unreleased]` (if any) into a new section `## [<NEXT_TAG without the v>] - <YYYY-MM-DD>`. Use the repo's current date (see `currentDate` in environment context if available, else `$(date +%F)`).
2. Group bullets under these headings, in this order, omitting empty ones:
   - `### Added` — new components, new slots/variants/props/parts, new registry entries.
   - `### Changed` — renames, signature changes, behavior changes to existing components.
   - `### Deprecated` — items still present but scheduled for removal.
   - `### Removed` — deleted components, slots, parts, or props.
   - `### Fixed` — bugfixes with no API change.
   - `### Security` — security-relevant fixes.
3. Each bullet references the component name in backticks, e.g. ``- `select`: added `Select.Separator` part.``
4. Recreate an empty `## [Unreleased]` section at the top.
5. Update the reference links at the bottom:

   ```markdown
   [Unreleased]: https://github.com/ng-hai/bare-ui/compare/v<NEXT>...HEAD
   [<NEXT>]: https://github.com/ng-hai/bare-ui/compare/v<PREV>...v<NEXT>
   ```

   For the very first release, the `[<NEXT>]` link uses `releases/tag/v<NEXT>` instead of a compare URL.

### 5. Commit, tag, push

```bash
git add CHANGELOG.md
git commit -m "docs(changelog): release $NEXT_TAG"
git tag "$NEXT_TAG"
git push origin main "$NEXT_TAG"
```

### 6. Post-flight verification

```bash
# Tag resolves on remote.
git ls-remote --tags origin "$NEXT_TAG"

# Registry JSON is fetchable at the tag.
curl -fsI "https://raw.githubusercontent.com/ng-hai/bare-ui/$NEXT_TAG/public/r/button.json" | head -n1
# expect: HTTP/2 200
```

If either check fails, the release is incomplete — investigate before announcing.

## AI assistant guardrails

When an AI assistant runs this runbook autonomously:

- **Never force-push, never delete or move a tag.** Tags are immutable once pushed.
- **Never skip `pnpm registry:build` + typecheck in step 1.** A stale `public/r/*.json` is a broken release.
- **Never bump across the 1.0 boundary automatically.** If computing `NEXT_TAG` would cross from `0.x.y` to `1.0.0`, stop and ask the human — cutting 1.0 is a judgment call, not a rule.
- **Never tag from a branch other than `main`.**
- **If classification is ambiguous, pick the higher bump** (MAJOR over MINOR, MINOR over PATCH). The tie-breaker rule above takes priority when it applies.
- **Never squash the changelog.** `[Unreleased]` always stays at the top; historical sections are append-only.
