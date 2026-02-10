# Bundle Analysis Findings: Entry Point Cross-Contamination

## Problem Statement

When building `static-pages` entry point in isolation versus building it alongside other entry points, the `static-pages` bundle size differs significantly:

- **Isolated build** (`static-pages` only): `static-pages` bundle is 1.96 MiB
- **Multi-entry build** (`static-pages` + pensions, dashboard, messages, medical-records, hca): `static-pages` bundle is 2.16 MiB (+200 KiB, ~10% larger)
- **Full production build** (all entry points): `static-pages` bundle is 2.41 MiB (+450 KiB, ~23% larger than isolated)

The vendor bundle size remains consistent (666 KiB) across all scenarios, indicating the issue is with application code, not vendor dependencies. This demonstrates that the more entry points included in a build, the larger the `static-pages` bundle becomes, even though `static-pages` itself doesn't directly import the additional code.

## Investigation Methodology

We created analysis scripts to compare bundle contents:

1. **`script/analyze-static-pages-bundle.js`**: Builds both configurations and compares bundle sizes
2. **`script/compare-bundles.js`**: Performs detailed module-level comparison between bundles

These scripts:
- Build `static-pages` in isolation
- Build `static-pages` with other entry points
- Extract and compare module references
- Generate Statoscope reports for detailed analysis
- Identify modules that appear only in one build vs the other

## Key Findings

### Bundle Size Differences

- **Total platform modules in isolated build**: 64 unique modules
- **Total platform modules in multi-entry build**: 141 unique modules
- **Difference**: 77 modules appear only in the multi-entry build

### Modules Only in Multi-Entry Build

The analysis identified 77 modules that are included in `static-pages` when built with other entry points, but not when built in isolation. Key categories include:

#### Platform Monitoring (11 modules)
- `platform/monitoring/DowntimeNotification/actions/index.js`
- `platform/monitoring/DowntimeNotification/components/Down.jsx`
- `platform/monitoring/DowntimeNotification/components/DowntimeApproaching.jsx`
- `platform/monitoring/DowntimeNotification/components/Wrapper.jsx`
- `platform/monitoring/DowntimeNotification/config/externalServiceStatus.js`
- `platform/monitoring/DowntimeNotification/config/externalServices.js`
- `platform/monitoring/DowntimeNotification/index.jsx`
- `platform/monitoring/DowntimeNotification/util/helpers.js`
- `platform/monitoring/exportsFile.js`
- `platform/monitoring/external-services/actions.js`
- `platform/monitoring/external-services/config.js`

#### Platform Startup (2 modules)
- `platform/startup/react.js`
- `platform/startup/store.js`

#### Platform Site-Wide (6 modules)
- `platform/site-wide/drupal-static-data/actions/index.js`
- `platform/site-wide/drupal-static-data/source-files/vamc-ehr/utils.js`
- `platform/site-wide/header/containers/Menu/constants.js`
- `platform/site-wide/index.js`
- `platform/site-wide/layout/actions.js`
- `platform/site-wide/mega-menu/actions/index.js`
- `platform/site-wide/widgetTypes.js`

#### Platform Forms System (34 modules)
- Various `platform/forms-system` modules including web component fields, validation utilities, routing, etc.

#### Other Platform Modules
- Various utility modules, user profile modules, etc.

### Reference Count Changes

When comparing reference counts for key module patterns:

- `platform/site-wide`: 26 → 48 references (+22)
- `platform/monitoring`: 7 → 45 references (+38)
- `platform/startup`: 0 → 4 references (+4)
- `platform/user-nav`: 0 → 0 references (no change)

## Root Cause Analysis

### The Problem

Webpack analyzes **all entry points together** and builds a **single module graph** for the entire build. When multiple entry points are present:

1. Other entry points (pensions, dashboard, messages, medical-records, hca) import `platform/startup`
2. `platform/startup/setup.js` imports `getScheduledDowntime` from `platform/monitoring/DowntimeNotification/actions`
3. `platform/startup` also imports `platform/site-wide`, which has many side-effect imports
4. Even though `static-pages` **does not directly import** `platform/startup`, webpack includes these transitive dependencies in the `static-pages` bundle because they're reachable in the shared module graph

### Why This Happens

Webpack's architecture is designed to:
- Build one module graph for all entry points
- Share common code between entry points (via splitChunks)
- Analyze the full dependency tree across all entry points

This means that code imported by **any** entry point can end up in bundles for **other** entry points, even if those entry points don't directly import it.

### Evidence

The analysis clearly shows that:
- `static-pages` does not import `platform/startup` directly
- `static-pages` does not import `platform/monitoring/DowntimeNotification` directly
- Yet these modules appear in the `static-pages` bundle when other entry points are present
- The vendor bundle size stays consistent, confirming this is application code contamination, not vendor code

## Attempted Solutions

### 1. SplitChunks Configuration Changes

**Attempted:**
- Disabled default cache groups (`default: false`, `defaultVendors: false`)
- Set `minChunks: Infinity` to prevent automatic chunk splitting
- Changed `chunks: 'all'` to `chunks: 'initial'`
- Added various constraints to prevent shared chunk creation

**Result:** No change in bundle sizes. The issue persists because webpack still analyzes all entry points together, regardless of chunk splitting configuration.

### 2. Tree-Shaking Optimizations

**Attempted:**
- Added `usedExports: true`
- Added `providedExports: true`
- Added `concatenateModules: true`
- Added `innerGraph: true`

**Result:** No change in bundle sizes. Tree-shaking helps remove unused exports within modules, but doesn't prevent webpack from including modules that are imported by other entry points.

### 3. SideEffects Configuration

**Attempted:**
- Added `sideEffects` configuration to `src/platform/site-wide/package.json` to mark files with side effects

**Result:** No change in bundle sizes. The `sideEffects` field helps webpack tree-shake unused exports, but doesn't prevent cross-entry-point module inclusion.

## Why These Solutions Didn't Work

All attempted solutions failed because they address **how webpack processes modules**, but not **which modules webpack analyzes**. The fundamental issue is that webpack builds a single module graph for all entry points, so:

- SplitChunks only affects **how** code is split into chunks, not **what** code is included
- Tree-shaking only removes **unused exports** from modules that are already included
- SideEffects only helps webpack identify **which exports** can be removed, not **which modules** can be excluded

## Potential Solutions

### Option 1: Separate Builds

Build entry points separately using webpack's multi-compiler mode or separate build processes.

**Pros:** Complete isolation between entry points
**Cons:** Slower builds, more complex build configuration, potential code duplication

### Option 2: Code Refactoring

Refactor `platform/startup` to avoid importing modules that aren't always needed, or split it into smaller, more focused modules.

**Pros:** Better code organization, solves root cause
**Cons:** Significant refactoring effort, may affect other parts of the codebase

### Option 3: Webpack Configuration

Explore advanced webpack configuration options or plugins that can isolate entry points better.

**Pros:** No code changes required
**Cons:** May not be possible with webpack's architecture, could be complex

## Analysis Scripts

Two scripts were created to facilitate this analysis:

### `script/analyze-static-pages-bundle.js`

Main analysis script that:
- Builds `static-pages` in isolation
- Builds `static-pages` with other entry points
- Compares bundle sizes
- Generates Statoscope reports
- Runs detailed module comparison

**Usage:**
```bash
yarn analyze-static-pages-bundle
```

### `script/compare-bundles.js`

Helper script that:
- Extracts module references from bundle files
- Identifies modules only in one build vs the other
- Focuses on `platform/site-wide` and `platform/monitoring` modules
- Shows reference count differences

**Usage:**
```bash
node script/compare-bundles.js <isolated-bundle-path> <multi-entry-bundle-path>
```

## Next Steps

1. **Choose a solution approach** from the options above
2. **Implement the chosen solution**
3. **Re-run the analysis** to verify the fix
4. **Monitor bundle sizes** to ensure consistency across build configurations

## Conclusion

The investigation has clearly identified that webpack's multi-entry point analysis causes `static-pages` to include code from other entry points, specifically modules imported by `platform/startup` that are used by other entry points. The vendor bundle remains consistent, confirming this is an application code issue. The problem escalates with the number of entry points included in the build: from 1.96 MiB (isolated) to 2.16 MiB (6 entry points) to 2.41 MiB (full production build with all entry points), representing a 23% increase in bundle size. Standard webpack optimizations (splitChunks, tree-shaking, sideEffects) do not solve this problem because they don't address the fundamental issue of webpack's shared module graph analysis.

---

**Date:** February 9, 2026  
**Analysis Scripts:** `script/analyze-static-pages-bundle.js`, `script/compare-bundles.js`
