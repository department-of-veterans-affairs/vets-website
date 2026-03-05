# Forms Library Migration Guide

## Overview

The VA forms library is being extracted from `src/platform/forms-system` into
an independently versioned npm package:
`@department-of-veterans-affairs/va-forms-system`.

This guide explains what changed, how to update your imports, and how the
adapter pattern works.

## What Changed

### Before (direct platform imports)

```js
import get from 'platform/utilities/data/get';
import recordEvent from 'platform/monitoring/record-event';
import { selectProfile } from 'platform/user/selectors';
import environment from 'platform/utilities/environment';
```

### After (adapter-mediated imports)

```js
import {
  get,
  recordEvent,
  selectProfile,
  environment,
} from 'platform/forms-system/src/js/adapter';
```

All external platform dependencies now flow through a single adapter layer.
When the code is extracted to the new package, only the adapter implementation
needs to change -- every consuming file stays the same.

## For Application Developers

### If you import from `platform/forms-system`

No changes required. The public API of forms-system remains the same.
Continue importing from `platform/forms-system` or the package alias
`@department-of-veterans-affairs/platform-forms-system`.

### If you import platform utilities inside custom form components

If your custom form components import directly from `platform/utilities/*`,
`platform/monitoring/*`, etc., those imports are fine -- they are in your
application code, not in the forms library. Only imports *within*
`src/platform/forms-system/` are being routed through the adapter.

## For Forms Library Contributors

### Importing platform code inside forms-system

**Do NOT** add new direct imports from `platform/utilities/*`,
`platform/monitoring/*`, `platform/user/*`, `platform/site-wide/*`, or
`platform/static-data/*` inside `src/platform/forms-system/src/js/`.

Instead, add the export to the appropriate adapter module:

1. Open `src/platform/forms-system/src/js/adapter/utilities.js` (or
   `monitoring.js`, `user.js`, `siteWide.js`, `staticData.js`)
2. Add the re-export
3. Import from `platform/forms-system/src/js/adapter` in your source file

ESLint rules in `.eslintrc.json` will warn if you import directly.

## Adapter Architecture

```
┌─────────────────────────┐
│  forms-system source    │
│  (components, fields,   │
│   patterns, etc.)       │
│                         │
│  imports from adapter   │──► adapter/index.js
│                         │      ├── utilities.js  ──► platform/utilities/*
│                         │      ├── monitoring.js ──► platform/monitoring/*
│                         │      ├── user.js       ──► platform/user/*
│                         │      ├── siteWide.js   ──► platform/site-wide/*
│                         │      └── staticData.js ──► platform/static-data/*
└─────────────────────────┘

After extraction, the adapter modules will be replaced with calls
to getAdapter() which reads from the configured implementation.
```

## Timeline

1. **Current**: Adapter layer in place, ESLint warnings on direct imports
2. **Next**: Package extraction, `yarn link` for local development
3. **Later**: npm publish, vets-website consumes as versioned dependency
