# TypeScript Best Practices

## Quick Start

**New files**: Use `.tsx` for React components, `.ts` for utilities

**Existing files**: Convert to TS when making substantial changes (not for minor fixes)

## Using the Component Library (JSX)

Add this at the top of files using component library components:
```typescript
/// <reference path="../types/component-library-fix.d.ts" />
import { VaCheckboxGroup } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
```

## Component Patterns

### Props
```typescript
interface MyComponentProps extends React.PropsWithChildren {
  title: string;
  count: number;
  optional?: string;
}

export const MyComponent = ({ title, count, children }: MyComponentProps) => {
  // ...
};
```

### Redux Selectors
```typescript
import type { DisputeDebtState } from '../types/state';

const userData = useSelector((state: DisputeDebtState) => state.user.profile);
```

### API Responses
```typescript
interface DebtResponse {
  id: string;
  amount: number;
  status: 'active' | 'paid' | 'pending';
}

const fetchDebt = async (id: string): Promise<DebtResponse> => {
  const response = await api.get(`/debts/${id}`);
  return response.data;
};
```

## Adding VA Web Components

Add new web components to `config/globalTypes/web-components.d.ts`:
```typescript
declare namespace JSX {
  interface IntrinsicElements {
    // For input-based components
    'va-text-input': WebComponentInput<{
      label?: string;
      'error-message'?: string;
    }>;

    // For other components
    'va-alert': WebComponent<{
      status?: 'info' | 'warning' | 'error';
    }>;
  }
}
```

## Common Issues

**"Cannot find module" for images/styles**:
```typescript
// Add to types/declarations.d.ts
declare module '*.scss';
declare module '*.png';
declare module '*.svg';
```

**Provider type errors in tests**:
```typescript
// @ts-expect-error - react-redux Provider has React type version mismatch
<Provider store={mockStore as any}>
```

## When to Use `any`

✅ External JS components you don't control  
✅ Complex legacy JS code  
❌ Your own new code  
❌ Data models and interfaces  

## Anti-Patterns
```typescript
// ❌ Don't use React.FC
const MyComponent: React.FC<Props> = (props) => { ... };

// ✅ Use explicit props
const MyComponent = (props: Props) => { ... };

// ❌ Don't use any in your code
const process = (data: any) => { ... };

// ✅ Define interfaces
const process = (data: MyData) => { ... };
```