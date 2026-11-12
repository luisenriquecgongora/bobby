# Bobby (Openvenue) Release & Distribution Architecture 🚀

> **Authoritative guide for packaging, signing, and releasing Bobby CAD desktop applications and spatial engine binaries via Cloudflare R2 and GitHub Releases.**  
> *Follows the same release layout as `yapper` and `emiliano`, in the personal `luisenrique-releases` bucket.*

---

## 🌐 Unified Distribution Model

Bobby releases live in Luis Enrique's personal Cloudflare account. All compiled production binaries (`.msi`, `.exe`, `.dmg`, `.AppImage`) are mirrored to the dedicated Cloudflare R2 downloads bucket with zero egress fees and worldwide edge caching.

### Cloudflare R2 Credentials & Endpoints

| Parameter | Production Value | Description |
| :--- | :--- | :--- |
| **Cloudflare Account ID** | `R2_ACCOUNT_ID` repository secret | Luis Enrique's personal Cloudflare account |
| **Download Bucket** | `luisenrique-releases` | Public release bucket shared by bobby, emiliano, yapper and the other research projects (10 GB free tier; keep at most 3 versions per project) |
| **Public Edge Host** | `https://pub-fb9de4da4f48439ebb34b3795d05ab11.r2.dev` | Global edge distribution URL |
| **Custom Domain** *(Optional)* | None yet | Add one later with an R2 Custom Domain; the r2.dev URL is rate-limited |

---

## 📁 Object Storage Hierarchy

Releases in `luisenrique-releases` follow this exact structure under the `bobby/` prefix:

```text
luisenrique-releases/
└── bobby/
    ├── latest/
    │   ├── Bobby-windows-x64.msi             # Canonical Windows installer (short cache / 5m)
    │   ├── Bobby-windows-x64.exe             # Standalone executable
    │   ├── Bobby-darwin-universal.dmg        # macOS universal binary
    │   ├── Bobby-linux-amd64.AppImage        # Linux portable binary
    │   └── latest.json                       # Auto-updater manifest (60s cache)
    │
    └── v0.1.0/
        ├── Bobby-v0.1.0-windows-x64.msi      # Immutable versioned installer (1-year cache)
        ├── Bobby-v0.1.0-windows-x64.msi.sha256
        ├── Bobby-v0.1.0-darwin.dmg
        └── version.json                      # Release metadata & checksums
```

### Cache Headers Policy
- **Versioned binaries (`/v0.1.0/*`)**: `public, max-age=31536000, immutable` (safe to cache forever; content never mutates).
- **Canonical pointers (`/latest/*`)**: `public, max-age=300` (5 minutes edge cache for fast installer downloads).
- **Updater manifest (`latest.json`)**: `public, max-age=60, must-revalidate` (rapid rollout of updates).

---

## 🔄 In-Browser vs Desktop Proxying (CORS)

Like `robot_host`, Bobby uses a hybrid network model:

1. **Direct Binary Downloads (`.msi` / `.exe` / `.dmg`)**:
   - Web browsers downloading the setup file (`<a href="..." download>`) do **not** trigger CORS checks.
   - Downloads stream directly from `https://pub-fb9de4da4f48439ebb34b3795d05ab11.r2.dev/bobby/latest/...` at wire speed.

2. **Tauri Desktop Auto-Updater**:
   - The desktop client runs natively and polls `https://pub-fb9de4da4f48439ebb34b3795d05ab11.r2.dev/bobby/latest/latest.json`.
   - Native network clients are not subject to browser cross-origin security boundaries.

3. **In-Browser Admin / Tenant Manifest Reads**:
   - If an admin panel on a custom tenant domain (`app.<tenant>.com`) fetches `latest.json` via JavaScript `fetch()`, Cloudflare R2's `r2.dev` CORS policy will reject the cross-origin preflight.
   - For web apps, route through the API proxy (e.g. `GET /public/bobby/latest-release` in `api-takient` or Next.js edge route) matching `GetLatestRobotHostRelease.ts`.

---

## 🛠️ Tauri v2 Auto-Updater Configuration

In `apps/desktop/src-tauri/tauri.conf.json`, configure the updater plugin to poll the R2 manifest:

```json
{
  "plugins": {
    "updater": {
      "active": true,
      "endpoints": [
        "https://pub-fb9de4da4f48439ebb34b3795d05ab11.r2.dev/bobby/latest/latest.json"
      ],
      "dialog": true,
      "pubkey": "YOUR_TAURI_UPDATE_PUBLIC_KEY"
    }
  }
}
```

The updater manifest `latest.json` format:
```json
{
  "version": "0.1.0",
  "notes": "Parametric aperture CSG cutting and 3D spatial collision validation.",
  "pub_date": "2026-10-28T12:00:00Z",
  "platforms": {
    "windows-x86_64": {
      "signature": "...",
      "url": "https://pub-fb9de4da4f48439ebb34b3795d05ab11.r2.dev/bobby/v0.1.0/Bobby-v0.1.0-windows-x64.msi.zip"
    },
    "darwin-universal": {
      "signature": "...",
      "url": "https://pub-fb9de4da4f48439ebb34b3795d05ab11.r2.dev/bobby/v0.1.0/Bobby-v0.1.0-darwin.app.tar.gz"
    }
  }
}
```

---

## 🤖 GitHub Actions Workflow Automation

Update `.github/workflows/release.yml` with the Cloudflare R2 upload step:

```yaml
      - name: Publish Release to Cloudflare R2
        env:
          R2_ACCOUNT_ID: ${{ secrets.R2_ACCOUNT_ID }}
          R2_ACCESS_KEY_ID: ${{ secrets.R2_ACCESS_KEY_ID }}
          R2_SECRET_ACCESS_KEY: ${{ secrets.R2_SECRET_ACCESS_KEY }}
          R2_BUCKET_NAME: ${{ secrets.R2_BUCKET_NAME || 'luisenrique-releases' }}
          R2_PUBLIC_URL: 'https://pub-fb9de4da4f48439ebb34b3795d05ab11.r2.dev'
        run: |
          node scripts/publish_bobby_to_r2.js --version ${{ github.ref_name }}
```

---

## 📜 Manual Verification

Verify uploaded artifacts via terminal:
```bash
# Check manifest
curl -i https://pub-fb9de4da4f48439ebb34b3795d05ab11.r2.dev/bobby/latest/latest.json

# Test download headers (should return 200 OK with content-length)
curl -I https://pub-fb9de4da4f48439ebb34b3795d05ab11.r2.dev/bobby/latest/Bobby-windows-x64.msi
```
