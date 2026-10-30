# 00001 — Fixtures as the test data source

> **Status: PROPOSAL.** This hasn't been decided yet. Nothing here is binding until the proposal is accepted.

Proposes where X12 test data comes from, how it's laid out in the repo and how tests use it. The goal is a corpus of 834 files that is varied enough for regression testing, in a layout that also works for other X12 transaction sets (835, 837 and so on) later.

## Problem

There is no large public corpus of real 834 files. Real 834s contain protected health information (PHI): member names, SSNs, dates of birth. HIPAA rules mean nobody publishes them. A regression corpus has to be put together from a few small public sources plus synthetic files we write ourselves.

## Sources

| Source                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | What it gives                                                                                    | Committable?                                                                                       |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| **pyx12 test files** ([gist](https://gist.github.com/azoner/5286718), and the pyx12 repo's own tests)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Real-format 005010X220A1 interchanges, including one with several ST/SE transaction sets        | pyx12 is BSD-licensed, which is compatible with MIT if we keep attribution. Check each file.       |
| **CMS FFE 834 Companion Guide** ([v1.5 on cms.gov](https://cms.gov/cciio/resources/regulations-and-guidance/downloads/companion-guide-for-ffe-enrollment-transaction-v15.pdf), [v7.2 mirror](https://ichraconnect.hioscar.com/CMS_X12_834_Companion_Guide_v7.2.pdf))                                                                                                                                                                                                                                                                                                                                                                               | Example enrollment transactions, heavy use of loop 2700 (reporting categories)                   | US federal works are generally public domain. Get v7.2 from cms.gov, not the mirror.               |
| **State exchange companion guides** ([DC](https://hbx.dc.gov/sites/default/files/dc/sites/Health%20Benefit%20Exchange%20Authority/publication/attachments/DCExchangeBenefitEnrollmentCompanionGuide_v101_0.pdf), [Covered California](https://www.hbex.ca.gov/stakeholders/plan-management/PDFs/March-1-2018_2019-Qualified-Health-Plan-Application-Covered-California-for-Small-Business/Appendix%20M%20834%20Companion%20Guide%20Design%20v2.2.pdf), [Washington](https://wahealthplanfinder.org/content/dam/wahbe-assets/plan-certification-workgroup/834%20Companion%20Guide%202023.pdf), [New Mexico / GetInsured](https://carriers.bewellnm.com/wp-content/uploads/2024/11/GetInsured-834-Companion-Guide-v24.03.00.pdf)) | Real-world variations, such as custom REF qualifiers and 2700 usage                              | Mixed. Use as a reference and write our own files.                                                 |
| **Insurer companion guides** ([Florida Blue](https://files.guidewell.com/m/23b6b1dccda24f07/original/Florida-Blue-834-Companion-Guide.pdf), [Geisinger](https://www.geisinger.org/-/media/OneGeisinger/Files/PDFs/Provider/Companion-Docs/ghp834.pdf?la=en))                                                                                                                                                                                                                                                                                                                                                                                          | Same as above                                                                                    | Copyrighted. Reference only.                                                                       |
| **X12 TR3 005010X220A1** (the official implementation guide from X12.org)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | The authoritative examples                                                                       | Licensed by X12. Don't commit them verbatim; write our own based on them.                          |
| **Synthetic files we write**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Most of the corpus                                                                               | Yes. This is how we get real diversity.                                                            |

The public files are seeds. Most of the corpus is synthetic.

## Coverage

The 834 corpus should cover these areas:

- **Maintenance types (INS03):** 021 add, 001 change, 024 cancel/term, 025 reinstate, 030 audit (full file).
- **BGN08 action codes:** 2 (changes only), 4 (verify), RX (replace).
- **Who's covered:** a subscriber alone, a subscriber with dependents, and a dependent-only change.
- **Coverage (loop 2300):** several HD loops per member, and DTP date ranges.
- **Optional loops:** 2100A–H (mailing address, employer, school, custodial parent, responsible person), 2310 provider, 2320 coordination of benefits, 2700 reporting categories.
- **Envelope:** several GS groups or ST transaction sets per ISA, different delimiters, segments with and without newlines, the ISA11 repetition separator.
- **Invalid files:** wrong SE count, mismatched control numbers, truncated files, a UTF-8 BOM, CRLF line endings, an unknown loop.

## Layout

A repo-root `fixtures/` folder, not one inside each package:

```
fixtures/
  README.md                    # provenance and licensing rules for everything below
  x12/
    envelope/                  # transaction-set-agnostic: ISA/GS/delimiters/control numbers, used by x12-core tests
      valid/
      invalid/
    834/                       # transaction set, matching the package name x12-834
      005010X220A1/            # implementation guide / version
        SOURCES.md             # where each file came from, and its license
        valid/
          add-subscriber-with-dependents.x12
          add-subscriber-with-dependents.expected.json
          audit-full-file.x12
          ...
        invalid/
          se-count-mismatch.x12
          ...
    835/005010X221A1/          # future
    837/005010X222A1/          # future (837P)
  edifact/                     # if the project ever goes there
```

Why this layout:

- **Repo root:** x12-core needs envelope and delimiter fixtures for every transaction set, and tests across packages may need them too. It also keeps fixtures out of the published packages: npm ships only `dist/` and JSR ships only `src/`.
- **`x12/<transaction-set>/<guide-version>/`:** the transaction set comes first so it lines up with the package names. The guide ID goes under it because the same transaction set exists in other versions (for example 834 in 004010X095A1, or later non-HIPAA versions). The `x12/` level leaves room for EDIFACT.
- **`valid/` and `invalid/`:** each folder maps to a simple test loop.
- **Expected output next to each input:** golden-file regression tests, for example with Vitest's `toMatchFileSnapshot`.
- **`.x12` extension:** clearer than `.edi` once EDIFACT is in the picture.

## Repo changes this needs

1. **Line endings:** `.gitattributes` has `* text=auto eol=lf`, so Git would rewrite CRLF and no-newline fixtures. Add:

   ```
   fixtures/**/*.x12 -text
   ```

2. **Reading fixtures in tests:** `tsconfig.base.json` includes only the `ES2022` library, with no Node.js types, so a test calling `node:fs` fails `pnpm typecheck`. That restriction is what keeps the published code portable across Node.js, Deno, Bun and browsers, so adding `@types/node` to the shared config isn't an option: it would let library code use Node.js APIs without a type error. Two options that give the extra types to test files only:
   - Load fixtures with Vite's `import.meta.glob('…/*.x12', { query: '?raw', eager: true })`, which needs the `vite/client` types.
   - Read them with `node:fs`, which needs `@types/node`.

   Tests sit next to the code in `src/` (for example `src/transaction-set.test.ts`), so the extra types can't be scoped by folder. Scope them by file pattern instead: either a separate tsconfig that includes only `*.test.ts`, or a `/// <reference types="…" />` line at the top of each test file that needs them. Either way, the non-test files in `src/`, the ones that get published, keep the strict ES2022-only setup.

## Open questions

- Which of the two options for reading fixtures in tests, and should the extra types come from a test-only tsconfig or from per-file references?
- Should expected output be JSON snapshots, or something easier to read in diffs?
- Should synthetic fixtures be written by hand, made by a generator script, or both?
