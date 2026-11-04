# Architecture

The map of Bobby: what its parts are, how a venue goes from a drawing to a validated 3D scene, and where to
change what. Keep it current: a change that adds, removes or rewires a part updates the diagram in the same
pull request (`AGENTS.md`, section 11).

## Color palette

| Color | Meaning |
| :--- | :--- |
| 🟦 Blue | Our code: packages, apps, services |
| 🟪 Purple | Inputs: the user's drawing, imported 3D models, furniture definitions |
| 🟨 Yellow | Checks and decisions |
| 🟩 Green | Outputs: 3D scene, `.venue` files, validation results |
| ⬜ Grey | External systems we do not own |
| 🟥 Red | Credentials (Plaato login) |

## The big picture

Bobby is a 3D venue designer: you draw walls and place furniture, and it renders the venue in 3D, checks it
for collisions and safe walkways, and syncs it to the Plaato platform.

```mermaid
flowchart LR
    user["👤 Designer<br/>draws walls, places furniture"]
    subgraph apps["Apps · apps/"]
        direction TB
        web["Web studio<br/>apps/web · Vite"]
        desktop["Desktop studio<br/>apps/desktop · Tauri"]
    end
    subgraph pkgs["Packages · packages/"]
        direction TB
        editor["@bobby/editor<br/>viewport, wall pen, primitive editor"]
        viewer["@bobby/viewer<br/>read-only VenueViewer"]
        engine["@bobby/engine<br/>Three.js geometry, materials, furniture library"]
        core["@bobby/core<br/>types, coordinates, .venue format,<br/>SpatialEngineClient"]
        conn["@bobby/connector-plaato<br/>sync adapter"]
    end
    user --> web & desktop
    web & desktop --> editor
    editor --> viewer --> engine --> core
    editor --> conn
    core -->|HTTP| svc["bobby-engine<br/>services/bobby-engine · FastAPI, port 8000"]
    conn -->|HTTPS| plaato["PlaatoOS / Takient<br/>backend"]
    core --> file["📦 .venue file<br/>ZIP: manifest, scene, assets"]

    classDef input fill:#ede9fe,stroke:#7c3aed,color:#3b0764
    classDef ours fill:#dbeafe,stroke:#2563eb,color:#1e3a8a
    classDef output fill:#dcfce7,stroke:#16a34a,color:#14532d
    classDef external fill:#f3f4f6,stroke:#6b7280,color:#374151
    class user input
    class web,desktop,editor,viewer,engine,core,conn,svc ours
    class file output
    class plaato external
    style apps fill:#eff6ff,stroke:#2563eb
    style pkgs fill:#eff6ff,stroke:#2563eb
```

**Dependency direction** (enforced by convention, see `AGENTS.md`): `core` ← `engine` ← `viewer` ← `editor` ←
apps. `editor` also uses `connector-plaato`. Packages never import from apps. Packages resolve each other
through their built `dist/`, so `typecheck` and `test` build first (`turbo.json`).

## From a drawing to a validated venue

```mermaid
flowchart TD
    draw["Wall pen + primitive editor<br/>packages/editor"] --> scene["Scene state<br/>walls, floor, furniture (meters)"]
    import["Imported .glb / .gltf<br/>AssetImporter: size + ground"] --> scene
    defs["Furniture library<br/>packages/engine/src/baseDefinitions.ts"] --> build
    scene --> build["ObjectBuilder + wallBuilder<br/>Three.js meshes, materials"]
    build --> view["🖥️ 3D viewport"]
    scene --> conv["spatialConverter<br/>scene → engine request"]
    conv --> client["SpatialEngineClient<br/>packages/core/src/spatial"]
    client --> api{"bobby-engine<br/>POST /v1/spatial/validate"}
    api --> coll["collision.py<br/>objects overlapping"]
    api --> clear["clearance.py<br/>walkways wide enough"]
    coll & clear --> result["Validation result<br/>shown in SpatialValidationDrawer"]
    client -.-> ext["/v1/spatial/extrude-walls<br/>2D walls → 3D, doors, windows"]
    client -.-> diff["/v1/spatial/diff<br/>JSON patch between layouts"]

    classDef input fill:#ede9fe,stroke:#7c3aed,color:#3b0764
    classDef ours fill:#dbeafe,stroke:#2563eb,color:#1e3a8a
    classDef gate fill:#fef9c3,stroke:#ca8a04,color:#713f12
    classDef output fill:#dcfce7,stroke:#16a34a,color:#14532d
    class draw,import,defs input
    class scene,build,conv,client,coll,clear,ext,diff ours
    class api gate
    class view,result output
```

Units are **meters** everywhere; dimensions are `[width, depth, height]`. Python uses `Vector3`, TypeScript
`Vector3D`. Only variant 0 of each furniture type renders (`getBaseDefinition`): see the
`add-furniture-definition` skill before adding one.

## Saving and syncing

```mermaid
flowchart LR
    scene["Scene in the editor"] --> save["Save as .venue<br/>core/src/format/venueFile.ts"]
    save --> zip["📦 manifest.json + scene.json + assets/"]
    scene --> modal["PlaatoCloudModal<br/>packages/editor"]
    login["🔑 Plaato login"] --> modal
    modal --> conn["PlaatoConnector<br/>packages/connector-plaato"]
    conn -->|"rooms, assets (presigned upload),<br/>room-3d/sync"| plaato["PlaatoOS / Takient backend"]

    classDef ours fill:#dbeafe,stroke:#2563eb,color:#1e3a8a
    classDef output fill:#dcfce7,stroke:#16a34a,color:#14532d
    classDef external fill:#f3f4f6,stroke:#6b7280,color:#374151
    classDef risk fill:#fee2e2,stroke:#dc2626,color:#7f1d1d
    class scene,save,modal,conn ours
    class zip output
    class plaato external
    class login risk
```

The login token stays in the connector; never log it or write it into a `.venue` file.

## Parts

| Part | Folder | What it does | Talks to |
| :--- | :--- | :--- | :--- |
| Core | `packages/core` | Shared types, coordinate conversion, `.venue` format, `SpatialEngineClient` | bobby-engine |
| Engine (3D) | `packages/engine` | Three.js builders, materials, procedural textures; `baseDefinitions.ts` is the furniture library | Core |
| Viewer | `packages/viewer` | Read-only `VenueViewer` | Engine |
| Editor | `packages/editor` | Viewport, wall pen, primitive editor, validation drawer, asset importer, Plaato modal | Viewer, connector |
| Plaato connector | `packages/connector-plaato` | Login, rooms, asset upload, room sync | Plaato backend |
| Web / desktop studio | `apps/web`, `apps/desktop` | The two shells that compose the packages | Editor |
| bobby-engine | `services/bobby-engine` | FastAPI: `GET /health`, `POST /v1/spatial/validate`, `/extrude-walls`, `/diff`; geometry in `src/geometry/` | — |

## Where to change what

| To change... | Look in | Skill |
| :--- | :--- | :--- |
| Add a piece of furniture | `packages/engine/src/baseDefinitions.ts` | `.agents/skills/add-furniture-definition` |
| Add or change a geometry endpoint | `services/bobby-engine/src/api/routes.py`, then `spatialClient` / `spatialTypes` / `spatialConverter` | `.agents/skills/add-geometry-endpoint` |
| Validation rules (collisions, clearances) | `services/bobby-engine/src/geometry/` | `.agents/skills/add-geometry-endpoint` |
| The `.venue` file format | `packages/core/src/format/venueFile.ts` | `.agents/skills/review-change` |
| Plaato sync | `packages/connector-plaato/src/index.ts` | `.agents/skills/review-change` |
