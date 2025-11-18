# TypeScript Migration Guide for vets-website Applications

This guide provides a step-by-step approach to migrating React applications in the vets-website monorepo from JavaScript to TypeScript, including full unit test support.

## Overview

TypeScript migration for vets-website applications involves converting JavaScript/JSX files to TypeScript/TSX, setting up proper type definitions, and configuring the test environment to support TypeScript transpilation.

## Prerequisites

- Existing React application in `src/applications/[app-name]`
- Understanding of TypeScript basics
- Familiarity with the vets-website build system

## Step-by-Step Migration Process

### 1. Create TypeScript Configuration

Create a `tsconfig.json` file in your application root directory (`src/applications/[your-app-name]/tsconfig.json`):

```json
{
  "extends": "../../../config/base-tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": ["../../../src/*"]
    }
  },
  "include": [
    "**/*",
    "../../../src/platform/**/*"
  ],
  "exclude": [
    "node_modules",
    "tests/**/*.spec.js",
    "tests/**/*.spec.jsx"
  ]
}
```

**Note**: This configuration extends the base TypeScript config and sets up path mapping for the `~/*` import pattern used throughout vets-website.

### 2. Set Up Type Definitions

Create a `types/` directory with application-specific TypeScript interfaces. This is where you'll define the data structures and types specific to your application.

#### Recommended Structure
```
types/
├── index.ts          # Main export file
├── api.ts           # API request/response types
├── common.ts        # Shared utility types
├── domain.ts        # Core business/domain types
├── enums.ts         # Application enums
├── redux.ts         # Redux state and action types
└── ui.ts            # React component prop types
```

#### `types/index.ts` - Main Export File
```typescript
// Type definitions for your application

// Common utility types
export * from './common';

// Core domain types (business entities)
export * from './domain';

// API and data transfer types
export * from './api';

// UI component props and React types
export * from './ui';

// Redux store and state types
export * from './redux';

// Enums for consistent values across the application
export * from './enums';
```

#### `types/domain.ts` - Core Application Types
Define your main application data structures here:
```typescript
// Example: Define your core application data types
export interface AppData {
  id: string;
  // Your specific data structure
}

export interface AppState {
  // Your Redux state structure
}

// Add more domain-specific interfaces as needed
```

### 3. File Conversion Order

Convert files in this recommended order to minimize dependency issues:

1. **Utility functions** (`utils/*.js` → `utils/*.ts`)
2. **Type definitions and constants**
3. **Redux reducers** (`reducers/*.js` → `reducers/*.ts`)
4. **Components** (`components/*.jsx` → `components/*.tsx`)
5. **Containers** (`containers/*.jsx` → `containers/*.tsx`)
6. **App entry point** (`app-entry.jsx` → `app-entry.tsx`)
7. **Router** (`router.jsx` → `router.tsx`)

### 4. Update Configuration Files

#### Update `manifest.json`
In your application's `manifest.json` file, change the entry file reference from `.jsx` to `.tsx`:
```json
{
  "entryName": "your-app-name",
  "entryFile": "./app-entry.tsx",
  "rootUrl": "/your-app-path"
}
```

**Note**: Make sure to update the `entryFile` path to match your actual entry file name.

### 5. Convert Test Files

Update all test files to work with TypeScript imports:

1. **Use explicit `.ts`/`.tsx` extensions in import statements**
2. **Add proper type annotations where beneficial**
3. **Update any test-specific TypeScript issues**

Example test file update:
```javascript
// Before
import { shallow } from 'enzyme';
import Component from '../Component';
import { someUtility } from '../utils';

// After
import { shallow } from 'enzyme';
import Component from '../Component.tsx';
import { someUtility } from '../utils/index.ts';
```

**Important**: You must use explicit file extensions when importing TypeScript files in test environments, even though they're optional in the main application code.

### 6. Common TypeScript Patterns

#### React Component Props
```typescript
interface ComponentProps {
  data: AppData;
  onUpdate: (data: AppData) => void;
  isLoading?: boolean;
}

const Component: React.FC<ComponentProps> = ({ data, onUpdate, isLoading = false }) => {
  // Component implementation
};
```

#### Redux Connected Components
```typescript
interface StateProps {
  data: AppData;
  loading: boolean;
}

interface DispatchProps {
  fetchData: () => void;
}

type Props = StateProps & DispatchProps;

const mapStateToProps = (state: AppState): StateProps => ({
  data: state.app.data,
  loading: state.app.loading
});
```

#### Error Boundaries
```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
}
```

## Testing Your Migration

### Build Verification
```bash
# Build your specific application
yarn build --entry=your-app-name

# Watch for development
yarn watch --env entry=your-app-name
```

### Run Tests
```bash
# Run unit tests for your application
yarn test:unit --app-folder your-app-name

# Run with coverage
yarn test:coverage-app your-app-name
```

### Type Checking
```bash
# Run TypeScript compiler to check types (from your app directory)
npx tsc --noEmit

# Or from the root of vets-website
npx tsc --project src/applications/your-app-name --noEmit
```

## Common Issues and Solutions

### Import Resolution
- **Use explicit file extensions in imports**: `./Component.tsx` (required in test files)
- **Update relative paths** when moving files between directories
- **Declare modules for platform dependencies** to avoid "Cannot find module" errors
- **Use the correct path mapping**: The `~/*` pattern should resolve to `src/*`

### VA Component Types
- **Use the `va-*` components** instead of HTML elements where possible (following vets-website conventions)
- **Reference the design system documentation** for available component props

### Test Configuration
- **TypeScript test support is already configured globally in the monorepo**
- **Update test imports to use correct file extensions** (`.ts`, `.tsx`) - this is the main requirement
- **No need for app-specific Babel or Mocha configuration** - use the global config
- **Run tests from the correct directory** or use the `--app-folder` flag

### External Library Types
- **Some VA platform modules may not have complete type definitions** - this is expected
- **Use module declarations** in `types/declarations/platform.d.ts` to suppress TypeScript errors
- **Don't over-type external dependencies** - basic module declarations are often sufficient

## Benefits of Migration

1. **Type Safety**: Compile-time error detection
2. **Developer Experience**: Better IntelliSense and autocomplete
3. **Refactoring Safety**: Prevents breaking changes
4. **Documentation**: Types serve as living documentation
5. **Team Collaboration**: Clearer interfaces and contracts

## Best Practices

1. **Incremental Migration**: Convert one file type at a time
2. **Start Small**: Begin with utility functions and work up
3. **Proper Typing**: The linter enforces no `any` types - use specific types or `unknown` if absolutely necessary
4. **Test Early**: Run tests frequently during conversion
5. **Document Types**: Add JSDoc comments for complex types

## Troubleshooting

### Build Errors
- Check file extensions in imports
- Verify TypeScript configuration
- Ensure all dependencies are properly declared

### Test Failures
- Verify Babel configuration includes TypeScript preset
- Check that test imports use correct file extensions
- Ensure custom Babel register is configured in Mocha

### Type Errors
- Add module declarations for platform dependencies
- Check that base TypeScript configuration is properly extended
- Verify include/exclude patterns in tsconfig.json

## Migration Checklist

- [ ] Create `tsconfig.json` extending base configuration in `src/applications/[your-app]/`
- [ ] Set up `types/` directory with application-specific interfaces
- [ ] Create your core domain types (`types/domain.ts`)
- [ ] Add API types (`types/api.ts`) and Redux types (`types/redux.ts`) as needed
- [ ] Convert utility functions to TypeScript (`utils/*.js` → `utils/*.ts`)
- [ ] Convert components incrementally (`components/*.jsx` → `components/*.tsx`)
- [ ] Convert containers and higher-order components
- [ ] Convert app entry point (`app-entry.jsx` → `app-entry.tsx`)
- [ ] Update `manifest.json` entry file reference
- [ ] Update all test file imports to use explicit `.ts`/`.tsx` extensions
- [ ] Verify build passes: `yarn build --entry=your-app-name`
- [ ] Verify tests pass: `yarn test:unit --app-folder your-app-name`
- [ ] Run TypeScript type checking: `npx tsc --noEmit`
- [ ] Add module declarations for platform dependencies if needed
- [ ] Improve type safety and specificity where possible

**Estimated Time**: 1-3 days for a typical vets-website application, depending on size and complexity.

This migration pattern has been successfully used to convert applications in the vets-website monorepo with minimal dependencies and maximum compatibility with the existing infrastructure.