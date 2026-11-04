---
name: add-furniture-definition
description: Add or change a procedural 3D object (furniture, TV, plant, fixture) in Bobby's object library, built from primitive geometries. Use when asked to add a new object type, a new size or variant of an existing one, or to fix how an object looks.
---

# Add or change a furniture definition

Objects are not 3D model files: each is a `BaseObjectDefinition` made of primitive parts,
built into Three.js meshes at runtime.

## Where things live

| What | Where |
|---|---|
| Definition types (`BaseObjectDefinition`, `GeometryPart`, `RoomElementType`) | `packages/core/src/types/index.ts` |
| The library of definitions | `packages/engine/src/baseDefinitions.ts` (very large: search, do not read it whole) |
| Registry: type -> list of definitions | `BASE_DEFINITIONS_REGISTRY` near the end of `baseDefinitions.ts` |
| Builder used by editor and viewer | `createRoomObject()` in `packages/engine/src/ObjectBuilder.ts` |

## Rules that are easy to miss

- **Only the first definition of a type is rendered.** `ObjectBuilder` calls `getBaseDefinition(element.type)`
  with the default `variant = 0`. Adding a variant to the end of a type's list does not change what users see;
  reordering the list does. Never reorder existing entries.
- **Units are meters; dimensions are `[width, depth, height]`.** Element dimensions coming from the venue are
  centimeters and are converted with `cmToMeters` in `ObjectBuilder`.
- **Base at Y = 0.** Shift part positions so the object's lowest point sits on the floor (see the TV definitions).
- **Axes:** X = width, Y = height, Z = depth (away from the wall).
- **Primitives:** `box`, `cylinder`, `sphere`, `torus`, `cone`, `capsule`. Prefer few parts; set
  `supportsInstancing: true` when the object has no per-instance variation.

## Steps

1. New object type? Add the value to `RoomElementType` in `packages/core/src/types/index.ts`
   (string value in snake_case; it is stored in venue files, so never rename an existing one).
2. Add `export const <NAME>: BaseObjectDefinition = { id, type, name, description, defaultDimensions, parts }`
   next to similar objects in `baseDefinitions.ts`, with a comment giving real-world dimensions.
3. Register it in `BASE_DEFINITIONS_REGISTRY` (append; first entry is the one rendered).
4. Build in order, because packages import each other's `dist/`: `yarn turbo run build --filter=@bobby/web`.
5. Look at it: `yarn workspace @bobby/web dev`, place the object, check scale against a door or chair.

## Done when

`python scripts/verify.py` passes and the object renders at the right size in the web studio.
