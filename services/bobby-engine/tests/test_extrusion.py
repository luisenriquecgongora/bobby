from src.geometry.extrusion import WallExtrusionEngine
from src.schemas.spatial import WallSegment, WallAperture, ApertureType, Vector3


def test_solid_wall_extrusion():
    wall = WallSegment(
        id="wall_solid",
        start=Vector3(x=0.0, y=0.0, z=0.0),
        end=Vector3(x=6.0, y=0.0, z=0.0),
        thickness=0.20,
        height=3.0,
        apertures=[],
    )
    mesh = WallExtrusionEngine.extrude_single_wall(wall)
    assert mesh is not None
    assert len(mesh.vertices) == 8  # A single solid box has 8 vertices
    assert len(mesh.faces) == 12   # A single solid box has 12 triangular faces
    assert mesh.volume > 0.0


def test_wall_with_door_cutout():
    """Wall with a door must be extruded with an opening and a top lintel."""
    wall = WallSegment(
        id="wall_door",
        start=Vector3(x=0.0, y=0.0, z=0.0),
        end=Vector3(x=8.0, y=0.0, z=0.0),
        thickness=0.20,
        height=3.0,
        apertures=[
            WallAperture(
                id="door_1",
                type=ApertureType.DOOR,
                offset_along_wall=3.0,
                width=1.5,
                height=2.2,
                sill_height=0.0,
            )
        ],
    )
    mesh = WallExtrusionEngine.extrude_single_wall(wall)
    assert mesh is not None
    # With 1 door: 1 left block + 1 top lintel block + 1 right block = 3 blocks (24 vertices, 36 faces)
    assert len(mesh.vertices) == 24
    assert len(mesh.faces) == 36


def test_wall_with_window_cutout():
    """Wall with a window must include a bottom sill block, opening void, and top lintel block."""
    wall = WallSegment(
        id="wall_window",
        start=Vector3(x=0.0, y=0.0, z=0.0),
        end=Vector3(x=10.0, y=0.0, z=0.0),
        thickness=0.20,
        height=3.0,
        apertures=[
            WallAperture(
                id="win_1",
                type=ApertureType.WINDOW,
                offset_along_wall=4.0,
                width=2.0,
                height=1.2,
                sill_height=1.0,
            )
        ],
    )
    mesh = WallExtrusionEngine.extrude_single_wall(wall)
    assert mesh is not None
    # 1 left + 1 sill + 1 lintel + 1 right = 4 blocks (32 vertices, 48 faces)
    assert len(mesh.vertices) == 32
    assert len(mesh.faces) == 48


def test_export_glb_binary_stream():
    """GLB export must generate valid glTF 2.0 binary header."""
    walls = [
        WallSegment(
            id="wall_a",
            start=Vector3(x=0.0, y=0.0, z=0.0),
            end=Vector3(x=5.0, y=0.0, z=0.0),
            thickness=0.15,
            height=2.8,
        )
    ]
    glb_bytes = WallExtrusionEngine.export_glb_bytes(walls)
    assert isinstance(glb_bytes, bytes)
    assert len(glb_bytes) > 20
    # glTF magic bytes: 0x46546C67 -> b"glTF"
    assert glb_bytes[:4] == b"glTF"
