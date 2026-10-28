# 0002 — Set up the `@edigami` scope on JSR

Walkthrough for the JSR item in [0001](0001-claim-name.md). It takes about two minutes and you do it all on the website.

## 1. Sign in

- [x] Go to https://jsr.io and click **Sign in**. JSR only supports **GitHub** login, so authorize the JSR OAuth app with your personal GitHub account.

A JSR scope isn't linked to the GitHub org `edigami`. You own it as a user, and you can add other people later.

## 2. Create the scope

- [x] Click **Publish a package** in the header, or go to https://jsr.io/new.
- [x] In the **scope** field, type `edigami`. The page checks it as you type. Scope names can only use lowercase letters, digits and hyphens.
- [x] If it's free, click **Create scope**. That's what claims it, so the JSR item in 0001 is done at this point.

Limits to know about:

- Each account can create only a few scopes (3 by default).
- Each scope has a package limit and a weekly publish limit.
- You can ask for higher limits if you need them, but this project won't come close.

**The scope name can't be changed later.**

## 3. Create the packages (optional now, needed before CI publishing)

On the same page, enter each package name under the scope and click **Create**:

- [x] `x12-core`
- [x] `x12-834`

These names must match the `name` field in `packages/*/jsr.json`. You can skip this for now, but the next step needs the packages to exist.

## 4. Link each package to the GitHub repo (for CI publishing)

- [x] On each package page, go to **Settings → GitHub Repository** and enter `edigami/edigami`. Your GitHub account needs push access to that repo.

After that, a GitHub Actions job with `permissions: id-token: write` can run `npx jsr publish` without a token, using OIDC.

Without the link, you can only publish from your own machine with `npx jsr publish`, which opens a browser so you can approve the publish.

## 5. Scope settings (optional)

At `jsr.io/@edigami` → **Settings**:

- [ ] **Members:** invite collaborators by their GitHub username, as admin or member.
- [ ] **Publishing restrictions:** choose whether GitHub Actions publishing is allowed only for linked repos, and whether members can publish from their own machines.

## How this fits the repo

- [x] Once the scope and both packages exist and are linked, add a release workflow that also publishes to JSR. It should publish `x12-core` before `x12-834`, because `x12-834` depends on it. Done in `.github/workflows/release.yml`; `0.1.0` of both packages was published to JSR from CI on 2026-10-27. See [Releases](../architecture/tech-stack.md#releases).
