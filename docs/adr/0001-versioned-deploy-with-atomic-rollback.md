# ADR 0001: Immutable Releases with Per-App CD

**Date:** 2026-02-28
**Status:** Proposed
**Authors:** Adrian Rollett
**Related issues:** [va.gov-team#133949](https://github.com/department-of-veterans-affairs/va.gov-team/issues/133949), [va.gov-team#132259](https://github.com/department-of-veterans-affairs/va.gov-team/issues/132259)

---

## Context

### The January 29, 2026 Incident

On January 29, 2026, a deployment incident caused an outage for the Medications application on VA.gov. The root cause was that a single-app webpack build overwrote a full-site build artifact in S3. The deployment script then deployed inconsistent webpack chunks to production — specifically, a `vendor.entry.js` file that was missing modules required by other applications.

Per-app continuous deployment to production was disabled in response. Applications now deploy exclusively via the daily 1 PM ET full-site deploy.

### Current Architecture

Today, deployments work as follows:

1. **CI builds** produce a tarball of static assets (JS, CSS) and upload it to `s3://vetsgov-website-builds-s3-upload/{commit_sha}/vagovprod.tar.bz2`.
2. **The daily deploy** (`daily-deploy-production.yml`) downloads the tarball and runs `deploy.sh`, which syncs the build output to both the website bucket (`-d`, served by the proxy at `www.va.gov`) and the assets bucket (`-a`, referenced by content-build's HTML via absolute S3 URLs).
3. **Per-app deploys** to dev and staging run via `partial-deploy.sh`, which relies on two layers of defense against overwriting shared assets:
   - `remove-global-assets.sh` runs **before archiving** — it performs recursive webpack chunk dependency analysis (parsing `__webpack_require__.e()` patterns, `webpackChunkName` annotations, and `Promise.all` calls) to identify exactly which files the app needs, then deletes everything else from the build directory.
   - `partial-deploy.sh` adds **belt-and-suspenders** rsync exclusion rules for known shared assets (`vendor*`, `polyfills*`, `style.*`, etc.) during sync.
4. **The reverse proxy** (multiple OpenResty instances behind an ALB) proxies browser requests to the S3 website hosting endpoint.
5. **Content-build** (separate repo) generates HTML pages with `data-entry-name` attributes resolved at build time via `process-entry-names.js`. This plugin reads `file-manifest.json` from the live assets bucket and rewrites tags to absolute S3 URLs (e.g., `https://prod-va-gov-assets.s3-us-gov-west-1.amazonaws.com/generated/vendor.entry.js`). Browser requests for entry scripts go directly to S3, not through the proxy. Lazy-loaded chunks, however, use webpack's `publicPath: '/generated/'` and are resolved relative to the page origin (`www.va.gov`), so they do go through the proxy.

### Problems This Architecture Creates

#### 1. Per-app CD to production is disabled

The disabled `continuous-deploy-production.yml` workflow deployed individual app builds using `partial-deploy.sh`. It was disabled because webpack produces a global `vendor.entry.js` whose contents depend on which entry points are in the build. The January 29 incident occurred because a single-app build tarball overwrote a full-site tarball at the same S3 key, and the subsequent full deploy used the corrupted artifact.

#### 2. Build-time isolation is fragile

`remove-global-assets.sh` is 200+ lines of regex-based webpack dependency analysis, tightly coupled to webpack's runtime code generation patterns (`__webpack_require__.e()`, `webpackChunkName` annotations, `Promise.all` constructs). Any change to webpack's code generation (e.g., a webpack version upgrade, a config change, or a new dynamic import pattern) could silently break the asset stripping logic. `partial-deploy.sh`'s rsync exclusion list is a second layer of defense but must be manually kept in sync with the set of shared assets.

The fundamental problem: all apps build into the same flat `generated/` directory, then we retroactively try to untangle which files belong to which app. This should be solved by the infrastructure rather than by parsing build artifacts.

#### 3. Deployments are not atomic

`aws s3 sync` uploads files one at a time. During a deploy, the live bucket contains a mix of old and new files. A user loading a page mid-deploy may receive inconsistent assets.

#### 4. Rollback is slow and manual

To roll back, an operator must re-run the deploy workflow with a previous commit SHA and wait for the full `s3 sync` to complete. There is no fast "undo" mechanism.

---

## Decision

We will replace the current deploy-in-place model with **immutable release prefixes** and **proxy-based atomic routing**. Each build uploads to its own S3 directory. The reverse proxy controls which version is live by rewriting HTML responses and asset requests to point at the correct release prefix. Deploying will then consist of updating a version pointer, with no file copying, sync, or overwrite race window. This eliminates `remove-global-assets.sh`, `partial-deploy.sh`, and the non-atomic deploy window entirely.

Content-build emits well-known tokens (`%%DEFINED_ASSET_PREFIX%%`, `%%CONTENT_ASSET_PREFIX%%`) in place of absolute S3 bucket URLs. The proxy's Lua body filter replaces these tokens with versioned S3 URLs before the HTML reaches the browser. Assets are still fetched directly from S3 (no TIC latency impact), but the proxy controls *which version* by choosing the release prefix.

### How It Works

#### Build & Upload

Every CI build — full-site or per-app — uploads its **complete, unmodified** output to an immutable release prefix:

```
s3://{asset-bucket}/releases/{commit_sha}/
  └── generated/
      ├── vendor.entry.js          ← included in upload (harmless — never deployed to live by per-app CD)
      ├── polyfills.entry.js
      ├── style.entry.css
      ├── medications.entry.js
      ├── medications.entry.css
      ├── claims-status.entry.js
      ├── src_applications_mhv-medications_components_List.entry.js
      ├── file-manifest.json
      └── ...
```

No files are stripped, filtered, or deleted from the build output. Build isolation comes from the infrastructure (each build gets its own directory), not from parsing build artifacts.

#### Token Emission in Content-Build

Content-build's `process-entry-names.js` currently resolves `data-entry-name` attributes to absolute S3 URLs by prepending the environment-specific bucket URL. Instead, it emits well-known tokens:

```html
<!-- Before (current) -->
<script src="https://prod-va-gov-assets.s3-us-gov-west-1.amazonaws.com/generated/vendor.entry.js"></script>
<link rel="preload" href="https://prod-va-gov-assets.s3-us-gov-west-1.amazonaws.com/generated/bitter-bold.woff2" ...>
<link rel="stylesheet" href="https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov/assets/content-build.css">

<!-- After (tokens) -->
<script src="%%DEFINED_ASSET_PREFIX%%/generated/vendor.entry.js"></script>
<link rel="preload" href="%%DEFINED_ASSET_PREFIX%%/generated/bitter-bold.woff2" ...>
<link rel="stylesheet" href="%%CONTENT_ASSET_PREFIX%%/assets/content-build.css">
```

The content-build change is minimal — replace `${bucket}` references with `%%DEFINED_ASSET_PREFIX%%` and `${bucketContent}` with `%%CONTENT_ASSET_PREFIX%%` in `process-entry-names.js`. The same token works across all environments.

| Approach | Risk |
|---|---|
| Match known bucket URL (e.g., `s3.../prod-va-gov-assets`) | Fragile: breaks on bucket rename, risks partial matches in inline JS, requires per-environment regex |
| Match a well-known token (`%%DEFINED_ASSET_PREFIX%%`) | Robust: will never appear in page content or inline JS, same Lua code works across all environments, survives bucket renames |

| Approach | Impact |
|---|---|
| Relative URLs (`/generated/vendor.entry.js`) | All asset requests go through TIC → ALB → proxy → S3. Adds latency on cold cache page loads. |
| Token → absolute S3 URL | Assets still fetched directly from S3, bypassing TIC. No latency change from current behavior. |

#### Proxy Body Filter

The proxy replaces tokens with versioned S3 URLs before sending the HTML response to the browser:

```lua
-- body_filter_by_lua_block (only for text/html responses)
local base_sha = ngx.shared.versions:get("base")
if not base_sha then return end

-- Validate SHA format before URI construction (defense against config bucket compromise)
if not ngx.re.match(base_sha, "^[0-9a-f]{40}$", "jo") then
    ngx.log(ngx.ERR, "invalid base SHA in version pointer: ", base_sha)
    return
end

local asset_bucket = "https://prod-va-gov-assets.s3-us-gov-west-1.amazonaws.com"
local content_bucket = "https://s3-us-gov-west-1.amazonaws.com/content.www.va.gov"

ngx.arg[1] = string.gsub(ngx.arg[1],
    "%%%%DEFINED_ASSET_PREFIX%%%%",
    asset_bucket .. "/releases/" .. base_sha)

ngx.arg[1] = string.gsub(ngx.arg[1],
    "%%%%CONTENT_ASSET_PREFIX%%%%",
    content_bucket)
```

After rewriting, the browser sees normal absolute S3 URLs pointing at the **versioned release prefix**:

```html
<script src="https://prod-va-gov-assets.s3.../releases/abc123def/generated/vendor.entry.js"></script>
```

The browser fetches this directly from S3. No TIC latency change. No additional proxy hops for assets.

For per-app overrides, the body filter makes a second pass to replace the base SHA with the app-specific SHA for overridden entries:

```lua
-- After the base replacement, apply per-app overrides
local apps = ngx.shared.app_versions
local keys = apps:get_keys(0)
for _, app in ipairs(keys) do
    local app_sha = apps:get(app)
    if app_sha and ngx.re.match(app_sha, "^[0-9a-f]{40}$", "jo") then
        -- Use ngx.re.gsub (not string.gsub) because entry names like
        -- "claims-status" contain Lua pattern metacharacters (- and .)
        -- that would be misinterpreted by Lua's string.gsub.
        local pattern = "releases/" .. base_sha .. "/generated/" .. ngx.re.gsub(app, "[-%.]" , "\\$0", "jo")
        local replacement = "releases/" .. app_sha .. "/generated/" .. app
        ngx.arg[1], _ = ngx.re.gsub(ngx.arg[1], pattern, replacement, "jo")
    end
end
```

> **Note on Lua pattern safety:** Lua's `string.gsub` treats `-` and `.` as pattern metacharacters. Entry names like `claims-status` or `pre-check-in` would cause incorrect or incomplete replacements. The body filter uses `ngx.re.gsub` (PCRE regex) instead, with metacharacters in the entry name escaped via `ngx.re.gsub(app, "[-%.]" , "\\$0")`. The base token replacement (`%%DEFINED_ASSET_PREFIX%%`) uses `string.gsub` safely because the token and SHA contain no Lua metacharacters (`%` is escaped as `%%%%` in Lua patterns, and the SHA is hex-only).

#### Lazy-Loaded Chunk Routing

Lazy-loaded chunks use webpack's `publicPath: '/generated/'` and are resolved relative to the page origin (`www.va.gov`), so they go through the proxy. The proxy rewrites the request URI to include the release prefix before proxying to S3:

```lua
-- rewrite_by_lua_block for /generated/* requests
local filename = ngx.var.uri:match("/generated/(.+)")
if not filename or not ngx.re.match(filename, "^[a-zA-Z0-9._-]+$", "jo") then
    return  -- reject filenames with path separators, .., or unexpected chars
end

-- Check for per-app chunk override first
local app_sha = ngx.shared.chunk_routes:get(filename)
local sha = app_sha or ngx.shared.versions:get("base")

-- Validate SHA format before URI construction
if sha and ngx.re.match(sha, "^[0-9a-f]{40}$", "jo") then
    ngx.req.set_uri("/releases/" .. sha .. ngx.var.uri)
end
```

The `chunk_routes` dict maps individual chunk filenames to their app's SHA. This mapping is built from the per-app file manifests stored in the config bucket.

The cache header for content-hashed chunks is set in a separate `header_filter_by_lua_block`, which runs after the upstream response is received but before headers are sent to the client:

```lua
-- header_filter_by_lua_block for /generated/* responses
local uri = ngx.var.uri
if uri and ngx.re.match(uri, "/generated/[^/]+\\.[0-9a-f]+\\.entry\\.js$", "jo") then
    ngx.header["Cache-Control"] = "public, max-age=31536000, immutable"
end
```

This cannot be set in the `rewrite_by_lua_block` because the upstream response headers (from S3) would overwrite any headers set before the request is proxied.

> **Cache headers for content-hashed chunks:** After adding `[contenthash]` to `chunkFilename` (step 9a), lazy chunk filenames include a content hash (e.g., `medications.a1b2c3d4.entry.js`). These are immutable by definition — a different content hash means a different filename. Setting `Cache-Control: public, max-age=31536000, immutable` lets browsers cache them indefinitely without revalidation requests. Entry points (`vendor.entry.js`, `medications.entry.js`) do **not** include a content hash and keep the default cache policy, since the proxy routes them to the correct release prefix on each request.

#### Version Pointer Sync

The S3 config bucket (`va-gov-deploy-config`) stores version pointers:

```
versions/base              ← SHA of the current full-site build
versions/base-history      ← recent base SHAs, one per line (most recent first)
versions/apps/{entryName}  ← SHA of a per-app override (if any)
versions/apps/{entryName}-history  ← recent per-app SHAs, one per line
manifests/{entryName}      ← list of filenames belonging to this app
```

Each deploy prepends the new SHA to the history file and trims it to 100 entries. The history file is just lines of 40-character hex SHAs (~4KB at 100 entries) — storage is negligible. The history file is a convenience for quick rollback selection ("show me recent deploys"); the real rollback boundary is the 90-day S3 lifecycle rule on release prefixes. Operators can target any SHA in the history or any retained release prefix by specifying it directly.

A systemd timer on each proxy instance polls the config bucket every 2 seconds, reads the version pointers and chunk manifests, and writes them to a local file. A Lua timer (`init_worker_by_lua_block`) reads this file and populates the `ngx.shared.versions`, `ngx.shared.app_versions`, and `ngx.shared.chunk_routes` dicts. Maximum convergence time: ~4 seconds across all 40+ instances.

The sync script validates all inputs before writing the local file:
- Version pointers must match `^[0-9a-f]{40}$` (reject anything that isn't a 40-char hex SHA).
- Manifest filenames must match `^[a-zA-Z0-9._-]+$` (no path separators, no `..`, no special characters).
- A sentinel file (`releases/{sha}/.build-complete`) must exist for a SHA before it is accepted. The CI upload writes this sentinel as the final step after all other files are uploaded.

#### App File Manifest

For per-app builds, a manifest of app-specific files is generated after the build. This is trivially computed — exclude the known shared assets, keep everything else:

```bash
SHARED_PATTERN="^(vendor|polyfills|style|styleConsolidated|shared-modules|web-components|va-medallia-styles|static-pages|proxy-rewrite|file-manifest)"

ls build/vagovprod/generated/ | grep -vE "$SHARED_PATTERN" > app-files.txt
```

This manifest tells the proxy which chunk filenames belong to this app, enabling per-app lazy chunk routing. It replaces `remove-global-assets.sh` (200+ lines of regex-based webpack dependency analysis) with a fixed exclusion list. In a per-app build, there is exactly one entry point — every non-shared file in the output belongs to that entry.

The shared asset list is stable: it changes only when a new shared entry is added to the webpack config's `sharedModules` or global entries. This happens at most a few times per year and is a conscious, reviewed config change (not an implicit coupling to webpack internals). A required CI gate validates this: a test generates the shared asset list from the webpack config's entry points and fails if it differs from the hardcoded `SHARED_PATTERN` (see "New Failure Modes and Mitigations" below).

**Yarn workspaces:** The repo defines ~29 yarn workspace packages (14 platform, 15 application). These do not affect the deploy model. Webpack inlines all workspace package code into the importing app's bundle — no workspace-specific chunks or build artifacts are produced. Apps with workspace dependencies (e.g., `check-in` with i18next, `accredited-representative-portal` with react-router-dom v6, the `@bio-aquia` family sharing a `shared` package) produce the same `[name].entry.js` output as any other app. The `SHARED_PATTERN` exclusion list is unaffected because workspace code lands in app-specific chunks, not in shared entries.

#### Full Daily Deploy

1. Upload complete build to `s3://{asset-bucket}/releases/{sha}/` in both the website bucket and asset bucket
2. Write build sentinel: `s3://{asset-bucket}/releases/{sha}/.build-complete`
3. Update base version pointer: `s3://va-gov-deploy-config/versions/base` ← `{sha}`
4. Prepend previous SHA to history: `s3://va-gov-deploy-config/versions/base-history` (trim to 100)
5. Clear all per-app version pointers and chunk manifests (the full build subsumes all per-app overrides)
6. Sync shared assets to non-prefixed live paths for TeamSite (see "TeamSite Constraint" below)

Steps 2-5 are instantaneous S3 writes. The proxy picks up the new version within ~4 seconds. **No `s3 sync` to live paths needed** for VA.gov pages — the proxy routes all requests to the new release prefix.

#### Per-App CD Deploy

1. Upload complete build to `s3://{asset-bucket}/releases/{sha}/` in both buckets
2. Write build sentinel: `s3://{asset-bucket}/releases/{sha}/.build-complete`
3. Write chunk manifest to config bucket:

```bash
aws s3 cp app-files.txt "s3://va-gov-deploy-config/manifests/$ENTRY_NAME"
```

4. Verify manifest was written:

```bash
aws s3api head-object --bucket va-gov-deploy-config --key "manifests/$ENTRY_NAME" \
  || { echo "Manifest verification failed"; exit 1; }
```

5. Update app version pointer and history:

```bash
CURR_SHA=$(aws s3 cp s3://va-gov-deploy-config/versions/apps/$ENTRY_NAME - 2>/dev/null || echo "")
echo "$SHA" | aws s3 cp - "s3://va-gov-deploy-config/versions/apps/$ENTRY_NAME"

# Prepend to history, trim to 100
if [ -n "$CURR_SHA" ]; then
    HISTORY=$(aws s3 cp s3://va-gov-deploy-config/versions/apps/$ENTRY_NAME-history - 2>/dev/null || echo "")
    echo -e "$CURR_SHA\n$HISTORY" | head -100 | aws s3 cp - "s3://va-gov-deploy-config/versions/apps/$ENTRY_NAME-history"
fi
```

**No files are copied to live paths.** The proxy picks up the new version within ~4 seconds and begins routing that app's entry and chunk requests to the new release prefix. Shared assets are not affected.

#### Per-App Rollback

```bash
APP="medications"
# Default: roll back to previous version (first entry in history)
# Or specify a SHA: ROLLBACK_SHA="abc123..."
ROLLBACK_SHA=${1:-$(aws s3 cp s3://va-gov-deploy-config/versions/apps/$APP-history - | head -1)}
CURR_SHA=$(aws s3 cp s3://va-gov-deploy-config/versions/apps/$APP -)

# Verify the target release exists
aws s3api head-object --bucket {asset-bucket} --key "releases/$ROLLBACK_SHA/.build-complete" \
  || { echo "Release $ROLLBACK_SHA not found or incomplete"; exit 1; }

# Update pointer
echo "$ROLLBACK_SHA" | aws s3 cp - "s3://va-gov-deploy-config/versions/apps/$APP"

# Prepend current SHA to history
if [ -n "$CURR_SHA" ]; then
    HISTORY=$(aws s3 cp s3://va-gov-deploy-config/versions/apps/$APP-history - 2>/dev/null || echo "")
    echo -e "$CURR_SHA\n$HISTORY" | head -100 | aws s3 cp - "s3://va-gov-deploy-config/versions/apps/$APP-history"
fi

# Restore chunk manifest from the rollback release
aws s3 cp "s3://{asset-bucket}/releases/$ROLLBACK_SHA/generated/app-files.txt" \
          "s3://va-gov-deploy-config/manifests/$APP"
```

Rollback is a few S3 writes. The proxy picks up the new pointer within ~4 seconds. Operators can target any SHA in the history or any retained release prefix.

#### Full Rollback

```bash
# Default: roll back to previous version (first entry in history)
# Or specify a SHA: ROLLBACK_SHA="abc123..."
ROLLBACK_SHA=${1:-$(aws s3 cp s3://va-gov-deploy-config/versions/base-history - | head -1)}
CURR=$(aws s3 cp s3://va-gov-deploy-config/versions/base -)

# Verify the target release exists
aws s3api head-object --bucket {asset-bucket} --key "releases/$ROLLBACK_SHA/.build-complete" \
  || { echo "Release $ROLLBACK_SHA not found or incomplete"; exit 1; }

# Update pointer
echo "$ROLLBACK_SHA" | aws s3 cp - s3://va-gov-deploy-config/versions/base

# Prepend current SHA to history
if [ -n "$CURR" ]; then
    HISTORY=$(aws s3 cp s3://va-gov-deploy-config/versions/base-history - 2>/dev/null || echo "")
    echo -e "$CURR\n$HISTORY" | head -100 | aws s3 cp - s3://va-gov-deploy-config/versions/base-history
fi

# Clear per-app overrides (full build is now authoritative)
aws s3 rm s3://va-gov-deploy-config/versions/apps/ --recursive
aws s3 rm s3://va-gov-deploy-config/manifests/ --recursive

# Re-sync TeamSite shared assets from the rollback release
aws s3 sync "s3://{asset-bucket}/releases/$ROLLBACK_SHA/generated/" "s3://{asset-bucket}/generated/" \
  --exclude "*" \
  --include "proxy-rewrite*" --include "vendor*" --include "polyfills*" \
  --include "styleConsolidated*" --include "static-pages*" \
  --acl public-read --cache-control "public, no-cache"
```

Rollback is a handful of S3 writes plus a TeamSite asset sync. The proxy picks up the new pointer within ~4 seconds. Operators can target any SHA in the history or any retained release prefix (releases are retained for 90 days).

### What This Eliminates

| Component removed | What it did | Why it's unnecessary |
|---|---|---|
| **`remove-global-assets.sh`** | 200+ lines of regex-based webpack dependency analysis. Parsed `__webpack_require__.e()`, `webpackChunkName`, `Promise.all` patterns to trace which chunks belong to the app, then deleted everything else. | Each build uploads to its own immutable prefix. Per-app deploys never copy files — the proxy routes requests to the correct release prefix. |
| **`partial-deploy.sh` rsync exclusions** | Belt-and-suspenders exclusion rules for 7 shared asset patterns, plus manual `--include`/`--exclude` ordering. | Per-app deploys are pointer updates, not file copies. No exclusion rules needed. |
| **`deploy.sh` live-path sync** (for per-app deploys) | Per-app synced files to live S3 paths one at a time. | The proxy routes requests to the release prefix. Only TeamSite shared assets need live-path sync (on full deploys only). |
| **Non-atomic deploy window** | `s3 sync` uploads files sequentially, mixing old and new during deploy. | Deploy is a pointer update. All requests switch to the new version simultaneously when the proxy picks up the new pointer. |
| **`file-manifest.json` overwrite bug** | The rsync `--include '*.js*'` pattern matched `file-manifest.json`, allowing a per-app deploy to overwrite the full manifest. | Per-app deploys don't write to live paths at all. |
| **Build artifact tarball overwrite** | Single-app and full-site tarballs shared the same S3 key pattern, enabling one to corrupt the other. | Each build uploads to `releases/{sha}/` — a unique, immutable prefix. No shared keys. |

### Implementation Considerations

**Chunked body filtering:** An HTML response may arrive in multiple chunks and a token could span a chunk boundary. Mitigations:

```nginx
proxy_set_header Accept-Encoding "";  # request uncompressed from S3
proxy_buffering on;                    # buffer full response before filtering
gzip on;                               # re-compress on the way out
```

HTML pages are small (~50-100KB). Buffering the full body before rewriting is negligible.

**Content-Length mismatch:** The rewritten body has a different length. Clear it and let nginx use chunked transfer encoding:

```lua
ngx.header.content_length = nil
```

**Performance:** Simple string replacement on ~50-100KB HTML. Sub-millisecond. The existing Prometheus Lua metrics code adds more overhead.

**Failure mode:** If the Lua body filter fails (no version SHA, Lua error), the browser sees `%%DEFINED_ASSET_PREFIX%%/generated/vendor.entry.js` — broken URLs. But since the HTML itself is served through the proxy, a Lua failure that prevents body filtering would also prevent serving the page. The fallback is the same as any proxy failure: the ALB serves the cached previous response, or the page doesn't load.

### TeamSite Constraint

TeamSite pages (benefits.va.gov, etc.) have hardcoded absolute S3 URLs in their HTML that we do not control:

```html
<script src="https://prod-va-gov-assets.s3-us-gov-west-1.amazonaws.com/generated/proxy-rewrite.entry.js"></script>
```

These assets (`proxy-rewrite.entry.js`, `vendor.entry.js`, `polyfills.entry.js`, `styleConsolidated.css`, `static-pages.css`) must remain at the non-prefixed live paths in the assets bucket. The full daily deploy syncs these shared assets from the release prefix to the non-prefixed paths. This is a fixed, small set of shared assets that change only on full builds — not a constraint on per-app CD.

**Residual risk:** These mutable live-path assets are still deployed via `s3 sync` and could be overwritten by a compromised deploy pipeline. `proxy-rewrite.entry.js` is particularly sensitive — it bootstraps the VA.gov SPA shell on TeamSite pages. Mitigation: S3 Object Lock (governance mode) on the non-prefixed shared asset paths, with a hash integrity check in the deploy script that verifies the uploaded file matches the expected build output before removing the lock.

### Config Bucket Security

The `va-gov-deploy-config` bucket is the **control plane for what code runs on VA.gov**. An attacker who can write to `versions/base` can redirect all 40+ proxy instances to serve arbitrary content within ~4 seconds. The bucket requires the following security posture:

**Access control:**
- IAM write permissions (`s3:PutObject`, `s3:DeleteObject`) scoped exclusively to the deploy workflow's OIDC-federated role. No long-lived credentials.
- S3 bucket policy denies `s3:PutObject` to all principals except the deploy role ARN.
- Read permissions (`s3:GetObject`, `s3:ListBucket`) granted to the proxy instances' IAM role (for version pointer sync).

**Audit and integrity:**
- S3 versioning enabled to provide an audit trail of all pointer changes.
- CloudTrail logging for all `PutObject`, `DeleteObject`, and `GetObject` events on the config bucket, with CloudWatch alarms on unexpected write principals.
- MFA-delete enabled on the bucket to prevent accidental or malicious deletion of version history.

**Input validation (defense in depth):**
- The sync timer validates that SHAs match `^[0-9a-f]{40}$` before accepting them (documented in Version Pointer Sync above).
- The sync timer validates that manifest filenames match `^[a-zA-Z0-9._-]+$` (no path separators or special characters).
- The sync timer verifies the sentinel file `releases/{sha}/.build-complete` exists before accepting a new SHA (prevents routing to an incomplete upload).

### Vendor Hash Check (Defense-in-Depth)

An optional CI check can verify that the per-app build's `vendor.entry.js` is byte-identical to the currently deployed one. This catches the case where a shared dependency update has changed the vendor chunk — the app was built against a different vendor than what's live. If the hashes differ, CD is skipped and the app waits for the next full build.

```bash
BASE_SHA=$(aws s3 cp s3://va-gov-deploy-config/versions/base -)
aws s3 cp "s3://{asset-bucket}/releases/$BASE_SHA/generated/vendor.entry.js" /tmp/deployed-vendor.js
DEPLOYED=$(sha256sum /tmp/deployed-vendor.js | cut -d' ' -f1)
LOCAL=$(sha256sum build/vagovprod/generated/vendor.entry.js | cut -d' ' -f1)

if [ "$DEPLOYED" != "$LOCAL" ]; then
  echo "vendor_compatible=false" >> "$GITHUB_OUTPUT"
else
  echo "vendor_compatible=true" >> "$GITHUB_OUTPUT"
fi
```

With immutable release prefixes, a vendor mismatch **cannot** cause the January 29 class of incident — the per-app deploy never touches `vendor.entry.js` in the live paths or the base release prefix. The mismatch would only affect the one app whose entry was built against a different vendor chunk (a runtime JS error, not a site-wide outage). The blast radius is one app, and rollback is instant (pointer swap). The vendor hash check is therefore defense-in-depth, not a critical safety gate.

The 7 `sharedModules` packages that can trigger this (`react`, `react-dom`, `redux`, `redux-thunk`, `react-redux`, `@sentry/browser`, `platform-polyfills`) change infrequently. ~95%+ of PRs are unaffected.

### What Does NOT Change

- **Webpack config.** Same output directory structure, same `publicPath`. **Exception:** `chunkFilename` changes from `'[name].entry.js'` to `'[name].[contenthash].entry.js'` to eliminate silent chunk mismatches during the convergence window (see Failure Modes table).
- **Developer workflow.** `yarn watch`, local dev, mock API — unchanged. Developers use webpack-dev-server with `publicPath: '/generated/'` and never see the `%%DEFINED_ASSET_PREFIX%%` tokens.
- **Daily deploy schedule.** Full-site deploy at 1 PM ET remains the backstop.
- **CI build step.** `yarn build --entry=$ENTRY` is unchanged.

### What DOES Change for Content-Build Local Dev

Content-build output now contains `%%DEFINED_ASSET_PREFIX%%` tokens instead of real S3 URLs. Developers running content-build locally and previewing output will see broken pages unless the tokens are replaced. The content-build local dev server (metalsmith) must handle token replacement with a local fallback:

```js
// In local dev mode, replace tokens with localhost
const prefix = isLocalDev
  ? 'http://localhost:3001'
  : '%%DEFINED_ASSET_PREFIX%%';
```

CI review instances must also perform token replacement (using the review instance's asset URL). This is a one-time change to the content-build local dev pipeline.

### Deployment Status Tooling

Operators and developers need to query the current deployment state for debugging and incident response. The deploy scripts will include a `deploy:status` command:

```bash
# yarn deploy:status (reads config bucket and reports)
Base SHA:         abc123def...
Base deployed at: 2026-02-28T18:05:32Z
Previous base:    def456abc...

Per-app overrides:
  medications:    fed789012... (deployed 2026-02-28T19:12:07Z)
  claims-status:  (none — using base)
```

This reads the config bucket's version pointers and the S3 object timestamps. It also supports `yarn deploy:status --app medications` for single-app queries and `yarn deploy:status --diff` to show the git diff between the deployed SHA and `main`.

### Production Monitoring

The new deploy model introduces failure modes that require automated detection. Three monitors are required before production rollout (step 10):

**1. Unresolved token synthetic check:**

A synthetic monitor (e.g., CloudWatch Synthetics canary) loads key pages every 60 seconds and checks for unresolved tokens in the response body:

```bash
# Synthetic check — runs every 60s against www.va.gov
curl -s https://www.va.gov/ | grep -q '%%DEFINED_ASSET_PREFIX%%' && alarm "Unresolved tokens in production HTML"
curl -s https://www.va.gov/ | grep -q '%%CONTENT_ASSET_PREFIX%%' && alarm "Unresolved content tokens in production HTML"
```

This detects a body filter failure (Lua error, missing SHA, misconfigured proxy) before users report broken pages. The check should cover the homepage and at least two app routes (e.g., `/health-care/refill-track-prescriptions`, `/disability/file-disability-claim-form-21-526ez`).

**2. Version pointer convergence staleness alarm:**

Each proxy instance's sync timer already reads version pointers every 2 seconds. Add a Prometheus gauge that records the age (in seconds) of the last successful sync:

```lua
-- In the sync timer callback
local last_sync_time = ngx.shared.metrics:get("last_version_sync_epoch")
ngx.shared.metrics:set("last_version_sync_epoch", ngx.time())
```

CloudWatch alarm on `max(last_version_sync_age) > 30` across all instances. If any instance hasn't successfully synced in 30 seconds, it's serving stale version pointers. This catches config bucket access failures, IAM permission issues, or a crashed sync timer.

**3. 4xx spike detection on `/generated/*`:**

A CloudWatch alarm on the ALB's `HTTPCode_Target_4XX_Count` metric, filtered to the `/generated/*` path pattern. A spike in 404s after a deploy indicates chunk routing failures — either the release prefix doesn't exist, the manifest is wrong, or the `[contenthash]` changed without updating the chunk manifest.

```
Metric: ALB TargetResponseTime 4xx count
Filter: path = /generated/*
Threshold: > 50 4xx responses in 5 minutes (baseline is near-zero)
Action: SNS → PagerDuty
```

This also serves as the primary detection for the convergence window chunk mismatch: with `[contenthash]`, a mismatched chunk request returns 404. A brief spike of 404s during the ~4s convergence window is expected and self-resolving; a sustained spike indicates a real problem.

### New Failure Modes and Mitigations

| Concern | Analysis | Mitigation |
|---|---|---|
| **What if the proxy body filter has a Lua error?** | HTML is served with unresolved `%%DEFINED_ASSET_PREFIX%%` tokens — broken page. | Standard Lua error handling (`pcall`). Body filter uses `ngx.re.gsub` (not `string.gsub`) for per-app overrides to avoid Lua pattern metacharacter issues with entry names. Test on dev/staging. ALB health checks detect proxy failures. The synthetic token check (see "Production Monitoring") detects unresolved tokens within 60 seconds. |
| **What if the version pointer sync lags?** | For up to ~4 seconds after a deploy, some proxy instances serve the old version. During this window, a user could load HTML from instance A (old base SHA) and then request a lazy chunk from instance B (new base SHA). Because webpack uses `chunkFilename: '[name].entry.js'` (no `[contenthash]`), the chunk filename is the same across releases — the proxy routes it to whichever release the instance knows about. If the content changed between releases, the user gets the wrong chunk content. | This is a strict improvement over the status quo (`s3 sync` creates a much longer mixed-version window). The ~4s convergence window affects only users who navigate to a lazy-loaded route during those exact seconds. Mitigation: `proxy_buffering on` ensures each HTML response is self-consistent; the risk is limited to lazy chunks loaded after initial page render. **Required prerequisite:** Before step 10 of the rollout plan (deploy to production), add `[contenthash]` to `chunkFilename` in the webpack config. This converts silent wrong-code delivery into a visible 404, which is a strictly better failure mode. See rollout plan step 9a. |
| **What if two per-app deploys run simultaneously?** | Each updates only its own app pointer and chunk manifest — no overlap. | GitHub Actions concurrency group prevents concurrent deploys of the *same* app. Different apps can deploy concurrently. |
| **What if a per-app deploy races with the daily full deploy?** | If the full deploy runs second, it clears per-app overrides and sets the base pointer — correct. If the per-app deploy runs second, it sets an override on top of the new base — correct. | `check-deployability.js` already detects and waits on an in-progress daily deploy. |
| **What if the chunk manifest write fails but the pointer updates?** | The pointer is updated without the chunk manifest — lazy chunks for the app fall through to the base SHA, which may not have the correct chunks. | The deploy script verifies the manifest exists in the config bucket after writing it and before updating the pointer. The ordering is enforced with error checking: (1) upload build, (2) write sentinel, (3) write manifest, (4) verify manifest, (5) update pointer. If any step fails, the script exits without advancing. |
| **What if the shared asset exclusion list is incomplete?** | A new shared entry could be included in the chunk manifest, causing the proxy to route it to a per-app release with a different version. | A CI test generates the shared asset list from the webpack config (`entry` keys classified as shared vs. app-specific) and fails if the generated list differs from the hardcoded `SHARED_PATTERN`. This is a required CI gate, not optional. |
| **What about S3 storage from retained releases?** | Each full build ≈200-300 MB. 90 retained releases ≈18-27 GB. Per-app builds are much smaller. | S3 lifecycle rule deletes `releases/` prefixes older than 90 days. Cost: ~$0.03/GB/month in GovCloud — negligible. The 90-day retention window covers all reasonable rollback scenarios. |

### Testing in Lower Environments

#### Environment Topology

The deploy pipeline is a conveyor belt: merges to `main` in both vets-website and content-build trigger immediate deploys to **dev** and **staging** (via `continuous-integration.yml`'s matrix strategy building `vagovdev` and `vagovstaging`). Production deploys only at the daily 1 PM ET deploy (or manual `workflow_dispatch`). The revproxy is deployed independently from the `vsp-platform-revproxy` repo and has per-environment configurations (separate Nginx/Lua configs, separate IAM roles, separate upstream S3 buckets).

| Component | Environment isolation |
|---|---|
| **S3 config bucket** | One per environment: `va-gov-deploy-config-dev`, `va-gov-deploy-config-staging`, `va-gov-deploy-config` (prod). Separate buckets prevent a dev deploy from accidentally writing a prod pointer. |
| **S3 asset bucket** | Already per-env: `dev-va-gov-assets`, `staging-va-gov-assets`, `prod-va-gov-assets`. |
| **Proxy Lua config** | Per-env `asset_bucket` and `content_bucket` variables. Each environment's Lua code points at its own config bucket and asset bucket. |
| **Deploy scripts** | The `DEPLOY_ENV` / `BUILDTYPE` variable selects the correct config bucket and asset buckets. |

#### Critical Ordering Constraint

The content-build token change and the proxy body filter change are in **different repos with independent deploy timelines**, but they must be coordinated:

- **If tokens land before the body filter is deployed:** HTML pages contain `%%DEFINED_ASSET_PREFIX%%` in `<script>` and `<link>` URLs → broken pages. This is a hard outage.
- **If the body filter is deployed before tokens exist:** The body filter's `string.gsub` matches nothing → no-op. Existing absolute S3 URLs pass through unchanged. This is safe.

Therefore: **deploy the proxy body filter first, then merge the content-build token change.** The body filter is a safe no-op until tokens appear.

However, the conveyor belt complicates this. A merge to content-build `main` deploys tokens to dev **and** staging simultaneously. The proxy body filter must be deployed to both dev and staging before the content-build token PR merges. The sequencing is:

```
1. Deploy proxy body filter to dev        ← revproxy repo, independent timeline
2. Deploy proxy body filter to staging     ← revproxy repo, independent timeline
3. Verify body filter is a no-op on both  ← no broken pages, no regressions
4. Merge content-build token PR to main    ← conveyor belt deploys to dev + staging
5. Verify tokens are rewritten on dev      ← first real validation
6. Verify tokens are rewritten on staging  ← second validation
```

If environment-specific phasing is needed (e.g., deploy tokens to dev first, verify, then staging), content-build can gate token emission on the build type:

```js
// Temporary phasing gate — remove after full rollout
const useTokens = ['vagovdev', 'vagovstaging', 'vagovprod'].includes(buildtype);
const prefix = useTokens ? '%%DEFINED_ASSET_PREFIX%%' : bucket;
```

Start with `['vagovdev']`, add `'vagovstaging'` after dev validation, add `'vagovprod'` after staging validation. Remove the gate entirely once all environments are live.

#### Per-Environment Validation Checklist

**Phase 1 — Dev (body filter + tokens):**

| Test | How to verify | Pass criteria |
|---|---|---|
| Body filter rewrites tokens | `curl -s https://dev.va.gov/ \| grep '%%DEFINED_ASSET_PREFIX%%'` | No token strings in response HTML. All `<script>` and `<link>` tags contain `https://dev-va-gov-assets.s3.../releases/{sha}/generated/...` URLs. |
| Entry scripts load from versioned prefix | Browser DevTools → Network tab → verify `vendor.entry.js` loads from `/releases/{sha}/generated/` path | 200 response, correct content |
| Lazy chunks route correctly | Navigate to a lazy-loaded route (e.g., `/my-health/medications`) → verify chunk requests go through proxy and resolve to `/releases/{sha}/generated/` | Chunks load, app renders |
| Version pointer sync across instances | Run `yarn deploy:status` | All instances report same base SHA |
| SHA validation rejects bad input | Manually write a malformed value to the dev config bucket's `versions/base` (e.g., `../../../etc/passwd`) | Proxy rejects it (logs error), continues serving previous valid SHA |
| Sentinel prevents incomplete upload | Upload a partial build (no `.build-complete`), update pointer to its SHA | Sync timer ignores the SHA; proxy continues serving previous version |
| Full deploy on dev | Trigger a full deploy via the conveyor belt (merge to main) | Base pointer updates, pages serve new version within ~4 seconds |
| Per-app deploy on dev | Trigger a single-app build (modify an allowlisted app, merge to main) | App pointer updates, only that app's entry/chunks route to new SHA; other apps unaffected |
| Rollback on dev | Run `rollback.sh` targeting the previous SHA | Base pointer reverts, pages serve previous version within ~4 seconds |
| `deploy:status` tool | Run `yarn deploy:status` and `yarn deploy:status --app medications` | Correct SHA, timestamps, and override info displayed |
| Content-build local dev | Run content-build locally with `yarn build` and preview output | Tokens replaced with `http://localhost:3001`, pages load correctly |
| CI review instances | Open a content-build review instance PR | Tokens replaced with the review instance's asset URL, pages load |
| Workspace-dep app (full build) | Trigger a full build, navigate to an app with workspace deps (e.g., check-in with i18next, or accredited-representative-portal with react-router-dom v6) | App loads correctly. Workspace dependencies are bundled in the app's chunks and served from the versioned release prefix. |

**Phase 2 — Staging (full deploy + per-app CD + rollback):**

| Test | How to verify | Pass criteria |
|---|---|---|
| Full deploy end-to-end | Trigger full build via merge, wait for deploy | Base pointer updates. `deploy:status` shows new SHA. Pages serve new version. TeamSite shared assets synced to non-prefixed paths. |
| Per-app deploy isolation | Deploy a single app, verify other apps still serve base SHA | Only the deployed app's entry/chunks route to the app-specific SHA. `deploy:status --app {name}` shows the override. |
| Per-app rollback | Run per-app `rollback.sh` | App reverts to previous SHA. Other apps unaffected. |
| Full rollback | Run full `rollback.sh` | Base pointer reverts. Per-app overrides cleared. TeamSite assets re-synced from rollback SHA. |
| Rollback to arbitrary SHA | Specify a SHA from history (not just the most recent) | Pointer updates to the specified SHA. Pages serve that version. |
| Concurrent per-app deploys | Deploy two different apps simultaneously | Each updates its own pointer and manifest. No interference. |
| Per-app deploy during full deploy | Queue a per-app deploy while a full deploy is in progress | `check-deployability.js` detects the in-progress full deploy and waits. |
| Deploy ordering failure | Simulate manifest write failure (e.g., revoke config bucket write permission) | Script exits before updating pointer. App continues serving previous version. |
| Convergence window behavior | Deploy and immediately load a lazy-loaded route from a different machine | With `[contenthash]`: mismatched chunk request returns 404 (browser retries on next navigation). Without: silent mismatch possible but window is ~4 seconds. |
| `[contenthash]` chunk filenames | After the webpack config change, verify chunk filenames include content hashes | Build output contains files like `medications.abc123.entry.js`. Chunk routing and manifest generation handle the new names. |
| Workspace-dep app (per-app deploy) | Deploy a workspace-dependent app (e.g., `check-in`) via per-app CD | App's workspace dependencies (i18next, etc.) are inlined in the app's chunks, served from app-specific release prefix. Lazy chunks for the app load correctly. No workspace code leaks into the shared asset list or another app's manifest. |

**Phase 3 — Production (full deploy only, then per-app CD):**

Production testing is covered by rollout plan steps 10-14. The key difference from staging: production has 40+ proxy instances (vs. fewer on dev/staging), so convergence time validation is more important. Run `deploy:status` from multiple machines to verify all instances converge within the expected ~4-second window.

#### Instance Count Considerations

Dev and staging typically run fewer proxy instances than production. The ~4-second convergence window estimated in this ADR is based on the production fleet (40+ instances). On dev/staging with fewer instances, convergence is faster — tests will pass but won't stress the convergence timing at production scale. To validate convergence behavior at scale:

- Monitor the CloudWatch metric for version pointer freshness (max age across all instances) during staging deploys.
- On production rollout (step 10), perform the first deploy during a low-traffic window and verify convergence across all instances before enabling per-app CD.

#### What the Revproxy Per-Environment Config Looks Like

Each environment's Lua config differs only in the bucket URLs and config bucket name. The body filter logic, validation rules, and sync timer are identical across environments. Example diff:

```lua
-- dev
local asset_bucket = "https://dev-va-gov-assets.s3-us-gov-west-1.amazonaws.com"
local config_bucket = "va-gov-deploy-config-dev"

-- staging
local asset_bucket = "https://staging-va-gov-assets.s3-us-gov-west-1.amazonaws.com"
local config_bucket = "va-gov-deploy-config-staging"

-- prod
local asset_bucket = "https://prod-va-gov-assets.s3-us-gov-west-1.amazonaws.com"
local config_bucket = "va-gov-deploy-config"
```

This means the body filter and chunk routing Lua code can be tested on dev with confidence that the same logic applies on staging and prod — only the bucket names change.

### Rollout Plan

1. **Create the S3 config bucket** (`va-gov-deploy-config`) with the security posture documented above (IAM scoping, bucket policy, versioning, CloudTrail, MFA-delete). Create per-environment buckets: `va-gov-deploy-config-dev`, `va-gov-deploy-config-staging`, `va-gov-deploy-config` (prod).
2. **Update content-build** — emit `%%DEFINED_ASSET_PREFIX%%` and `%%CONTENT_ASSET_PREFIX%%` tokens in `process-entry-names.js`. Add local dev fallback for token replacement. Gate token emission on build type initially (`vagovdev` only) to avoid breaking staging before the proxy is ready. *(Can start in parallel with step 1.)*
3. **Deploy the proxy body filter** — Lua body filter module, request rewrite for `/generated/*`, version pointer sync timer with input validation. **Deploy to dev AND staging before merging the content-build token PR** (the body filter is a safe no-op until tokens appear — see "Testing in Lower Environments" above). *(Can start in parallel with step 2.)*
4. **Validate on dev** — enable token emission for `vagovdev`, run the Phase 1 validation checklist (see "Testing in Lower Environments" above). Verify tokens are rewritten correctly, lazy chunks route to correct prefix, version pointer sync works across all instances, SHA validation rejects malformed inputs.
5. **Build the new deploy scripts** — `deploy-release.sh` (upload to prefix + write sentinel + write manifest + verify manifest + update pointer) and `rollback.sh`. Add `deploy:status` CLI command. Add CI test that validates the shared asset exclusion list against the webpack config. *(Can start in parallel with step 4.)*
6. **Add app manifest generation** to the CI archive step (replaces `remove-global-assets.sh`). *(Can start in parallel with step 5.)*
7. **Modify CI workflow** — replace the `remove-global-assets.sh` call with manifest generation; replace `partial-deploy.sh` with the new deploy script.
8. **Enable tokens for staging** — add `vagovstaging` to the content-build gate. **Test full deploy on staging** — run the Phase 2 validation checklist. Verify daily deploy updates base pointer, syncs TeamSite assets, proxy routes correctly.
9. **Test per-app deploy on staging** — verify app pointer update, chunk manifest, rollback, deploy ordering guarantees.
9a. **Add `[contenthash]` to `chunkFilename`** in `config/webpack.config.js` (e.g., `'[name].[contenthash].entry.js'`). This must land before production deployment so that convergence-window chunk mismatches produce a 404 (retriable) instead of silently serving wrong code. Update the chunk routing rewrite and manifest generation to handle content-hashed filenames. Verify on dev and staging that chunk routing handles content-hashed filenames correctly and that content-hashed chunks receive `Cache-Control: public, max-age=31536000, immutable` headers.
9b. **Deploy production monitoring** — set up the three monitors documented in "Production Monitoring" above: unresolved token synthetic check, version pointer convergence staleness alarm, and `/generated/*` 4xx spike detection. Verify alarms fire correctly on staging by simulating each failure mode before proceeding to production.
10. **Deploy proxy body filter to production.** Enable tokens for `vagovprod` in content-build (remove the build-type gate entirely). Perform the first production deploy during a low-traffic window. Run `deploy:status` from multiple machines to verify convergence across all 40+ instances. Verify all three production monitors show green.
11. **Enable per-app CD to production** for a single low-risk app on the allowlist.
12. **Monitor for one week** — verify atomic switching, correct rollback, no stale chunk routing, CloudTrail alerts functioning; confirm all three production monitors (token synthetic, convergence staleness, 4xx spike) remain green with no false positives.
13. **Remove `remove-global-assets.sh`, `partial-deploy.sh`, and `deploy.sh` live-path sync** from the codebase.
14. **Expand per-app CD** to remaining apps on the allowlist.

---

## Consequences

### What We Gain

- **Truly atomic deploys.** Deploy is a pointer update. All requests switch to the new version simultaneously when the proxy picks up the pointer (~4 seconds).
- **Per-app CD to production.** Apps on the allowlist deploy within ~15 minutes of merge.
- **Instant rollback.** Per-app and full rollback are S3 pointer swaps. Takes effect within ~4 seconds.
- **Eliminated fragile build-time coupling.** No more regex-based webpack dependency analysis. No rsync exclusion lists.
- **Auditability.** Every build is retained as an immutable S3 prefix keyed by commit SHA.
- **January 29 class of incident structurally prevented.** Per-app deploys never touch shared assets or live paths.

### What We Give Up

- **S3 storage for retained releases.** ~18-27 GB for 90 retained full builds. Negligible cost (~$0.75/month in GovCloud).
- **Direct-to-S3 simplicity.** HTML is no longer served as-is from S3 — the proxy performs a body filter rewrite. This adds a minimal processing step but is simpler than the current `s3 sync --delete` deploy process it replaces.

### What Requires Coordination

| Change | Owner | Repo | Env ordering |
|---|---|---|---|
| S3 config bucket + IAM policies | Platform SRE | infrastructure | Create all three env buckets first (step 1) |
| Lua body filter + request rewrite + sync timer | Platform SRE | vsp-platform-revproxy | Deploy to dev + staging **before** content-build tokens merge (step 3) |
| Token emission in `process-entry-names.js` | Platform SRE | content-build | Gate by build type: `vagovdev` first, then `vagovstaging`, then `vagovprod` (steps 2→4→8→10) |
| Deploy scripts + CI workflow changes | Platform SRE | vets-website | After body filter + tokens verified on dev (steps 5-7) |

All changes are owned by Platform SRE. The critical ordering constraint: the proxy body filter must be deployed to an environment **before** content-build token emission is enabled for that environment's build type. See "Testing in Lower Environments" for the detailed sequencing. Application teams are not affected.

---

## Alternatives Considered

### 1. Immutable releases with selective file copy (no proxy changes)

Upload each build to `releases/{sha}/`. For per-app deploys, copy only app-specific files from the release prefix to the live S3 paths (identified by a simple shared-asset exclusion list). No proxy or content-build changes required.

**Why not chosen:** Still not atomic — `s3 cp` of individual files creates a window where some files are new and some are old. A user loading a lazy chunk mid-copy could get a stale chunk. Also, rollback requires re-copying files rather than a simple pointer swap. The proxy-based approach achieves true atomicity with the same immutable-prefix foundation, and the additional proxy/content-build work is owned by the same team.

### 2. Re-enable CD with the existing `remove-global-assets.sh` and `partial-deploy.sh`

The existing per-app CD pipeline on dev/staging works. Adding a vendor hash check and a `file-manifest.json` exclusion fix would be sufficient to re-enable it on production with minimal changes.

**Why not chosen:** The underlying architecture is fragile. `remove-global-assets.sh` is tightly coupled to webpack's code generation patterns — a webpack upgrade or config change could silently break the stripping logic. `partial-deploy.sh`'s rsync exclusion list must be manually maintained. Immutable release prefixes eliminate both fragilities and provide rollback capability as a bonus.

### 3. Re-enable CD with full-site builds per merge

Build all ~150 apps on every merge instead of just the affected app.

**Why rejected:** Full-site builds are significantly slower than single-app builds and create unnecessary CI load. The org requires per-app CD.

### 4. CloudFront with origin-path switching

**Why rejected:** CloudFront is [not available in AWS GovCloud](https://docs.aws.amazon.com/govcloud-us/latest/UserGuide/setting-up-cloudfront.html). Our infrastructure runs entirely in `us-gov-west-1`.

### 5. Dual-bucket blue/green with ALB or proxy switching

**Why rejected:** Requires either ASG cycling for each content deploy (too heavy) or a ~10 minute config deploy cycle (too slow for rollback).

### 6. Per-app vendor chunks

Webpack produces a separate vendor chunk per app instead of a global one. Eliminates cross-app vendor conflicts.

**Why rejected:** Duplicates React, Redux, etc. across every app, increasing total bundle size. The immutable release prefix approach achieves the same safety without changing bundle strategy.

### 7. Per-app output directories in webpack

Change webpack to emit each app's files to `generated/apps/{entryName}/` and shared assets to `generated/shared/`. Per-app deploy becomes `aws s3 sync` of one directory.

**Why deferred, not rejected:** Architecturally clean, but requires webpack config changes (`publicPath: 'auto'` or per-entry publicPath), content-build coordination (new file paths in resolved URLs), and careful handling of platform lazy chunks shared across entries. Better suited as part of the content-build unification effort.

### 8. Do nothing; rely on process controls

**Why rejected:** The January 29 incident was an architectural flaw (shared filename, overwrite-in-place deployment), not a process failure. Process controls are fragile. Immutable release prefixes make the unsafe state structurally impossible.

### 9. EFS or shared filesystem instead of S3 polling

Mount an EFS volume across all proxy instances. The deploy script writes version pointers and manifests to a shared directory; proxies read them directly with near-instant convergence and no polling cost.

**Why rejected:** Loses S3's built-in audit trail (versioning + CloudTrail). EFS mount stalls are a shared-state SPOF — a single mount hang or NFS timeout affects all 40+ instances simultaneously, whereas S3 polling degrades gracefully (each instance falls back to its local cached state independently). Requires new infrastructure (VPC mount targets per AZ, security groups, IAM). The convergence improvement (~instant vs ~4 seconds) is not operationally meaningful, and the polling cost ($300-1000/month realistic range) is negligible relative to the EC2 fleet cost.

### 10. Longer poll interval with push-based cache invalidation

Increase the poll interval to 30-60 seconds (reducing S3 request cost from ~$390/month to ~$26/month) and use a push mechanism (e.g., SSM Run Command fan-out by instance tag) to trigger an immediate re-fetch on deploy.

**Why rejected:** Introduces two convergence code paths. The push path (SSM Run Command) delivers in 2-5 seconds on the happy path, but partial delivery failures are silent — instances that miss the push notification wait for the next poll cycle (up to 60 seconds), creating a split-brain window where some proxies serve the old version and others serve the new version behind the same ALB. The current uniform 2-second polling guarantees all instances converge within the same ~4-second window with a single, simple mechanism. The S3 cost savings (~$364/month) do not justify the added complexity (second code path, IAM expansion for SSM:SendCommand, more complex deploy scripts) or the new failure mode (version skew behind ALB on partial push delivery). If polling cost becomes a concern with many sustained per-app overrides, a generation counter approach (poll a single key frequently, full re-fetch only on change) achieves most of the savings without push complexity.

