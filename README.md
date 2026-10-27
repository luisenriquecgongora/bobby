# Bobby 🛠️

> **"Can we build it? Yes we can!"**  
> **100% Offline 3D Spatial Floorplanner, CAD Architecture Tool & Object Constructor for Venues (Web Studio & Tauri Desktop)**  
> Build, customize, and visualize commercial venues, furniture, and seating maps 100% offline on your laptop or publish directly to PlaatoOS.

[![Version](https://img.shields.io/badge/version-v0.1.0-teal.svg)](https://github.com/luisenriquecgongora/bobby/releases)
[![Tests](https://img.shields.io/badge/tests-12%20passing-emerald.svg)](https://github.com/luisenriquecgongora/bobby)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## 🏗️ Architecture & Storage Model

```mermaid
flowchart TD
    subgraph OfflineFree["100% Free & Offline (Open Source)"]
        User["Venue Designer / Owner"]
        App["Plaato Studio (Tauri Desktop / Web PWA)"]
        LocalDisk["Laptop Hard Drive (.venue ZIP Files)"]

        User --> App
        App <--> LocalDisk
    end

    subgraph OptInCloud["PlaatoOS 3D Cloud Hosting (Opt-In / Business Plan)"]
        API["PlaatoOS API (api-takient)\n• requireBusinessTier(['business'])\n• Check 50MB Quota Limit"]
        R2["Cloudflare R2 Storage\n(Encrypted Private 3D Bucket, $0 Egress)"]
        Viewer["Live Customer 3D Table Booking\n(mfe-app / Public Tenant Sites)"]

        App -. "1. Opt-In & Presign" .-> API
        API -. "2. 15-min Presigned Ticket" .-> App
        App -. "3. Direct Model Upload" .-> R2
        R2 --> Viewer
        API --> Viewer
    end
```

---

## 💰 Pricing & Storage Model

| Tier | Price | Included Storage | What You Can Do |
|---|---|---|---|
| **Plaato Studio (Offline Open Source)** | **$0 (Free Forever)** | **Unlimited Local Disk** | Design venue layouts, draw 2D walls, place tables with 3D gizmos, import `.glb` models, and save `.venue` files on your computer. |
| **PlaatoOS Cloud 3D (Standard Included)** | **Included in Business Plan** | **50 MB Cloud Storage** | Publish your 3D venue online so guests can view photorealistic VIP sofas, bars, and book tables online. |
| **Cloud Storage Expansion (Opt-In Addon)** | **$5 / month per 100 MB** *(or 500 Coins)* | **Up to 1 GB+** | For mega-venues, casinos, and hotels with dozens of high-poly 3D furniture models. Hard quota guard prevents accidental overages. |

---

## 🔒 How Opt-In Storage Works

1. **Free by Default**: Using Plaato Studio creates **$0 cost** for you and your server. Everything runs locally on the user's laptop.
2. **Opt-In Required**: To enable live 3D customer bookings on PlaatoOS, the venue manager opts in under `Venue Settings > 3D Cloud Hosting`.
3. **Business Plan Gated**: The API checks [`requireBusinessTier(['business'])`](https://github.com/takient/takient). Free accounts are prompted to upgrade.
4. **Hard Quota Limit**: The API blocks uploads once the 50 MB threshold is reached, protecting both the venue and the platform from unexpected fees.
5. **Zero Server RAM**: 3D files upload directly to Cloudflare R2 via single-use, 15-minute presigned tickets. Zero 3D binaries pass through server memory.

---

## 📦 Packages in this Monorepo

- **`@bobby/core`**: 3D spatial math, coordinate transforms (cm to meters), `.venue` ZIP packaging, and version history.
- **`@bobby/engine`**: Three.js runtime, procedural geometry builder, PBR materials, and 10,000+ lines of furniture definitions.
- **`@bobby/viewer`**: Ultra-lightweight (<50KB) embeddable 3D customer viewer for web and mobile.
- **`@bobby/editor`**: Interactive 3D viewport with `TransformControls` gizmos (W/E/R), 2D Sims-style wall pen, `.glb` drag-and-drop, and Changelog / Commits modal.
- **`@bobby/connector-plaato`**: Safe cloud sync adapter connecting Bobby to PlaatoOS / Takient platform with direct Cloudflare R2 presigned uploads.
- **`apps/desktop`**: Standalone native desktop application built with **Tauri v2** (Rust + WebView).
- **`apps/web`**: Web studio application deployable as a PWA (`creator.plaatoos.com`).

---

## 🚀 Quick Start (Local Development)

```bash
# Clone the repository
git clone https://github.com/luisenriquecgongora/bobby.git
cd bobby

# Install dependencies
yarn install

# Run automated unit tests (Vitest)
yarn test

# Run full monorepo typecheck
yarn typecheck

# Start the web studio
yarn dev

# Run the Tauri desktop app
yarn workspace @bobby/desktop tauri dev
```

---

## 📄 License

MIT License — free for personal and commercial use.
