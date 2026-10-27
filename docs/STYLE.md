# Style

## Formatting

Indent with exactly 2 spaces, never tabs. Biome enforces this: run `pnpm format`.

## Commits

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/): `<type>(<optional scope>): <description>`, for example `feat(x12-834): parse loop 2300` or `docs: add tech stack`.

Commit lock file changes (`pnpm-lock.yaml`) on their own, in a separate commit made right after the code change that caused them, for example `chore: update pnpm-lock.yaml`. Keeping the generated lock file diff out of the main commit makes that commit easier to review.

Commit types don't drive versioning. Releases come from Changesets (see [Tech stack](architecture/tech-stack.md)).
