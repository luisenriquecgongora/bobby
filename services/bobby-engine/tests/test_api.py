import pytest
from httpx import AsyncClient, ASGITransport
from src.main import app
from src.schemas.spatial import VenueLayout, FixtureItem, Vector3


@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.get("/health")
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "ok"
        assert data["service"] == "bobby-engine"
        assert data["version"] == "0.1.0"
        assert "uptime_seconds" in data


@pytest.mark.asyncio
async def test_validate_clean_layout(clean_layout: VenueLayout):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.post("/v1/spatial/validate", json=clean_layout.model_dump())
        assert res.status_code == 200
        data = res.json()
        assert data["is_valid"] is True
        assert len(data["collisions"]) == 0
        assert len(data["clearance_warnings"]) == 0
        assert "computation_time_ms" in data["metrics"]


@pytest.mark.asyncio
async def test_validate_colliding_layout(colliding_layout: VenueLayout):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.post("/v1/spatial/validate", json=colliding_layout.model_dump())
        assert res.status_code == 200
        data = res.json()
        assert data["is_valid"] is False
        assert len(data["collisions"]) >= 1
        assert data["collisions"][0]["collision_type"] == "FIXTURE_FIXTURE"


@pytest.mark.asyncio
async def test_extrude_walls_endpoint(clean_layout: VenueLayout):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "walls": [w.model_dump() for w in clean_layout.walls],
            "output_format": "glb",
        }
        res = await client.post("/v1/spatial/extrude-walls?format=glb", json=payload)
        assert res.status_code == 200
        assert res.headers["content-type"] == "model/gltf-binary"
        assert res.content[:4] == b"glTF"


@pytest.mark.asyncio
async def test_extrude_walls_json_format(clean_layout: VenueLayout):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "walls": [w.model_dump() for w in clean_layout.walls],
            "output_format": "json",
        }
        res = await client.post("/v1/spatial/extrude-walls?format=json", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert data["vertex_count"] > 0
        assert data["face_count"] > 0
        assert data["sub_wall_count"] == len(clean_layout.walls)


@pytest.mark.asyncio
async def test_diff_endpoint(clean_layout: VenueLayout):
    """Test RFC 6902 JSON patch and spatial delta computation."""
    previous = clean_layout.model_copy(deep=True)
    current = clean_layout.model_copy(deep=True)

    # Move VIP Table 1 by +2.0m on X axis and rotate by 45 degrees
    current.fixtures[0].position = Vector3(x=5.0, y=0.4, z=3.0)
    current.fixtures[0].rotation_y = 45.0

    # Add a new chair
    current.fixtures.append(
        FixtureItem(
            id="chair_extra",
            name="Extra Chair",
            model_type="chair",
            position=Vector3(x=1.0, y=0.45, z=1.0),
            rotation_y=0.0,
            bounding_box=Vector3(x=0.5, y=0.9, z=0.5),
        )
    )

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "previous": previous.model_dump(),
            "current": current.model_dump(),
        }
        res = await client.post("/v1/spatial/diff", json=payload)
        assert res.status_code == 200
        data = res.json()

        assert "patches" in data
        assert len(data["patches"]) >= 2
        assert "spatial_deltas" in data

        # Check displacement vector for modified table
        delta = next(d for d in data["spatial_deltas"] if d["fixture_id"] == "tbl_vip_1")
        assert delta["translation_delta_m"]["dx"] == 2.0
        assert delta["rotation_delta_deg"] == 45.0
        assert delta["total_displacement_m"] == 2.0

        # Check summary
        assert data["summary"]["added_fixtures"] == 1
        assert data["summary"]["modified_fixtures"] == 1
