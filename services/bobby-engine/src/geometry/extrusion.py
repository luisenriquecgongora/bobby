# services/bobby-engine/src/geometry/extrusion.py
"""
Algorithmic 3D Wall Extrusion & Aperture Cutter Engine.
Uses Shapely 2D footprint buffering and constructive solid partitioning to extrude
3D watertight wall geometry with exact cutouts for doors and windows.
Exports optimized Trimesh geometry and binary GLB streams.
"""

import io
import math
from typing import List, Tuple, Dict, Any, Optional
import numpy as np
import trimesh
from shapely.geometry import LineString, Polygon

from ..schemas.spatial import WallSegment, WallAperture, Vector3


class WallExtrusionEngine:
    """
    Extrudes 2D wall centerline layouts into authoritative 3D architectural meshes
    with precise boolean door and window openings.
    """

    @classmethod
    def get_wall_base_polygon(cls, wall: WallSegment) -> Polygon:
        """
        Computes the 2D footprint polygon of a wall by buffering its centerline
        by half its thickness with flat caps.
        """
        line = LineString([
            (wall.start.x, wall.start.z),
            (wall.end.x, wall.end.z)
        ])
        # Buffer half-thickness with flat end caps
        poly = line.buffer(wall.thickness / 2.0, cap_style="flat", join_style="mitre")
        return poly

    @classmethod
    def _create_oriented_box_block(
        cls,
        wall_start: Vector3,
        u_unit: Tuple[float, float],
        u_start: float,
        u_end: float,
        y_bottom: float,
        y_top: float,
        thickness: float,
    ) -> Optional[trimesh.Trimesh]:
        """
        Creates an oriented 3D Trimesh box for a rectangular partition of a wall.
        """
        block_len = u_end - u_start
        block_h = y_top - y_bottom

        if block_len <= 1e-4 or block_h <= 1e-4:
            return None

        # Box dimensions: [length along wall, height along Y, thickness perpendicular]
        mesh = trimesh.creation.box(extents=[block_len, block_h, thickness])

        # Midpoint calculation along centerline
        u_mid = (u_start + u_end) / 2.0
        mid_x = wall_start.x + u_mid * u_unit[0]
        mid_z = wall_start.z + u_mid * u_unit[1]
        mid_y = (y_bottom + y_top) / 2.0

        # Orientation angle around Y axis
        angle_rad = math.atan2(u_unit[1], u_unit[0])
        cos_t = math.cos(-angle_rad)
        sin_t = math.sin(-angle_rad)

        transform = np.array([
            [cos_t,  0.0, -sin_t, mid_x],
            [0.0,    1.0,  0.0,   mid_y],
            [sin_t,  0.0,  cos_t, mid_z],
            [0.0,    0.0,  0.0,   1.0]
        ], dtype=np.float64)

        mesh.apply_transform(transform)
        return mesh

    @classmethod
    def extrude_single_wall(cls, wall: WallSegment) -> trimesh.Trimesh:
        """
        Extrudes a single wall segment, slicing door and window openings
        into a clean, manifold 3D mesh.
        """
        dx = wall.end.x - wall.start.x
        dz = wall.end.z - wall.start.z
        total_length = math.hypot(dx, dz)

        if total_length < 0.05:
            # Degenerate wall fragment, return empty mesh
            return trimesh.Trimesh()

        u_unit = (dx / total_length, dz / total_length)
        base_y = min(wall.start.y, wall.end.y)
        wall_height = wall.height
        thickness = wall.thickness

        # If no apertures, extrude full solid wall in one block
        if not wall.apertures:
            solid_block = cls._create_oriented_box_block(
                wall_start=wall.start,
                u_unit=u_unit,
                u_start=0.0,
                u_end=total_length,
                y_bottom=base_y,
                y_top=base_y + wall_height,
                thickness=thickness,
            )
            return solid_block if solid_block is not None else trimesh.Trimesh()

        # Sort apertures by distance along wall
        sorted_apertures = sorted(wall.apertures, key=lambda a: a.offset_along_wall)

        blocks: List[trimesh.Trimesh] = []
        current_u = 0.0

        for ap in sorted_apertures:
            ap_start = max(0.0, min(total_length, ap.offset_along_wall))
            ap_end = max(0.0, min(total_length, ap.offset_along_wall + ap.width))

            if ap_start >= total_length:
                break

            # 1. Solid segment before this aperture
            if ap_start > current_u:
                pre_block = cls._create_oriented_box_block(
                    wall_start=wall.start,
                    u_unit=u_unit,
                    u_start=current_u,
                    u_end=ap_start,
                    y_bottom=base_y,
                    y_top=base_y + wall_height,
                    thickness=thickness,
                )
                if pre_block:
                    blocks.append(pre_block)

            # 2. Aperture section:
            # - Bottom sill block (for windows with sill_height > 0)
            if ap.sill_height > 0:
                sill_top = min(base_y + wall_height, base_y + ap.sill_height)
                sill_block = cls._create_oriented_box_block(
                    wall_start=wall.start,
                    u_unit=u_unit,
                    u_start=ap_start,
                    u_end=ap_end,
                    y_bottom=base_y,
                    y_top=sill_top,
                    thickness=thickness,
                )
                if sill_block:
                    blocks.append(sill_block)

            # - Top lintel block (above door or window opening)
            opening_top = base_y + ap.sill_height + ap.height
            if opening_top < base_y + wall_height:
                lintel_block = cls._create_oriented_box_block(
                    wall_start=wall.start,
                    u_unit=u_unit,
                    u_start=ap_start,
                    u_end=ap_end,
                    y_bottom=opening_top,
                    y_top=base_y + wall_height,
                    thickness=thickness,
                )
                if lintel_block:
                    blocks.append(lintel_block)

            # Advance current position
            current_u = max(current_u, ap_end)

        # 3. Final solid segment after all apertures
        if current_u < total_length:
            post_block = cls._create_oriented_box_block(
                wall_start=wall.start,
                u_unit=u_unit,
                u_start=current_u,
                u_end=total_length,
                y_bottom=base_y,
                y_top=base_y + wall_height,
                thickness=thickness,
            )
            if post_block:
                blocks.append(post_block)

        if not blocks:
            return trimesh.Trimesh()

        combined = trimesh.util.concatenate(blocks)
        return combined

    @classmethod
    def extrude_walls_to_scene(cls, walls: List[WallSegment]) -> trimesh.Scene:
        """
        Extrudes all wall segments and packages them into a consolidated Trimesh 3D Scene.
        """
        scene = trimesh.Scene()
        for idx, wall in enumerate(walls):
            mesh = cls.extrude_single_wall(wall)
            if len(mesh.vertices) > 0:
                scene.add_geometry(mesh, node_name=f"wall_{wall.id}")
        return scene

    @classmethod
    def export_glb_bytes(cls, walls: List[WallSegment]) -> bytes:
        """
        Compiles the walls into a standard binary GLB (glTF 2.0 Binary) byte stream.
        Ready to be served to Three.js or saved to disk.
        """
        scene = cls.extrude_walls_to_scene(walls)
        # Export as GLB binary
        glb_data = scene.export(file_type="glb")
        if isinstance(glb_data, str):
            glb_data = glb_data.encode("utf-8")
        return glb_data

    @classmethod
    def to_mesh_summary(cls, walls: List[WallSegment]) -> Dict[str, Any]:
        """
        Extracts mesh statistics (vertex count, face count, bounding limits).
        """
        scene = cls.extrude_walls_to_scene(walls)
        total_verts = sum(len(g.vertices) for g in scene.geometry.values())
        total_faces = sum(len(g.faces) for g in scene.geometry.values())
        bounds = scene.bounds.tolist() if len(scene.geometry) > 0 else [[0, 0, 0], [0, 0, 0]]

        return {
            "vertex_count": total_verts,
            "face_count": total_faces,
            "bounds": bounds,
            "sub_wall_count": len(scene.geometry),
        }
