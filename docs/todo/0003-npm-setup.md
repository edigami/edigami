# 0003 — Set up the `@edigami` org on npm

Companion to [0002](0002-jsr-setup.md) for npm. How releases work now is in [Releases](../architecture/tech-stack.md#releases).

## Done

- [x] Turn on 2FA for the npm account. npm only offered a passkey, set to "authorization and writes"
- [x] Create the free org `edigami` at https://www.npmjs.com/org/create, which claims `@edigami`
- [x] First publish of `@edigami/x12-core@0.1.0` and `@edigami/x12-834@0.1.0`, by hand on 2026-10-28. A package must exist on npm before it can get a trusted publisher
- [x] Add a trusted publisher to each package: GitHub Actions, `edigami` / `edigami` / `release.yml`, no environment, only "Allow npm publish" checked
- [x] Add `repository` fields to both `package.json` files; npm trusted publishing requires them
- [x] Add `.github/workflows/release.yml` and allow GitHub Actions to create pull requests, in the org settings first, then the repo

## Still open

- [ ] Add a `README.md` to each package; npm and JSR show it on the package page
- [ ] Release `0.1.1` through CI with a patch changeset. It ships the `repository` field and is the first npm publish through trusted publishing
- [ ] After that works, set each package's **Settings → Publishing access** to "Require two-factor authentication and disallow tokens"
