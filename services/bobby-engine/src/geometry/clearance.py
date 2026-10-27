# services/bobby-engine/src/geometry/clearance.py
"""
Egress and Safety Clearance Validator for commercial venue layouts.
Calculates minimum aisle width and corridor clearances between fixtures and walls
using 2D oriented planar projections, KD-tree spatial partitioning, and exact
Shapely boundary distance algorithms.
"""

import math
from typing import List, Tuple, Dict, Any, Optional
import numpy as np
from scipy.spatial import KDTree
from shapely.geometry import Polygon

from ..schemas.spatial import FixtureItem, WallSegment, VenueLayout
from .collision import SpatialCollisionEngine
from .extrusion import WallExtrusionEngine


class EgressValidator:
    """
    Authoritative safety clearance engine enforcing commercial venue aisle standards
    (IBC / NFPA egress clearance minimums, typically 1.2m / 48 inches).
    """

    DEFAULT_MIN_CLEARANCE_METERS: float = 1.20

    def __init__(self, min_clearance_meters: float = DEFAULT_MIN_CLEARANCE_METERS):
        self.min_clearance = min_clearance_meters

    def validate_layout(
        self,
        layout: VenueLayout,
        min_clearance: Optional[float] = None
    ) -> Tuple[List[str], Dict[str, float]]:
        """
        Validates minimum clearance corridors across all fixtures and walls.

        Returns:
            warnings: List of formatted violation descriptions.
            metrics: Dictionary of spatial measurements (min_clearance, total_area, etc.).
        """
        threshold = min_clearance if min_clearance is not None else self.min_clearance
        warnings: List[str] = []

        # 1. Build Fixture Footprints
        fixture_records = []
        fixture_centers = []
        total_fixture_area = 0.0

        for f in layout.fixtures:
            poly = SpatialCollisionEngine.get_oriented_footprint_polygon(
                center_x=f.position.x,
                center_z=f.position.z,
                length_x=f.bounding_box.x,
                depth_z=f.bounding_box.z,
                rotation_deg=f.rotation_y
            )
            area = poly.area
            total_fixture_area += area

            # Maximum radius from center to corner
            max_radius = math.hypot(f.bounding_box.x / 2.0, f.bounding_box.z / 2.0)

            fixture_records.append({
                "id": f.id,
                "name": f.name,
                "poly": poly,
                "radius": max_radius,
                "center": (f.position.x, f.position.z),
                "bbox": f.bounding_box
            })
            fixture_centers.append([f.position.x, f.position.z])

        # 2. Build Wall Footprints
        wall_records = []
        wall_centers = []
        total_wall_area = 0.0

        for w in layout.walls:
            poly = WallExtrusionEngine.get_wall_base_polygon(w)
            area = poly.area
            total_wall_area += area

            mid_x = (w.start.x + w.end.x) / 2.0
            mid_z = (w.start.z + w.end.z) / 2.0
            half_len = math.hypot(w.end.x - w.start.x, w.end.z - w.start.z) / 2.0

            wall_records.append({
                "id": w.id,
                "poly": poly,
                "radius": half_len + (w.thickness / 2.0),
                "center": (mid_x, mid_z)
            })
            wall_centers.append([mid_x, mid_z])

        min_observed_distance = float("inf")
        num_violations = 0

        # 3. Fixture-to-Fixture Clearance Checks with KDTree Acceleration
        if len(fixture_centers) > 1:
            centers_arr = np.array(fixture_centers)
            tree = KDTree(centers_arr)

            # Max possible search radius: max diagonal of any fixture * 2 + threshold
            max_dia = max(f["radius"] for f in fixture_records) if fixture_records else 1.0
            search_radius = (max_dia * 2.0) + threshold

            # Query all candidate neighbor pairs within search radius
            candidate_pairs = tree.query_pairs(r=search_radius)

            for i, j in candidate_pairs:
                fa = fixture_records[i]
                fb = fixture_records[j]

                # Exact boundary-to-boundary polygonal distance
                dist = fa["poly"].distance(fb["poly"])

                if dist < min_observed_distance:
                    min_observed_distance = dist

                # Flag if within clearance corridor threshold (and not overlapping)
                if 0.0 < dist < threshold:
                    num_violations += 1
                    warnings.append(
                        f"Egress Clearance Violation: {dist:.2f}m between '{fa['name']}' ({fa['id']}) "
                        f"and '{fb['name']}' ({fb['id']}) is below required {threshold:.2f}m."
                    )

        # 4. Fixture-to-Wall Clearance Checks
        if fixture_records and wall_records:
            w_centers_arr = np.array(wall_centers)
            w_tree = KDTree(w_centers_arr)

            for f in fixture_records:
                # Query walls within proximity
                search_r = f["radius"] + max(w["radius"] for w in wall_records) + threshold
                nearby_wall_indices = w_tree.query_ball_point([f["center"][0], f["center"][1]], r=search_r)

                for w_idx in nearby_wall_indices:
                    w = wall_records[w_idx]
                    dist = f["poly"].distance(w["poly"])

                    if dist < min_observed_distance:
                        min_observed_distance = dist

                    if 0.0 < dist < threshold:
                        num_violations += 1
                        warnings.append(
                            f"Wall Aisle Clearance Violation: {dist:.2f}m between fixture '{f['name']}' ({f['id']}) "
                            f"and wall '{w['id']}' is below required {threshold:.2f}m."
                        )

        if math.isinf(min_observed_distance):
            min_observed_distance = 0.0

        metrics = {
            "required_clearance_m": round(threshold, 2),
            "min_observed_clearance_m": round(min_observed_distance, 3),
            "clearance_violations_count": float(num_violations),
            "total_fixture_footprint_sqm": round(total_fixture_area, 2),
            "total_wall_footprint_sqm": round(total_wall_area, 2),
        }

        return warnings, metrics
