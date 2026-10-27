# Style

## Formatting

Indent with exactly 2 spaces, never tabs. Biome enforces this: run `pnpm format`.

## Package descriptions

A package for a specific standard or format describes itself generically, without promising a particular feature such as a parser: `Provides functions for convenient interactions with <standard or format>.`, for example `Provides functions for convenient interactions with ANSI X12 834 Benefit Enrollment and Maintenance transactions.`

## Commits

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/): `<type>(<optional scope>): <description>`, for example `fix(x12-core): handle empty segments` or `docs: add tech stack`.

Commit lock file changes (`pnpm-lock.yaml`) on their own, in a separate commit made right after the code change that caused them, for example `chore: update pnpm-lock.yaml`. Keeping the generated lock file diff out of the main commit makes that commit easier to review.

Commit types don't drive versioning. Releases come from Changesets (see [Tech stack](architecture/tech-stack.md)).
