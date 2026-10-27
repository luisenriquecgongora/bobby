from src.geometry.clearance import EgressValidator
from src.schemas.spatial import VenueLayout, FixtureItem, WallSegment, Vector3


def test_clean_layout_egress_clearance(clean_layout: VenueLayout):
    validator = EgressValidator(min_clearance_meters=1.20)
    warnings, metrics = validator.validate_layout(clean_layout)

    # In clean_layout, tables are separated by > 1.8m
    assert len(warnings) == 0
    assert metrics["clearance_violations_count"] == 0
    assert metrics["min_observed_clearance_m"] >= 1.20
    assert metrics["total_fixture_footprint_sqm"] > 0
    assert metrics["total_wall_footprint_sqm"] > 0


def test_narrow_aisle_triggers_clearance_warning(narrow_aisle_layout: VenueLayout):
    """
    Two booths separated by 0.7m must be flagged when the required clearance is 1.2m.
    """
    validator = EgressValidator(min_clearance_meters=1.20)
    warnings, metrics = validator.validate_layout(narrow_aisle_layout)

    assert len(warnings) == 1
    assert "Egress Clearance Violation" in warnings[0]
    assert "0.70m" in warnings[0] or "0.7" in warnings[0]
    assert metrics["clearance_violations_count"] == 1
    assert metrics["min_observed_clearance_m"] < 1.20


def test_custom_clearance_threshold(narrow_aisle_layout: VenueLayout):
    """Custom threshold of 0.5m should pass when gap is 0.7m."""
    validator = EgressValidator()
    # Test with lenient 0.5m threshold
    warnings, metrics = validator.validate_layout(narrow_aisle_layout, min_clearance=0.50)
    assert len(warnings) == 0
    assert metrics["clearance_violations_count"] == 0


def test_wall_aisle_clearance_warning():
    """A table placed 0.4m from a wall must trigger a wall aisle clearance violation."""
    layout = VenueLayout(
        venue_id="wall_clearance_test",
        version="1.0.0",
        walls=[
            WallSegment(
                id="perimeter_wall",
                start=Vector3(x=0.0, y=0.0, z=0.0),
                end=Vector3(x=10.0, y=0.0, z=0.0),
                thickness=0.20,
                height=3.0,
            )
        ],
        fixtures=[
            FixtureItem(
                id="cramped_table",
                name="Cramped Table",
                model_type="table",
                # Wall edge is at Z = 0.10. Table edge is at Z = 0.50 - 0.40 = 0.10.
                # Center at Z=0.8, depth 0.6 -> table inner edge at Z = 0.8 - 0.3 = 0.5.
                # Distance to wall edge (0.1) is 0.4m < 1.2m.
                position=Vector3(x=5.0, y=0.4, z=0.8),
                rotation_y=0.0,
                bounding_box=Vector3(x=1.0, y=0.8, z=0.6),
            )
        ],
    )
    validator = EgressValidator(min_clearance_meters=1.20)
    warnings, metrics = validator.validate_layout(layout)

    assert len(warnings) == 1
    assert "Wall Aisle Clearance Violation" in warnings[0]
    assert "perimeter_wall" in warnings[0]
    assert "cramped_table" in warnings[0]
