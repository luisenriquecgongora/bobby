# services/bobby-engine/src/schemas/spatial.py
"""
Data contracts for 3D spatial operations, computational geometry,
and venue layout validation matching the Bobby TypeScript client.
"""

from enum import Enum
from typing import Any, List, Optional, Literal
from pydantic import BaseModel, Field, ConfigDict


class ApertureType(str, Enum):
    DOOR = "DOOR"
    WINDOW = "WINDOW"


class Vector3(BaseModel):
    """3D Vector in metric spatial coordinates (meters)."""
    model_config = ConfigDict(frozen=True)

    x: float = Field(..., description="X coordinate (width / lateral displacement)")
    y: float = Field(..., description="Y coordinate (elevation / vertical height)")
    z: float = Field(..., description="Z coordinate (depth / longitudinal displacement)")

    def as_tuple(self) -> tuple[float, float, float]:
        return (self.x, self.y, self.z)

    def as_numpy(self):
        import numpy as np
        return np.array([self.x, self.y, self.z], dtype=np.float64)


class WallAperture(BaseModel):
    """Opening or cutout along a wall segment (door or window)."""
    id: str = Field(..., description="Unique aperture identifier")
    type: ApertureType = Field(..., description="Type of opening: DOOR or WINDOW")
    offset_along_wall: float = Field(
        ...,
        ge=0.0,
        description="Distance in meters from the wall start point along its centerline"
    )
    width: float = Field(..., gt=0.0, description="Opening width in meters along the wall")
    height: float = Field(..., gt=0.0, description="Opening vertical height in meters")
    sill_height: float = Field(
        default=0.0,
        ge=0.0,
        description="Bottom sill elevation from floor (0.0 for doors, >0 for windows)"
    )


class WallSegment(BaseModel):
    """Algorithmic 3D Wall segment defined by start and end centerline points."""
    id: str = Field(..., description="Unique wall identifier")
    start: Vector3 = Field(..., description="Start point in 3D world space (Y is elevation)")
    end: Vector3 = Field(..., description="End point in 3D world space (Y is elevation)")
    thickness: float = Field(default=0.15, gt=0.0, description="Wall thickness in meters (default 0.15m / 15cm)")
    height: float = Field(default=3.0, gt=0.0, description="Wall vertical height in meters (default 3.0m)")
    apertures: List[WallAperture] = Field(
        default_factory=list,
        description="Doors and windows positioned along this wall"
    )


class FixtureItem(BaseModel):
    """Furniture item, equipment, stage, or 3D object positioned in the venue."""
    id: str = Field(..., description="Unique fixture identifier")
    name: str = Field(..., description="Display name (e.g., 'VIP Table 1', 'Main Cocktail Bar')")
    model_type: str = Field(..., description="Furniture category or primitive type (table, chair, bar, etc.)")
    position: Vector3 = Field(..., description="Center position in 3D space (meters)")
    rotation_y: float = Field(
        default=0.0,
        description="Orientation angle around the vertical Y axis (in degrees)"
    )
    bounding_box: Vector3 = Field(
        ...,
        description="Dimensions of oriented 3D bounding box: x=width, y=height, z=depth (meters)"
    )


class VenueLayout(BaseModel):
    """Complete 3D venue layout payload containing all spatial geometry."""
    venue_id: str = Field(..., description="Venue or tenant identifier")
    version: str = Field(default="1.0.0", description="Layout format version")
    walls: List[WallSegment] = Field(default_factory=list, description="All wall segments")
    fixtures: List[FixtureItem] = Field(default_factory=list, description="All furniture items and fixtures")


class CollisionContact(BaseModel):
    """Detailed penetration data for an intersecting object pair."""
    object_a: str = Field(..., description="Identifier of the first colliding object")
    object_b: str = Field(..., description="Identifier of the second colliding object")
    collision_type: str = Field(..., description="'FIXTURE_FIXTURE' or 'FIXTURE_WALL'")
    contact_point: Optional[Vector3] = Field(
        default=None,
        description="Estimated 3D centroid of intersection contact"
    )
    penetration_depth: Optional[float] = Field(
        default=None,
        description="Calculated geometric penetration depth in meters"
    )


class ValidationResult(BaseModel):
    """Authoritative validation report for spatial interference and egress clearance."""
    is_valid: bool = Field(..., description="True if no collisions or blocking violations exist")
    collisions: List[dict[str, Any]] = Field(
        default_factory=list,
        description="List of detected collision pairs and contact details"
    )
    clearance_warnings: List[str] = Field(
        default_factory=list,
        description="Human-readable corridor and egress clearance safety warnings"
    )
    metrics: dict[str, float] = Field(
        default_factory=dict,
        description="Spatial metrics: total_area, fixture_count, min_clearance, computation_ms"
    )


class JsonPatchOperation(BaseModel):
    """RFC 6902 JSON Patch operation describing layout diffs."""
    op: Literal["add", "remove", "replace", "move", "copy", "test"]
    path: str
    value: Optional[Any] = None
    from_: Optional[str] = Field(default=None, alias="from")


class LayoutDiffRequest(BaseModel):
    """Request payload comparing previous and current venue layout states."""
    previous: VenueLayout
    current: VenueLayout


class LayoutDiffResponse(BaseModel):
    """Response containing RFC 6902 JSON patch and spatial delta summaries."""
    patches: List[JsonPatchOperation]
    spatial_deltas: List[dict[str, Any]] = Field(
        default_factory=list,
        description="Human-readable spatial translations and rotations per modified fixture"
    )
    summary: dict[str, int] = Field(
        default_factory=dict,
        description="Count of added, removed, and modified elements"
    )


class ExtrudeWallsRequest(BaseModel):
    """Request payload to extrude walls into 3D geometry."""
    walls: List[WallSegment]
    output_format: Literal["glb", "json"] = "glb"


class ExtrudeWallsResponse(BaseModel):
    """JSON response for wall extrusion containing mesh vertices and faces."""
    vertex_count: int
    face_count: int
    bounds: List[List[float]]
    sub_wall_count: int
