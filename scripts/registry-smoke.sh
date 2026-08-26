#!/usr/bin/env bash
# End-to-end install smoke test. Exercises the real consumer path — the shadcn
# CLI resolving ng-hai/ui/* from GitHub, rewriting @/ imports, installing npm
# deps into a minimal scaffold — then typechecks the result.
#
# NOTE: this tests what's on GitHub (`main`, or the ref passed as $1), never
# the local working tree. A local-only fix is not smoke-testable until pushed.
set -euo pipefail

REF="${1:-}"
ITEM="ng-hai/ui/select${REF:+#$REF}"
DIR="$(mktemp -d)"
trap 'rm -rf "$DIR"' EXIT

cd "$DIR"
mkdir src && touch src/index.css

cat > package.json <<'JSON'
{
  "name": "registry-smoke",
  "private": true,
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.7.0"
  }
}
JSON

cat > tsconfig.json <<'JSON'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
}
JSON

cat > components.json <<'JSON'
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "tsx": true,
  "tailwind": { "css": "src/index.css", "baseColor": "neutral", "cssVariables": true },
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "utils": "@/lib/utils",
    "hooks": "@/hooks"
  }
}
JSON

pnpm dlx shadcn@latest add "$ITEM" --yes
pnpm install --silent
pnpm exec tsc --noEmit

echo "ok: $ITEM installs and typechecks"
