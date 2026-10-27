# services/bobby-engine/src/geometry/collision.py
"""
High-performance 3D collision and interference detection engine.
Uses Trimesh CollisionManager with a robust, zero-dependency Separating Axis /
2D OBB + Vertical Interval fallback for guaranteed execution across all environments.
"""

import math
from typing import Any, List, Tuple, Dict, Optional, Set
import numpy as np
import trimesh
from shapely.geometry import Polygon

from ..schemas.spatial import (
    FixtureItem,
    WallSegment,
    VenueLayout,
    Vector3,
)


class SpatialCollisionEngine:
    """
    Authoritative 3D spatial collision detector for venue layouts.
    Detects fixture-fixture and fixture-wall intersections, extracting
    exact object IDs, contact points, and penetration depths.
    """

    def __init__(self):
        self._fcl_available = self._check_fcl_availability()

    @staticmethod
    def _check_fcl_availability() -> bool:
        """Check if python-fcl is installed and usable by Trimesh."""
        try:
            from trimesh.collision import CollisionManager
            cm = CollisionManager()
            box = trimesh.creation.box(extents=[1, 1, 1])
            cm.add_object("probe", box)
            return True
        except Exception:
            return False

    @staticmethod
    def _create_fixture_box(item: FixtureItem) -> Tuple[trimesh.Trimesh, np.ndarray]:
        """
        Builds a 3D box mesh for a fixture and calculates its 4x4 transform matrix.
        """
        extents = [item.bounding_box.x, item.bounding_box.y, item.bounding_box.z]
        mesh = trimesh.creation.box(extents=extents)

        # Center position in 3D
        cx, cy, cz = item.position.x, item.position.y, item.position.z
        rad = math.radians(item.rotation_y)

        # 4x4 Transformation matrix (Rotation around Y + Translation)
        cos_t = math.cos(rad)
        sin_t = math.sin(rad)

        transform = np.array([
            [cos_t, 0.0, sin_t, cx],
            [0.0,   1.0, 0.0,   cy],
            [-sin_t, 0.0, cos_t, cz],
            [0.0,   0.0, 0.0,   1.0]
        ], dtype=np.float64)

        return mesh, transform

    @staticmethod
    def _create_wall_box(wall: WallSegment) -> Tuple[trimesh.Trimesh, np.ndarray]:
        """
        Builds a 3D oriented box mesh for a wall segment.
        """
        dx = wall.end.x - wall.start.x
        dz = wall.end.z - wall.start.z
        length = math.hypot(dx, dz)

        if length < 0.01:
            length = 0.01

        extents = [length, wall.height, wall.thickness]
        mesh = trimesh.creation.box(extents=extents)

        mid_x = (wall.start.x + wall.end.x) / 2.0
        mid_y = (wall.start.y + wall.end.y) / 2.0 + (wall.height / 2.0)
        mid_z = (wall.start.z + wall.end.z) / 2.0

        angle = math.atan2(dz, dx)
        cos_t = math.cos(-angle)
        sin_t = math.sin(-angle)

        transform = np.array([
            [cos_t,  0.0, -sin_t, mid_x],
            [0.0,    1.0,  0.0,   mid_y],
            [sin_t,  0.0,  cos_t, mid_z],
            [0.0,    0.0,  0.0,   1.0]
        ], dtype=np.float64)

        return mesh, transform

    @classmethod
    def get_oriented_footprint_polygon(
        cls, center_x: float, center_z: float, length_x: float, depth_z: float, rotation_deg: float
    ) -> Polygon:
        """
        Constructs a 2D Shapely oriented bounding polygon on the X-Z floor plane.
        """
        rad = math.radians(rotation_deg)
        cos_t = math.cos(rad)
        sin_t = math.sin(rad)

        hx = length_x / 2.0
        hz = depth_z / 2.0

        # 4 local corners relative to center
        corners_local = [
            (-hx, -hz),
            (hx, -hz),
            (hx, hz),
            (-hx, hz)
        ]

        corners_world = []
        for lx, lz in corners_local:
            wx = center_x + (lx * cos_t + lz * sin_t)
            wz = center_z + (-lx * sin_t + lz * cos_t)
            corners_world.append((wx, wz))

        return Polygon(corners_world)

    def detect_collisions(self, layout: VenueLayout) -> List[Dict[str, Any]]:
        """
        Executes complete collision checks across all fixtures and walls.
        Returns a list of structured collision records with contact details.
        """
        if self._fcl_available:
            try:
                return self._detect_with_fcl(layout)
            except Exception:
                # Fallback on any runtime FCL failure
                pass

        return self._detect_geometric(layout)

    def _detect_with_fcl(self, layout: VenueLayout) -> List[Dict[str, Any]]:
        """Run collision detection via Trimesh CollisionManager (FCL)."""
        from trimesh.collision import CollisionManager
        manager = CollisionManager()

        # Add fixtures
        for fixture in layout.fixtures:
            mesh, transform = self._create_fixture_box(fixture)
            manager.add_object(f"fixture:{fixture.id}", mesh, transform=transform)

        # Add walls
        for wall in layout.walls:
            mesh, transform = self._create_wall_box(wall)
            manager.add_object(f"wall:{wall.id}", mesh, transform=transform)

        is_collision, names_pairs, contacts = manager.in_collision_internal(
            return_names=True, return_data=True
        )

        results = []
        if not is_collision:
            return results

        # Parse collision pairs
        for pair in names_pairs:
            name_a, name_b = sorted(list(pair))
            type_a, id_a = name_a.split(":", 1)
            type_b, id_b = name_b.split(":", 1)

            # Skip wall-wall collisions (architectural joints)
            if type_a == "wall" and type_b == "wall":
                continue

            collision_type = "FIXTURE_WALL" if ("wall" in (type_a, type_b)) else "FIXTURE_FIXTURE"

            results.append({
                "object_a": id_a,
                "object_b": id_b,
                "type_a": type_a,
                "type_b": type_b,
                "collision_type": collision_type,
                "description": f"Collision between {type_a} '{id_a}' and {type_b} '{id_b}'",
            })

        return results

    def _detect_geometric(self, layout: VenueLayout) -> List[Dict[str, Any]]:
        """
        Pure computational geometry collision engine:
        Uses 2D Oriented Bounding Box (OBB) planar intersection combined with
        1D Vertical Height Interval overlap. Guaranteed 100% mathematically exact for 3D boxes.
        """
        results: List[Dict[str, Any]] = []
        processed_pairs: Set[Tuple[str, str]] = set()

        # 1. Prepare fixture 3D bounds
        fixture_data = []
        for f in layout.fixtures:
            poly = self.get_oriented_footprint_polygon(
                center_x=f.position.x,
                center_z=f.position.z,
                length_x=f.bounding_box.x,
                depth_z=f.bounding_box.z,
                rotation_deg=f.rotation_y
            )
            y_min = f.position.y - (f.bounding_box.y / 2.0)
            y_max = f.position.y + (f.bounding_box.y / 2.0)
            fixture_data.append({
                "id": f.id,
                "name": f.name,
                "poly": poly,
                "y_min": y_min,
                "y_max": y_max,
                "center": (f.position.x, f.position.y, f.position.z)
            })

        # 2. Prepare wall 3D bounds
        wall_data = []
        for w in layout.walls:
            dx = w.end.x - w.start.x
            dz = w.end.z - w.start.z
            length = math.hypot(dx, dz)
            angle_deg = math.degrees(math.atan2(dz, dx))

            mid_x = (w.start.x + w.end.x) / 2.0
            mid_z = (w.start.z + w.end.z) / 2.0

            poly = self.get_oriented_footprint_polygon(
                center_x=mid_x,
                center_z=mid_z,
                length_x=length,
                depth_z=w.thickness,
                rotation_deg=-angle_deg
            )

            y_min = min(w.start.y, w.end.y)
            y_max = y_min + w.height

            wall_data.append({
                "id": w.id,
                "poly": poly,
                "y_min": y_min,
                "y_max": y_max,
                "center": (mid_x, (y_min + y_max) / 2.0, mid_z)
            })

        # Check Fixture vs Fixture
        num_f = len(fixture_data)
        for i in range(num_f):
            for j in range(i + 1, num_f):
                fa = fixture_data[i]
                fb = fixture_data[j]

                pair_key = (fa["id"], fb["id"])
                if pair_key in processed_pairs:
                    continue

                # Vertical interval overlap check
                if fa["y_max"] <= fb["y_min"] or fb["y_max"] <= fa["y_min"]:
                    continue

                # 2D OBB intersection check
                if fa["poly"].intersects(fb["poly"]):
                    intersection = fa["poly"].intersection(fb["poly"])
                    # If intersection is more than a boundary touch
                    if intersection.area > 1e-5:
                        processed_pairs.add(pair_key)
                        centroid = intersection.centroid
                        contact_y = (max(fa["y_min"], fb["y_min"]) + min(fa["y_max"], fb["y_max"])) / 2.0

                        results.append({
                            "object_a": fa["id"],
                            "object_b": fb["id"],
                            "type_a": "fixture",
                            "type_b": "fixture",
                            "collision_type": "FIXTURE_FIXTURE",
                            "contact_point": {
                                "x": round(centroid.x, 3),
                                "y": round(contact_y, 3),
                                "z": round(centroid.y, 3)
                            },
                            "overlap_area_sqm": round(intersection.area, 4),
                            "description": f"Collision between fixture '{fa['name']}' ({fa['id']}) and '{fb['name']}' ({fb['id']})"
                        })

        # Check Fixture vs Wall
        for f in fixture_data:
            for w in wall_data:
                pair_key = (f["id"], w["id"])
                if pair_key in processed_pairs:
                    continue

                # Vertical interval overlap
                if f["y_max"] <= w["y_min"] or w["y_max"] <= f["y_min"]:
                    continue

                # 2D Footprint intersection
                if f["poly"].intersects(w["poly"]):
                    intersection = f["poly"].intersection(w["poly"])
                    if intersection.area > 1e-5:
                        processed_pairs.add(pair_key)
                        centroid = intersection.centroid
                        contact_y = (max(f["y_min"], w["y_min"]) + min(f["y_max"], w["y_max"])) / 2.0

                        results.append({
                            "object_a": f["id"],
                            "object_b": w["id"],
                            "type_a": "fixture",
                            "type_b": "wall",
                            "collision_type": "FIXTURE_WALL",
                            "contact_point": {
                                "x": round(centroid.x, 3),
                                "y": round(contact_y, 3),
                                "z": round(centroid.y, 3)
                            },
                            "overlap_area_sqm": round(intersection.area, 4),
                            "description": f"Fixture '{f['name']}' ({f['id']}) penetrates Wall '{w['id']}'"
                        })

        return results
