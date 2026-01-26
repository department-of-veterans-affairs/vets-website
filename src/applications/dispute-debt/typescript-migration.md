# TypeScript Migration - Dispute Debt POC

## Status
This is a proof-of-concept TypeScript conversion for the dispute debt app only. Changes should not affect other apps in the monorepo.

## Key Files & Their Purpose

### `types/component-library-fix.d.ts`
- Provides type definitions for `@department-of-veterans-affairs/component-library`
- Enables IntelliSense/autocomplete in VS Code
- Module declaration override for IDE type checking
- **Important**: Reference this file at the top of components using the library

### `config/webpack.config.js` (Modified)
**Why we changed webpack:**

The component library's `createOverlayComponent.tsx` was causing build failures:
- Both `.d.ts` and `.tsx` files exist in node_modules
- Webpack was reading the `.tsx` file instead of `.d.ts`
- `skipLibCheck: true` only works on `.d.ts` files, so it had no effect

**Solution:**
- Added `transpileOnly: true` to ts-loader
- Skips type checking during webpack build
- Prevents TypeScript from checking `.tsx` files in node_modules
- Type checking still works in IDE and via `tsc` separately

### Type Definition Library (`types/`, `config/globalTypes/`)
These files provide TypeScript definitions for web components and internal libraries without TS support.

**If platform wants to adopt TypeScript:**
- These type definitions can be moved to main `src/` folder
- Shared across all apps
- Web component types are already in `config/globalTypes/web-components.d.ts`

## What Could Break This

❌ **Don't remove `transpileOnly: true` from ts-loader** - builds will fail  
❌ **Don't remove `component-library-fix.d.ts`** - IDE type checking breaks  
❌ **Don't modify webpack config without understanding the above**  

## Questions?
Contact [your name/team] before modifying TypeScript configuration