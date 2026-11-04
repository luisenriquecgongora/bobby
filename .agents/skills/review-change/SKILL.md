---
name: review-change
description: Review a change in this repository before it is committed or merged - your own work, a branch, or a pull request. Use when asked to review, check, or sign off on changes, or before reporting a task as done.
---

# Review a change

Review against this repository's own rules in `AGENTS.md`; this skill is the checklist.
Report findings as: file:line, what is wrong, a concrete failure scenario, and the fix.
Do not report style preferences the linters do not enforce.

## 1. Gather the change

- Local work: `git status` and `git diff` (staged and unstaged).
- A branch: `git log --oneline <base>..HEAD` and `git diff <base>...HEAD`.

## 2. Verify, do not trust

Run `python scripts/verify.py`. A change is not done while it fails or prints "NOT COMPLETE"
for a check the change touches. Quote failures exactly.

## 3. Correctness

- Does a change to the packages or a flow (validation, saving, sync) update `docs/ARCHITECTURE.md` and its diagrams (`AGENTS.md`, section 11)?
- Does every behavior change come with a test (`__tests__/*.test.ts` next to the source, or `services/bobby-engine/tests/`) that fails without it?
- Units: meters in geometry and the service, centimeters in venue element dimensions (`cmToMeters`); axes X = width, Y = height, Z = depth.
- Old venue files still load: `RoomElementType` values and venue file fields are persisted, so they are never renamed or removed (`packages/core/src/format/`).
- Geometry service: new or changed endpoints keep existing response fields, and the TS client and `spatialTypes.ts` match the Pydantic models.

## 4. Repository invariants

- **Dependency direction**: `core` <- `engine` <- `viewer` <- `editor` <- `apps`; `editor` may use `connector-plaato`; packages never import from apps.
- **Internal dependencies** are declared as `"*"` so release version bumps keep resolving to the workspace.
- **Rendering**: only the first definition per type in `BASE_DEFINITIONS_REGISTRY` is rendered; existing entries are never reordered.
- **Never committed**: `dist/`, `.turbo/`, `node_modules/`, `src-tauri/target/`.
- **Secrets**: no `.env`, API keys, tokens or Plaato credentials in the diff, logs or error messages.

## 5. Commits

- Format `<type>(<scope>): <subject>` with the types and scopes in `AGENTS.md`.
- Atomic: refactor, then fix/feat, then test; at most 5 staged files per commit (lockfiles and docs excluded); config not mixed with source.
- Each commit builds and passes tests on its own.
- No mention of AI tools in commit messages.

## 6. Verdict

End with one line: `ready`, `ready after fixes listed above`, or `not ready: <reason>`.
