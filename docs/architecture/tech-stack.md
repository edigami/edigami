# Tech stack

The tools and platforms chosen for the `@edigami` packages.

## Tools and platforms

| Area                         | Choice                      | Notes                                                                                                                                                                                                                                                                                                                                                                              |
| ---------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repository layout            | Monorepo                    | Packages live under `packages/`, e.g. `packages/x12-core`, `packages/x12-834`                                                                                                                                                                                                                                                                                                      |
| Package scope                | `@edigami`                  | First package: `@edigami/x12-834`                                                                                                                                                                                                                                                                                                                                                  |
| Language                     | TypeScript                  |                                                                                                                                                                                                                                                                                                                                                                                    |
| Package manager / workspaces | pnpm workspaces             |                                                                                                                                                                                                                                                                                                                                                                                    |
| Module format (npm)          | ESM only                    | No CommonJS build; works on Node.js 20+, Deno, Bun and browsers                                                                                                                                                                                                                                                                                                                    |
| Build tool                   | tsdown                      | Builds the npm output; JSR publishes the TypeScript source directly                                                                                                                                                                                                                                                                                                                |
| Linting and formatting       | Biome (2-space indentation) |                                                                                                                                                                                                                                                                                                                                                                                    |
| Test framework               | Vitest                      |                                                                                                                                                                                                                                                                                                                                                                                    |
| CI                           | GitHub Actions              |                                                                                                                                                                                                                                                                                                                                                                                    |
| Versioning and releases      | Changesets                  | Chosen for cascading releases: when a package changes, the packages that depend on it are always bumped and republished too, even when the new version is still inside their dependency range (`updateInternalDependents: "always"`, an experimental Changesets option). Changesets only updates `package.json`, so the version in `jsr.json` needs a sync step before JSR publish |
| Registries                   | npm and JSR                 | Every package is published to both                                                                                                                                                                                                                                                                                                                                                 |
| Source hosting               | GitHub                      | Org `edigami`                                                                                                                                                                                                                                                                                                                                                                      |

## Repository layout

- `packages/x12-core` — shared X12 building blocks
- `packages/x12-834` — the 834 transaction set; depends on `x12-core`
- `pnpm-workspace.yaml` — the pnpm workspace. Root `package.json` also lists `workspaces`, because the JSR publisher only reads that field to resolve `@edigami/x12-core`
- `tsconfig.base.json` — shared compiler options; each package extends it
- `.changeset/` — Changesets config and pending changesets
- `scripts/sync-jsr-versions.mjs` — copies each package's version into its `jsr.json`; runs as part of `pnpm version-packages`

### How a package is wired

- In the repo, `exports` in `package.json` points at `src/index.ts`, so packages and tests use each other's source without building first.
- When published to npm, `publishConfig.exports` replaces it with the built `dist/` files.
- JSR publishes the TypeScript source in `src/` as described by `jsr.json`, without test files.
- Relative imports use the `.ts` extension, which Deno and JSR require.
- `tsconfig.base.json` includes only the `ES2022` library, with no DOM or Node.js types. A package that relies on runtime-specific APIs fails type-checking, which keeps packages portable across the target environments.
- `isolatedDeclarations` requires explicit types on exports. That's what JSR needs to avoid "slow types", and it lets tsdown generate `.d.ts` files quickly.

## Target execution environments

Every published package must run on all of these:

- Node.js
- Deno
- Bun
- Web browsers


## Future additions

- **Nx** — the next tool to add once the monorepo needs better management: task caching, affected-only CI runs and a dependency graph. Not adopted yet because pnpm workspaces already build packages in dependency order, which is enough for a handful of small packages. `nx init` can add it on top of the existing pnpm workspace later without moving files. Use Changesets for releases, not `nx release`, so only one tool versions the packages.
