# Engineering Standards & Observability Contract

### 1. Pre-Change Invariant Manifest
Before executing code modifications touching more than one file, output a compact change manifest table:

| Target File / Module | Nature of Change | Breaking / Invariant Impact |
| :--- | :--- | :--- |
| `path/to/file` | `[refactor / feat / fix / rename]` | `None / Exposes new method / Renames prop` |

Do not output narrative summaries, conversational setups, or ad-hoc diagrams.

### 2. Diff Noise & Spurious Edit Invariants
- **No Unsolicited Formatting:** Do NOT reformat, re-indent, or adjust comments on lines unrelated to your assigned task. Leave untouched code exactly as it is.
- **Import Hygiene:** Do not randomly shuffle or re-order existing import statements unless adding or removing an active dependency.
- **Isolate Mass Renames:** If a task requires renaming an identifier across multiple files, isolate that rename into a dedicated `refactor(<scope>): rename X to Y` commit with ZERO other logic changes.

### 3. Conventional Commit Standards
All commits must follow:
`<type>(<scope>): <short imperative subject under 50 chars>`

- **Allowed Types:** `feat`, `fix`, `refactor`, `perf`, `chore`, `test`, `docs`, `build`, `ci` (add `model`, `data`, `eval`, `exp` for ML pipelines).
- **Allowed Scopes:** [`desktop`, `web`, `core`, `editor`, `engine`, `viewer`, `connector-plaato`, `bobby-engine`, `config`, `deps`, `hooks`, `ci`, `docs`]
- **Rule:** Never mention AI, LLMs, or prompt tools in commit messages.

### 4. Commit Granularity & Invariants
- **Atomic Commits:** Do not bundle refactorings, feature code, and config tweaks into a single commit.
- **Commit Sequence:**
  1. `refactor(<scope>): ...` (Structural prep or renames only)
  2. `feat(<scope>): ...` or `fix(<scope>): ...` (Logic changes)
  3. `test(<scope>): ...` (Specs/tests)
- **Blast-Radius Cap:** A single commit must not exceed 5 staged files (excluding lockfiles/documentation).
- **Bisect Safety:** Every individual commit must compile and pass tests.

### 5. Definition of Done
- Run `python scripts/verify.py` (or `yarn verify`) before reporting a task complete. It runs exactly what CI runs: ruff and pytest for `services/bobby-engine`, `turbo run typecheck test` for every package, and a secret scan when `gitleaks` is installed. Skipped checks are listed; "NOT COMPLETE" means you are not done.
- Narrow it while iterating: `--only python`, `--only node`, `--only secrets`.
- Python: uses `services/bobby-engine/.venv`; set `VERIFY_PYTHON` to override (e.g. in a git worktree).
- A task that changes behavior adds or updates a test (`__tests__/*.test.ts` or `services/bobby-engine/tests/`).

### 6. Repository Map
| Path | What lives there |
| :--- | :--- |
| `packages/core` | Shared types, coordinate conversion, venue file format, `SpatialEngineClient` |
| `packages/engine` | Three.js geometry builders, materials, procedural textures; `baseDefinitions.ts` is the furniture library |
| `packages/editor` | Editor UI: viewport, primitive editor, wall pen, spatial validation drawer, Plaato cloud modal |
| `packages/viewer` | Read-only `VenueViewer` |
| `packages/connector-plaato` | Sync adapter to the PlaatoOS / Takient backend |
| `apps/web`, `apps/desktop` | Vite web studio and Tauri desktop studio; both compose the packages above |
| `services/bobby-engine` | FastAPI geometry service: `GET /health`, `POST /v1/spatial/validate`, `/extrude-walls`, `/diff` |

Dependency direction: `core` <- `engine` <- `viewer` <- `editor` <- `apps`; `editor` also uses `connector-plaato`. Packages never import from apps.

### 7. Commands
- Install: `yarn install` (re-run after moving or renaming the repo: workspace links are absolute)
- Web studio: `yarn workspace @bobby/web dev`
- Geometry service: `yarn dev:engine` (port 8000); the client reads `BOBBY_ENGINE_URL`, default `http://localhost:8000`
- Python setup: `cd services/bobby-engine && uv venv && uv pip install -r requirements.txt`

### 8. Gotchas
- `typecheck` and `test` depend on `^build` in `turbo.json`: packages resolve each other through `dist/`, so a stale or missing build shows up as "Cannot find module '@bobby/core'".
- Several files in `packages/engine` still carry `@takient/core/...` path headers from their origin; they are comments, not imports.
- Ruff rules are pinned in `services/bobby-engine/pyproject.toml`.

### 9. Never
- Never read, print or commit `.env` files or API keys.
- Never force-push or rewrite published history.
- Never commit `dist/`, `.turbo/`, `node_modules/` or `src-tauri/target/`.
