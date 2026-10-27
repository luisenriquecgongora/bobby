// @bobby/core/src/version/index.ts
// Application versioning, build metadata, and commit history log.

export interface CommitEntry {
  hash: string;
  shortHash: string;
  author: string;
  date: string;
  isoDate: string;
  subject: string;
}

export const APP_VERSION = '0.1.0';
export const APP_NAME = 'Bobby';
export const REPOSITORY_URL = 'https://github.com/luisenriquecgongora/bobby';
export const BUILD_DATE = '2026-10-27';

export const BUILT_IN_COMMITS: CommitEntry[] = [
  {
    hash: 'e6b334a3afa247cb978a80a2e97c32f53b9dac26',
    shortHash: 'e6b334a',
    author: 'Luis Enrique',
    date: '2026-10-16',
    isoDate: '2026-10-16T16:02:35+02:00',
    subject: 'chore(deploy): add root vercel.json and gitignore .vercel',
  },
  {
    hash: '87bd596b9eaf140e3e934d4e0bc83d1262e97b04',
    shortHash: '87bd596',
    author: 'Luis Enrique',
    date: '2026-10-16',
    isoDate: '2026-10-16T15:38:49+02:00',
    subject: 'feat(ci): add automated multi-platform desktop release workflow and download button',
  },
  {
    hash: '77ea0ca034377d4d63622e276b8c268293d138ca',
    shortHash: '77ea0ca',
    author: 'Luis Enrique',
    date: '2026-10-16',
    isoDate: '2026-10-16T15:23:07+02:00',
    subject: 'fix(engine): resolve ts paths and floorMaterialBuilder dimensions signature',
  },
  {
    hash: '43814f244cc7492ea26fe48c10c251a0365e4eb6',
    shortHash: '43814f2',
    author: 'Luis Enrique',
    date: '2026-10-16',
    isoDate: '2026-10-16T15:11:39+02:00',
    subject: 'chore: lockfile and Yarn v1 workspace protocol alignment',
  },
  {
    hash: '9c892e3ce40e54f20c7a06c18dcceaaa32394191',
    shortHash: '9c892e3',
    author: 'Luis Enrique',
    date: '2026-10-16',
    isoDate: '2026-10-16T14:56:10+02:00',
    subject: 'chore: add comprehensive .gitignore blocking secrets, env files, and build artifacts',
  },
  {
    hash: '27bfca9d45d2b9e417fd883c5c621048f994bdb3',
    shortHash: '27bfca9',
    author: 'Luis Enrique',
    date: '2026-10-16',
    isoDate: '2026-10-16T14:54:48+02:00',
    subject: 'feat(refactor): fully rename all packages and project scopes from @openvenue/* to @bobby/*',
  },
  {
    hash: '39972327f4bee6a125d65b5913f200220b3eaa00',
    shortHash: '3997232',
    author: 'Luis Enrique',
    date: '2026-10-16',
    isoDate: '2026-10-16T14:39:37+02:00',
    subject: 'feat(branding): rebrand constructor to Bobby (inspired by Bob the Builder) and add @openvenue/connector-plaato',
  },
  {
    hash: '287fb34e45b2538ce6fcbac979bd0973ce8d9d7e',
    shortHash: '287fb34',
    author: 'Luis Enrique',
    date: '2026-10-16',
    isoDate: '2026-10-16T13:59:32+02:00',
    subject: 'docs: add pricing model, architecture diagram, and opt-in storage explanation to README',
  },
  {
    hash: '15fb7ba5b1f724168b33cf20e78fab0dd4803b36',
    shortHash: '15fb7ba',
    author: 'Luis Enrique',
    date: '2026-10-16',
    isoDate: '2026-10-16T13:48:35+02:00',
    subject: 'feat: implement Sims-style 2D/3D wall tool with automatic openings and drag-and-drop GLB 3D model importer',
  },
  {
    hash: '265e5af5dc3034aed0fe58ddc5c35e680b46cc39',
    shortHash: '265e5af',
    author: 'Luis Enrique',
    date: '2026-10-16',
    isoDate: '2026-10-16T13:42:37+02:00',
    subject: 'feat(desktop): scaffold Tauri v2 desktop app and implement .venue ZIP packaging engine',
  },
  {
    hash: 'fd727741de844ae18b82ed78636d0a9a592a243b',
    shortHash: 'fd72774',
    author: 'Luis Enrique',
    date: '2026-10-16',
    isoDate: '2026-10-16T13:37:40+02:00',
    subject: 'feat(web): implement standalone web studio app with 3D viewport and inspector',
  },
  {
    hash: 'e72a7ba5fb4294e2a1661741626de62f826467e3',
    shortHash: 'e72a7ba',
    author: 'Luis Enrique',
    date: '2026-10-16',
    isoDate: '2026-10-16T13:36:08+02:00',
    subject: 'feat(editor): implement 3D Viewport with TransformControls gizmos and real-time PrimitiveEditor',
  },
  {
    hash: 'f7d77ec827ac705101caa7371c19f6f9536cc853',
    shortHash: 'f7d77ec',
    author: 'Luis Enrique',
    date: '2026-10-16',
    isoDate: '2026-10-16T13:34:43+02:00',
    subject: 'feat: initialize openvenue monorepo with core, engine, and viewer packages',
  },
];
