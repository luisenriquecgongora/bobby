---
name: add-geometry-endpoint
description: Add or change an endpoint of the Bobby geometry service (services/bobby-engine, FastAPI) and its TypeScript client in @bobby/core. Use when asked for a new spatial computation (validation, extrusion, diffing, measurements) exposed over HTTP, or to change an existing endpoint's request or response.
---

# Add or change a geometry service endpoint

The geometry service is a FastAPI app; the studio calls it through `SpatialEngineClient` in `@bobby/core`.
A change is only done when **both sides** agree.

## Where things live

| Layer | File |
|---|---|
| Routes (`/v1/spatial/...`) | `services/bobby-engine/src/api/routes.py` (`router = APIRouter(prefix="/v1/spatial")`) |
| Request/response models (Pydantic) | `services/bobby-engine/src/schemas/spatial.py` |
| Computation | `services/bobby-engine/src/geometry/` (`collision.py`, `extrusion.py`, `clearance.py`) |
| API tests | `services/bobby-engine/tests/test_api.py` (httpx `AsyncClient` + `ASGITransport`) |
| TS client | `packages/core/src/spatial/spatialClient.ts` |
| TS mirror of the models | `packages/core/src/spatial/spatialTypes.ts` |
| Studio <-> service shape conversion | `packages/core/src/spatial/spatialConverter.ts` |
| TS tests | `packages/core/src/spatial/__tests__/` |

## Steps

1. **Models first**: add request/response classes to `schemas/spatial.py`; mirror them in `spatialTypes.ts`
   with the same field names (snake_case on the wire).
2. **Pure computation in `geometry/`**, no FastAPI imports there, so it is unit-testable on its own.
3. **Route** in `routes.py`: `@router.post("/<name>", response_model=..., summary=...)`; validate query
   parameters with `Query(ge=..., le=...)`; return metrics such as `computation_time_ms` like `validate_layout` does.
4. **Client method** in `SpatialEngineClient`, using `this.fetchWithTimeout(...)` so the timeout applies.
5. **Tests on both sides**: a geometry unit test, an API test in `test_api.py`, and a client test with a mocked
   `fetch` in `spatialClient.test.ts`.

## Rules

- Units are meters; the point type is `Vector3` in Python and `Vector3D` in `spatialTypes.ts`.
- Keep existing response fields: the studio may be older than the service. Add optional fields instead of renaming.
- The service has no auth: never add endpoints that read or write files on the server.

## Done when

`python scripts/verify.py` passes (ruff + pytest for the service, typecheck + tests for `@bobby/core`).
Run the service locally with `yarn dev:engine` (port 8000) to try it from the studio.
