from src.geometry.collision import SpatialCollisionEngine
from src.schemas.spatial import VenueLayout, FixtureItem, WallSegment, Vector3


def test_clean_layout_has_no_collisions(clean_layout: VenueLayout):
    engine = SpatialCollisionEngine()
    collisions = engine.detect_collisions(clean_layout)
    assert len(collisions) == 0


def test_colliding_fixtures_detected(colliding_layout: VenueLayout):
    engine = SpatialCollisionEngine()
    collisions = engine.detect_collisions(colliding_layout)
    assert len(collisions) >= 1

    first = collisions[0]
    assert first["collision_type"] == "FIXTURE_FIXTURE"
    assert {first["object_a"], first["object_b"]} == {"sofa_a", "table_b"}
    assert "contact_point" in first
    assert first["contact_point"]["x"] is not None


def test_vertical_separation_prevents_false_collision(vertical_separated_layout: VenueLayout):
    """
    Overhead elements (TVs, ceiling lights, chandeliers) that overlap in 2D footprint
    must NOT trigger a 3D collision if vertically clearance is preserved.
    """
    engine = SpatialCollisionEngine()
    collisions = engine.detect_collisions(vertical_separated_layout)
    assert len(collisions) == 0


def test_fixture_wall_penetration_detected():
    """A table positioned through a wall must trigger a FIXTURE_WALL collision."""
    layout = VenueLayout(
        venue_id="wall_collision_test",
        version="1.0.0",
        walls=[
            WallSegment(
                id="main_wall",
                start=Vector3(x=0.0, y=0.0, z=5.0),
                end=Vector3(x=10.0, y=0.0, z=5.0),
                thickness=0.2,
                height=3.0,
            )
        ],
        fixtures=[
            FixtureItem(
                id="misplaced_table",
                name="Misplaced Table",
                model_type="table",
                # Positioned right on the wall centerline Z=5.0
                position=Vector3(x=5.0, y=0.4, z=5.0),
                rotation_y=0.0,
                bounding_box=Vector3(x=1.5, y=0.8, z=1.0),
            )
        ],
    )
    engine = SpatialCollisionEngine()
    collisions = engine.detect_collisions(layout)
    assert len(collisions) == 1
    assert collisions[0]["collision_type"] == "FIXTURE_WALL"
    assert collisions[0]["object_a"] == "misplaced_table"
    assert collisions[0]["object_b"] == "main_wall"
