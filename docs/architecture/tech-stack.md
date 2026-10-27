# Tech stack

The tools and platforms chosen for the `@edigami` packages.

## Tools and platforms

| Area | Choice | Notes |
| --- | --- | --- |
| Repository layout | Monorepo | Packages live under `packages/`, e.g. `packages/x12-core`, `packages/x12-834` |
| Package scope | `@edigami` | First package: `@edigami/x12-834` |
| Language | TypeScript | |
| Package manager / workspaces | pnpm workspaces | |
| Module format (npm) | ESM only | No CommonJS build; works on Node.js 20+, Deno, Bun and browsers |
| Build tool | tsdown | Builds the npm output; JSR publishes the TypeScript source directly |
| Linting and formatting | Biome | |
| Test framework | Vitest | |
| CI | GitHub Actions | |
| Versioning and releases | Changesets | Chosen for cascading releases: when a package changes, the packages that depend on it are bumped and republished too. Changesets only updates `package.json`, so the version in `jsr.json` needs a sync step before JSR publish |
| Registries | npm and JSR | Every package is published to both |
| Source hosting | GitHub | Org `edigami` |

## Target execution environments

Every published package must run on all of these:

- Node.js
- Deno
- Bun
- Web browsers


## Future additions

- **Nx** — the next tool to add once the monorepo needs better management: task caching, affected-only CI runs and a dependency graph. Not adopted yet because pnpm workspaces already build packages in dependency order, which is enough for a handful of small packages. `nx init` can add it on top of the existing pnpm workspace later without moving files. Use Changesets for releases, not `nx release`, so only one tool versions the packages.
