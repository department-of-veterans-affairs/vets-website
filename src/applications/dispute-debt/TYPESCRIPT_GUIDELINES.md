# TypeScript/TSX Best Practices for Gradual Migration

## Context
Our app is being converted to TypeScript while the rest of the monorepo and component library remain in JavaScript/JSX. This guide covers best practices for working in this mixed environment.

## File Naming
- **New components**: Always use `.tsx` for React components
- **New utilities**: Always use `.ts` for non-React code
- **Existing files**: Convert to TS/TSX when making substantial changes (not just minor fixes)

## Working with JavaScript Components

### Component Library (JSX)
Our component library is still in JSX. We have a type fix file (`types/component-library-fix.d.ts`) that resolves React type conflicts between the component library and main React types. This file handles the ReactPortal compatibility issue.

**Using Component Library Components**:
```typescript
/// <reference path="../types/component-library-fix.d.ts" />
import React from 'react';
import { VaCheckboxGroup } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const MyComponent = () => {
  return <VaCheckboxGroup options={[]} />;
};
```

**Important**: 
- Reference the type fix at the top of files that use component library components: `/// <reference path="../types/component-library-fix.d.ts" />`
- Library components are typed but props may not have full type checking. This is an acceptable tradeoff until the library is converted
- See `types/component-library-fix.d.ts` for the actual implementation and explanation of the ReactPortal compatibility fix

### Importing JS Components
TypeScript can import JS/JSX files without issues:
```typescript
// ✅ This works fine
import { SomeJSComponent } from '../../legacy/SomeComponent';

const MyComponent = () => {
  return <SomeJSComponent prop="value" />;
};
```

### Type-Only Imports
Use `import type` for type-only imports to improve build performance:
```typescript
// ✅ Good - type-only import
import type { DisputeDebtState } from '../types/state';
import type { AppLocation } from '../../../../config/globalTypes/router-types.d';

// ✅ Good - value import (for runtime)
import { fetchDebts } from '../actions';

// ✅ Good - mixed (types and values)
import React, { useEffect } from 'react';
import type { ComponentProps } from 'react';
```

## Type Safety Priorities

### What IS Type-Safe (Focus Here)
- ✅ Your new TS/TSX components
- ✅ Props between your TS components
- ✅ State management (Redux, hooks)
- ✅ API responses and data models
- ✅ Utility functions and business logic
- ✅ Data transformations

### What ISN'T Type-Safe (Acceptable)
- ❌ Props on JS component library components
- ❌ Legacy JS utility imports
- ❌ Third-party JS libraries without @types

## Common Patterns

### Typing Component Props
```typescript
interface MyComponentProps extends React.PropsWithChildren {
  title: string;
  count: number;
  onSubmit: (data: FormData) => void;
  optional?: string;
}

// Prefer extending PropsWithChildren when component accepts children
export const MyComponent = ({ 
  title, 
  count, 
  onSubmit,
  optional,
  children 
}: MyComponentProps) => {
  // ...
};
```

**Note**: We use `React.PropsWithChildren` instead of `React.FC` for better type inference and to avoid the implicit `children` prop that `React.FC` adds.

### Typing Redux Selectors
```typescript
import type { DisputeDebtState } from '../types/state';

// Use the app-specific state type, not a generic RootState
const selectUserData = (state: DisputeDebtState) => state.user.profile;

// In component
const userData = useSelector(selectUserData);
// userData is now fully typed!

// For app-specific state
const { isDebtPending } = useSelector(
  (state: DisputeDebtState) => state.availableDebts
);
```

**Note**: We use `DisputeDebtState` which is a `Pick` type that selects only the state properties we actually use. See `types/state.d.ts` for the full state type definitions.

### State Type Architecture
Our state typing uses a layered approach:
```typescript
// types/state.d.ts

// 1. Complete global state (extends platform GlobalState)
export interface DisputeDebtGlobalState extends GlobalState {
  form: FormState;
  availableDebts: AvailableDebtsState;
  // ... other app-specific state
}

// 2. App-specific state (only what we use)
export type DisputeDebtState = Pick<
  DisputeDebtGlobalState,
  | 'form'
  | 'availableDebts'
  | 'user'
  | 'scheduledDowntime'
>;
```

This pattern:
- ✅ Only types state properties we actually access
- ✅ Extends platform GlobalState for shared types
- ✅ Uses `Pick` to create a minimal, focused state type
- ✅ Makes it clear what state the app depends on

### Typing API Responses
```typescript
interface DebtResponse {
  id: string;
  amount: number;
  dueDate: string;
  status: 'active' | 'paid' | 'pending';
}

const fetchDebt = async (id: string): Promise<DebtResponse> => {
  const response = await api.get(`/debts/${id}`);
  return response.data;
};
```

### Handling Unknown JS Return Types
```typescript
// When importing from JS files
import { legacyFunction } from './legacy.js';

// Add explicit type
const result: ExpectedType = legacyFunction() as ExpectedType;

// Or validate at runtime
const result = legacyFunction();
if (isValidType(result)) {
  // Now safely typed
}
```

## Using `any` Appropriately

### When `any` is OK
- External JS components you don't control
- Complex legacy JS code that's hard to type
- Temporary solution while refactoring
```typescript
// ✅ Reasonable use
declare module '@external-library' {
  export const ComplexComponent: any;
}
```

### When to Avoid `any`
- Your own new code
- Frequently used functions
- Data models and interfaces
```typescript
// ❌ Bad
const processData = (data: any) => { ... };

// ✅ Good
interface ProcessedData {
  id: string;
  value: number;
}

const processData = (data: RawData): ProcessedData => { ... };
```

## Type Declarations

### Creating Custom Type Declarations
Place in `types/` directory:
```typescript
// types/custom-module.d.ts
declare module 'some-untyped-package' {
  export function doSomething(arg: string): void;
}
```

### When to Create Type Declarations
- **DO**: For packages you use heavily
- **DO**: When types improve developer experience significantly
- **DON'T**: For rarely used components
- **DON'T**: When types would be complex/unmaintainable

## Common Issues

### "Cannot find module" errors
```typescript
// Add to types/declarations.d.ts
declare module '*.scss';
declare module '*.png';
declare module '*.svg';
```

### "Implicit any" errors
Enable in `tsconfig.json` to catch these early:
```json
{
  "compilerOptions": {
    "noImplicitAny": true
  }
}
```

### React component type issues
```typescript
// Prefer this (with PropsWithChildren for children support)
interface Props extends React.PropsWithChildren {
  title: string;
}
const MyComponent = ({ title, children }: Props) => { ... };

// Or without children
interface Props {
  title: string;
}
const MyComponent = ({ title }: Props) => { ... };

// Avoid React.FC - it has issues with type inference and adds implicit children
```

## Testing TypeScript Components
```typescript
import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import MyComponent from './MyComponent';
import { createMockStore, createMockLocation } from '../helpers/test-helpers';

describe('MyComponent', () => {
  it('renders with typed props', () => {
    const mockStore = createMockStore();
    const { container } = render(
      // @ts-expect-error - react-redux Provider has React type version mismatch
      <Provider store={mockStore as any}>
        <MyComponent title="Test" count={5} onSubmit={() => {}} />
      </Provider>
    );
    expect(container).to.exist;
  });
});
```

**Note**: 
- We use `chai` for assertions (not Jest's `expect`)
- Use `createMockStore()` and `createMockLocation()` from `tests/helpers/test-helpers.ts` for consistent test setup
- The `@ts-expect-error` for Provider is acceptable due to React type version mismatches in the test environment

## Migration Strategy

### Phase 1: New Files Only (Current)
- All new components in TS/TSX
- New utilities in TS
- Don't block on converting old code

### Phase 2: Convert as You Touch
- Converting a component? Make it TS/TSX
- Refactoring utilities? Add types
- Not a blocker for small fixes

### Phase 3: Systematic Conversion (Future)
- Convert component library
- Add types to shared utilities
- Full type coverage

## Configuration

### TSConfig Settings
Our `tsconfig.json` extends `config/base-tsconfig.json` and includes:
```json
{
  "extends": "../../../config/base-tsconfig.json",
  "compilerOptions": {
    "allowJs": true,           // Allow importing JS
    "checkJs": false,          // Don't type-check JS files
    "jsx": "react",
    "strict": true,            // Strict mode for TS files
    "noImplicitAny": true,     // Catch untyped code
    "skipLibCheck": true,      // Skip checking node_modules
    "esModuleInterop": true,
    "typeRoots": ["./types", "../../../node_modules/@types"],
    "baseUrl": "../../../src",
    "paths": {
      "platform/*": ["platform/*"],
      "~/*": ["*"],
      "@config/*": ["../../../config/*"]
    }
  },
  "include": [
    "**/*",
    "../../../config/globalTypes/web-components.d.ts",
    "../../../config/globalTypes/global-state.d.ts",
    "../../../config/globalTypes/router-types.d.ts",
    "types/**/*"
  ]
}
```

**Important**: 
- The `typeRoots` includes both local `./types` and root `node_modules/@types` to find type definitions
- Global types are included from `config/globalTypes/` for platform-wide type definitions
- Path aliases allow importing from `platform/*`, `~/*`, and `@config/*`

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) - Community type definitions

## Questions?

- Check existing TS/TSX files for patterns
- Ask in #frontend-typescript Slack channel
- When in doubt, prefer explicit types over `any`

## Anti-Patterns to Avoid
```typescript
// ❌ Don't create fake types for JS components with wrong prop types
declare module '@component-library' {
  export const Button: React.FC<{
    // These might be wrong and cause confusion
    label: string;
    size: 'small' | 'large';
  }>;
}

// ✅ Do use proper type fixes (see component-library-fix.d.ts)
// Or use any for simple cases where you don't need type checking
declare module '@component-library' {
  export const Button: any;
}

// ❌ Don't use any in your own code
const MyComponent = (props: any) => { ... };

// ✅ Do define proper interfaces
interface MyComponentProps extends React.PropsWithChildren {
  title: string;
}
const MyComponent = ({ title, children }: MyComponentProps) => { ... };

// ❌ Don't use React.FC - it has type inference issues
const MyComponent: React.FC<Props> = (props) => { ... };

// ✅ Do use explicit function declarations
const MyComponent = (props: Props) => { ... };
```

## Success Metrics

We're successfully using TypeScript when:
- New code is fully typed
- Type errors catch real bugs before runtime
- Developer experience improves (autocomplete, refactoring)
- Not spending excessive time on type gymnastics