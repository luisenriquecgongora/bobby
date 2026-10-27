import pytest
from src.schemas.spatial import (
    Vector3,
    ApertureType,
    WallAperture,
    WallSegment,
    FixtureItem,
    VenueLayout,
)


@pytest.fixture
def clean_layout() -> VenueLayout:
    """Venue layout with properly spaced fixtures and walls (no collisions, valid clearance)."""
    return VenueLayout(
        venue_id="venue_grand_ballroom",
        version="1.0.0",
        walls=[
            WallSegment(
                id="wall_north",
                start=Vector3(x=0.0, y=0.0, z=0.0),
                end=Vector3(x=12.0, y=0.0, z=0.0),
                thickness=0.20,
                height=3.5,
                apertures=[
                    WallAperture(
                        id="door_main",
                        type=ApertureType.DOOR,
                        offset_along_wall=4.0,
                        width=1.8,
                        height=2.2,
                        sill_height=0.0,
                    ),
                    WallAperture(
                        id="window_east",
                        type=ApertureType.WINDOW,
                        offset_along_wall=8.0,
                        width=2.0,
                        height=1.5,
                        sill_height=1.0,
                    ),
                ],
            ),
            WallSegment(
                id="wall_west",
                start=Vector3(x=0.0, y=0.0, z=0.0),
                end=Vector3(x=0.0, y=0.0, z=10.0),
                thickness=0.20,
                height=3.5,
                apertures=[],
            ),
        ],
        fixtures=[
            FixtureItem(
                id="tbl_vip_1",
                name="VIP Table 1",
                model_type="table",
                position=Vector3(x=3.0, y=0.4, z=3.0),
                rotation_y=0.0,
                bounding_box=Vector3(x=1.6, y=0.8, z=1.0),
            ),
            FixtureItem(
                id="tbl_vip_2",
                name="VIP Table 2",
                model_type="table",
                position=Vector3(x=6.5, y=0.4, z=3.0),
                rotation_y=0.0,
                bounding_box=Vector3(x=1.6, y=0.8, z=1.0),
            ),
            FixtureItem(
                id="bar_island",
                name="Main Bar",
                model_type="bar_counter",
                position=Vector3(x=5.0, y=0.55, z=7.5),
                rotation_y=0.0,
                bounding_box=Vector3(x=4.0, y=1.1, z=1.2),
            ),
        ],
    )


@pytest.fixture
def colliding_layout() -> VenueLayout:
    """Venue layout where two fixtures physically penetrate each other."""
    return VenueLayout(
        venue_id="venue_collision_test",
        version="1.0.0",
        walls=[],
        fixtures=[
            FixtureItem(
                id="sofa_a",
                name="Lounge Sofa A",
                model_type="sofa",
                position=Vector3(x=2.0, y=0.4, z=2.0),
                rotation_y=0.0,
                bounding_box=Vector3(x=2.0, y=0.8, z=1.0),
            ),
            FixtureItem(
                id="table_b",
                name="Coffee Table B",
                model_type="table",
                # Overlaps significantly with sofa_a at X=2.0, Z=2.0
                position=Vector3(x=2.5, y=0.25, z=2.2),
                rotation_y=0.0,
                bounding_box=Vector3(x=1.2, y=0.5, z=0.8),
            ),
        ],
    )


@pytest.fixture
def vertical_separated_layout() -> VenueLayout:
    """Two fixtures share the same 2D footprint, but are separated in vertical elevation (e.g. chandelier / TV)."""
    return VenueLayout(
        venue_id="venue_vertical_test",
        version="1.0.0",
        walls=[],
        fixtures=[
            FixtureItem(
                id="floor_table",
                name="Dining Table",
                model_type="table",
                position=Vector3(x=4.0, y=0.4, z=4.0),
                rotation_y=0.0,
                bounding_box=Vector3(x=1.5, y=0.8, z=1.5),
            ),
            FixtureItem(
                id="ceiling_chandelier",
                name="Grand Chandelier",
                model_type="lighting",
                # Elevated at Y=2.8m, table top is at Y=0.8m
                position=Vector3(x=4.0, y=2.8, z=4.0),
                rotation_y=0.0,
                bounding_box=Vector3(x=1.0, y=0.6, z=1.0),
            ),
        ],
    )


@pytest.fixture
def narrow_aisle_layout() -> VenueLayout:
    """Fixtures do not collide, but the aisle distance is narrower than the 1.2m egress threshold."""
    return VenueLayout(
        venue_id="venue_narrow_aisle_test",
        version="1.0.0",
        walls=[],
        fixtures=[
            FixtureItem(
                id="table_left",
                name="Left Booth",
                model_type="booth",
                position=Vector3(x=2.0, y=0.5, z=3.0),
                rotation_y=0.0,
                bounding_box=Vector3(x=1.0, y=1.0, z=1.0),
            ),
            FixtureItem(
                id="table_right",
                name="Right Booth",
                model_type="booth",
                # Gap is 3.7 - (0.5 + 0.5) = 0.7m (< 1.2m egress minimum!)
                position=Vector3(x=3.7, y=0.5, z=3.0),
                rotation_y=0.0,
                bounding_box=Vector3(x=1.0, y=1.0, z=1.0),
            ),
        ],
    )
