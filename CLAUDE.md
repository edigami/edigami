# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Docs

- [Architecture](docs/architecture/README.md) — start here for the tech stack and other architecture decisions
- [Style](docs/STYLE.md) — conventions to follow, including commit message format

## Commands

Run from the repo root:

- `pnpm install` — install dependencies and link workspace packages
- `pnpm lint` / `pnpm format` — check / fix lint and formatting (Biome)
- `pnpm typecheck` — type-check every package
- `pnpm build` — build every package's npm output into `dist/` (tsdown)
- `pnpm test` — run all tests (Vitest)
- `pnpm changeset` — record a change for the next release
