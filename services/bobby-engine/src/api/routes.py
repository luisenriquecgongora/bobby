# services/bobby-engine/src/api/routes.py
"""
FastAPI REST API routes for spatial operations, 3D validation,
wall extrusion, and RFC 6902 layout diffing.
"""

import math
import time
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Query, Response, status
from fastapi.responses import JSONResponse

from ..schemas.spatial import (
    VenueLayout,
    ValidationResult,
    WallSegment,
    ExtrudeWallsRequest,
    ExtrudeWallsResponse,
    LayoutDiffRequest,
    LayoutDiffResponse,
    JsonPatchOperation,
)
from ..geometry.collision import SpatialCollisionEngine
from ..geometry.extrusion import WallExtrusionEngine
from ..geometry.clearance import EgressValidator

router = APIRouter(prefix="/v1/spatial", tags=["Spatial Geometry & Validation"])

collision_engine = SpatialCollisionEngine()
egress_validator = EgressValidator()


@router.post(
    "/validate",
    response_model=ValidationResult,
    summary="Validate 3D spatial collisions and egress safety clearances"
)
async def validate_layout(
    layout: VenueLayout,
    min_clearance: float = Query(
        default=1.20,
        ge=0.1,
        le=5.0,
        description="Minimum corridor clearance threshold in meters (default: 1.2m / 48in)"
    )
) -> ValidationResult:
    """
    Executes authoritative 3D spatial interference checks across all fixtures and walls,
    and calculates minimum egress clearances.
    """
    start_time = time.perf_counter()

    # 1. 3D Collision Detection
    collisions = collision_engine.detect_collisions(layout)

    # 2. 2D Egress Clearance Validation
    clearance_warnings, clearance_metrics = egress_validator.validate_layout(
        layout, min_clearance=min_clearance
    )

    elapsed_ms = (time.perf_counter() - start_time) * 1000.0

    # Combine metrics
    metrics: Dict[str, float] = {
        "computation_time_ms": round(elapsed_ms, 2),
        "total_fixtures": float(len(layout.fixtures)),
        "total_walls": float(len(layout.walls)),
        "collision_count": float(len(collisions)),
        "warning_count": float(len(clearance_warnings)),
        **clearance_metrics
    }

    # Layout is valid if zero penetrating collisions exist
    is_valid = (len(collisions) == 0)

    return ValidationResult(
        is_valid=is_valid,
        collisions=collisions,
        clearance_warnings=clearance_warnings,
        metrics=metrics
    )


@router.post(
    "/extrude-walls",
    summary="Extrude 2D CAD wall segments with doors and windows into 3D meshes"
)
async def extrude_walls(
    payload: ExtrudeWallsRequest,
    format: Optional[str] = Query(
        default="glb",
        pattern="^(glb|json)$",
        description="Desired output format: 'glb' for binary 3D stream, 'json' for mesh data"
    )
):
    """
    Generates algorithmic 3D wall geometry with exact cutouts for doors and windows.
    Returns binary GLB for Three.js rendering or JSON mesh summary.
    """
    if not payload.walls:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Wall segment list cannot be empty"
        )

    # If client specifically asks for JSON either via query param or payload
    if format == "json" or payload.output_format == "json":
        summary = WallExtrusionEngine.to_mesh_summary(payload.walls)
        return ExtrudeWallsResponse(**summary)

    # Default to compiled GLB binary stream
    glb_bytes = WallExtrusionEngine.export_glb_bytes(payload.walls)
    return Response(
        content=glb_bytes,
        media_type="model/gltf-binary",
        headers={
            "Content-Disposition": 'attachment; filename="venue_walls.glb"'
        }
    )


@router.post(
    "/diff",
    response_model=LayoutDiffResponse,
    summary="Compute RFC 6902 JSON patch and spatial deltas between layout states"
)
async def diff_layouts(payload: LayoutDiffRequest) -> LayoutDiffResponse:
    """
    Compares previous and current venue layout states, generating an RFC 6902
    JSON Patch array along with human-readable 3D displacement vectors (dx, dy, dz, drot).
    """
    patches: List[JsonPatchOperation] = []
    spatial_deltas: List[Dict[str, Any]] = []

    prev_fixtures = {f.id: f for f in payload.previous.fixtures}
    curr_fixtures = {f.id: f for f in payload.current.fixtures}

    prev_walls = {w.id: w for w in payload.previous.walls}
    curr_walls = {w.id: w for w in payload.current.walls}

    added_fixtures = 0
    removed_fixtures = 0
    modified_fixtures = 0

    added_walls = 0
    removed_walls = 0
    modified_walls = 0

    # 1. Fixture additions
    for fid, f in curr_fixtures.items():
        if fid not in prev_fixtures:
            added_fixtures += 1
            patches.append(JsonPatchOperation(
                op="add",
                path=f"/fixtures/{fid}",
                value=f.model_dump()
            ))

    # 2. Fixture removals
    for fid, f in prev_fixtures.items():
        if fid not in curr_fixtures:
            removed_fixtures += 1
            patches.append(JsonPatchOperation(
                op="remove",
                path=f"/fixtures/{fid}"
            ))

    # 3. Fixture modifications & spatial displacement vectors
    for fid in curr_fixtures.keys() & prev_fixtures.keys():
        old_f = prev_fixtures[fid]
        new_f = curr_fixtures[fid]

        dx = new_f.position.x - old_f.position.x
        dy = new_f.position.y - old_f.position.y
        dz = new_f.position.z - old_f.position.z
        displacement_m = math.sqrt(dx * dx + dy * dy + dz * dz)
        d_rot = new_f.rotation_y - old_f.rotation_y

        is_pos_changed = displacement_m > 1e-4
        is_rot_changed = abs(d_rot) > 1e-3
        is_bbox_changed = (
            abs(new_f.bounding_box.x - old_f.bounding_box.x) > 1e-4 or
            abs(new_f.bounding_box.y - old_f.bounding_box.y) > 1e-4 or
            abs(new_f.bounding_box.z - old_f.bounding_box.z) > 1e-4
        )

        if is_pos_changed or is_rot_changed or is_bbox_changed:
            modified_fixtures += 1
            patches.append(JsonPatchOperation(
                op="replace",
                path=f"/fixtures/{fid}",
                value=new_f.model_dump()
            ))

            spatial_deltas.append({
                "fixture_id": fid,
                "name": new_f.name,
                "translation_delta_m": {
                    "dx": round(dx, 4),
                    "dy": round(dy, 4),
                    "dz": round(dz, 4),
                },
                "total_displacement_m": round(displacement_m, 4),
                "rotation_delta_deg": round(d_rot, 2),
                "bounding_box_modified": is_bbox_changed
            })

    # 4. Wall changes
    for wid, w in curr_walls.items():
        if wid not in prev_walls:
            added_walls += 1
            patches.append(JsonPatchOperation(
                op="add",
                path=f"/walls/{wid}",
                value=w.model_dump()
            ))

    for wid in prev_walls:
        if wid not in curr_walls:
            removed_walls += 1
            patches.append(JsonPatchOperation(
                op="remove",
                path=f"/walls/{wid}"
            ))

    for wid in curr_walls.keys() & prev_walls.keys():
        if curr_walls[wid] != prev_walls[wid]:
            modified_walls += 1
            patches.append(JsonPatchOperation(
                op="replace",
                path=f"/walls/{wid}",
                value=curr_walls[wid].model_dump()
            ))

    summary = {
        "added_fixtures": added_fixtures,
        "removed_fixtures": removed_fixtures,
        "modified_fixtures": modified_fixtures,
        "added_walls": added_walls,
        "removed_walls": removed_walls,
        "modified_walls": modified_walls,
        "total_patches": len(patches),
    }

    return LayoutDiffResponse(
        patches=patches,
        spatial_deltas=spatial_deltas,
        summary=summary
    )
