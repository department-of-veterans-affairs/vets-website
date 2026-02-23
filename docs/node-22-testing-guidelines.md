# Node 22 Unit Testing Guidelines

This document covers testing patterns and fixes for Node 22 compatibility in vets-website.

## Quick Reference

| Issue | Solution |
|-------|----------|
| Flaky async assertions | Wrap in `await waitFor(() => { ... })` |
| `Response.ok` read-only | Use `mockResponse()` helper or `Object.defineProperty` |
| Sinon `.reset()` undefined | Use `.resetHistory()` or import from `sinon-v20` |
| Timer leaks / cleanup errors | Guard callbacks with `if (document)` checks |
| localhost connection refused | Use `127.0.0.1` instead of `localhost` |
| RTK Query fetch mocking | Use MSW instead of sinon stubs |

---

## 1. Async Test Timing

Node 22's event loop processes microtasks more efficiently, exposing race conditions that were hidden in Node 14.

### Problem
```js
// ❌ Fails intermittently - assertion runs before state updates
fireEvent.click(button);
expect(screen.getByText('Success')).to.exist;
```

### Solution
```js
// ✅ Wait for the DOM to update
fireEvent.click(button);
await waitFor(() => {
  expect(screen.getByText('Success')).to.exist;
});
```

### When to Use `waitFor`
- After any action that triggers async state updates (clicks, form submissions)
- When asserting on content that appears after API calls
- When testing components with `useEffect` or `useState`

### Import
```js
import { waitFor } from '@testing-library/react';
```

---

## 2. Response Object Mocking

In Node 22, `Response.ok` and `Response.url` are read-only getters. Direct assignment throws an error.

### Problem
```js
// ❌ TypeError: Cannot set property ok of #<Response>
const response = new Response(JSON.stringify(data));
response.ok = true;
response.url = 'https://example.com/api';
```

### Solution A: Use Platform Helper
```js
import { mockResponse } from 'platform/testing/unit/helpers';

// ✅ Creates properly configured Response
const response = mockResponse(200, data);
```

### Solution B: Manual Construction
```js
// ✅ Use constructor options + defineProperty
const response = new Response(JSON.stringify(data), {
  status: 200,
  headers: { 'Content-Type': 'application/json' }
});

Object.defineProperty(response, 'url', {
  value: 'https://example.com/api'
});
```

### The `mockResponse` Helper
Located in `src/platform/testing/unit/helpers.js`:
```js
export function mockResponse(status, data) {
  const response = new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
  Object.defineProperty(response, 'url', { value: '' });
  return response;
}
```

---

## 3. Sinon v20 Compatibility

The platform provides `sinon-v20` for tests that need the newer API.

### API Differences
| Operation | Sinon Classic | Sinon v20 |
|-----------|---------------|-----------|
| Reset stub call history | `.reset()` | `.resetHistory()` |
| Check call count | `.callCount` | `.callCount` (same) |
| Verify called | `.called` | `.called` (same) |

### Import Options
```js
// Classic sinon (has .reset() shim for backwards compat)
import sinon from 'sinon';

// Modern sinon v20 (recommended for new tests)
import sinon from 'sinon-v20';
```

### Migration Pattern
```js
// ❌ Old pattern
sandbox.reset();

// ✅ New pattern (works with both versions)
sandbox.resetHistory();
```

---

## 4. Timer and Event Cleanup

Components may unmount before `setTimeout` or `setInterval` callbacks fire, causing errors when accessing destroyed DOM elements.

### Problem
```js
// ❌ Component unmounts, then setTimeout tries to access document
useEffect(() => {
  const timer = setTimeout(() => {
    document.querySelector('.element').focus(); // 💥 Error!
  }, 100);
}, []);
```

### Solution: Guard Callbacks
```js
// ✅ Check that DOM still exists before accessing
useEffect(() => {
  const timer = setTimeout(() => {
    if (document && document.querySelector('.element')) {
      document.querySelector('.element').focus();
    }
  }, 100);
  return () => clearTimeout(timer);
}, []);
```

### In Test Setup (mocha-setup.js handles this globally)
```js
afterAll(() => {
  if (global.window) {
    global.window.close();
  }
});
```

---

## 5. Mocking Fetch: Sinon vs MSW

Choose the right tool based on what you're testing.

### Use Sinon When:
- Testing components that call `fetch()` directly
- Testing custom API utilities
- You need fine-grained control over stub behavior
- Mocking a single endpoint in isolation

```js
import sinon from 'sinon-v20';

beforeEach(() => {
  global.fetch = sinon.stub().resolves(mockResponse(200, { data: 'test' }));
});

afterEach(() => {
  sinon.restore();
});
```

### Use MSW When:
- Testing RTK Query hooks/slices
- Testing components that use Redux Toolkit's `createApi`
- You need realistic network-layer behavior
- Testing multiple related endpoints together

```js
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('/api/endpoint', () => {
    return HttpResponse.json({ data: 'test' });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Why MSW for RTK Query?

RTK Query manages its own fetch lifecycle internally. Sinon stubs intercept at the wrong layer:

```
┌─────────────────────────────────────────────────────┐
│  Component                                          │
│    └─► RTK Query Hook (useGetDataQuery)             │
│          └─► RTK Query internal fetch handling  ◄───┼── Sinon stubs here = ❌
│                └─► Actual fetch() call          ◄───┼── MSW intercepts here = ✅
│                      └─► Network                    │
└─────────────────────────────────────────────────────┘
```

MSW intercepts at the network layer, letting RTK Query's internal logic run naturally.

---

## 6. Test Server URL Configuration

Node 22 prefers IPv6 when resolving `localhost`, which can cause connection failures.

### Problem
```js
// ❌ May resolve to ::1 (IPv6) and fail
cy.visit('http://localhost:3001/my-page');
```

### Solution
```js
// ✅ Explicit IPv4 address
cy.visit('http://127.0.0.1:3001/my-page');
```

### For Consistency
Import from the shared config:
```js
import { TEST_SERVER_BASE_URL } from '@@/config/test-server.config';

// Use in tests
cy.visit(`${TEST_SERVER_BASE_URL}/my-page`);
```

---

## 7. Test Isolation Best Practices

### Clean Up Global State
```js
afterEach(() => {
  // Reset fetch stubs
  if (global.fetch?.restore) {
    global.fetch.restore();
  }
  
  // Clear sinon
  sinon.restore();
  
  // Reset Redux store if applicable
  cleanup();
});
```

### Avoid Shared Mutable State
```js
// ❌ Shared object mutated across tests
const mockData = { count: 0 };

// ✅ Fresh object per test
const getMockData = () => ({ count: 0 });
```

### Use `renderWithStoreAndRouter` for Redux Tests
```js
import { renderWithStoreAndRouter } from 'platform/testing/unit/react-testing-library-helpers';

it('renders with store', () => {
  const { getByText } = renderWithStoreAndRouter(<MyComponent />, {
    initialState: { /* ... */ },
    path: '/current-path',
  });
});
```

---

## 8. Common Patterns Reference

### Waiting for Loading States
```js
// Wait for loading to finish
await waitFor(() => {
  expect(screen.queryByText('Loading...')).to.not.exist;
});

// Then assert on loaded content
expect(screen.getByText('Data loaded')).to.exist;
```

### Testing Form Submissions
```js
const submitButton = screen.getByRole('button', { name: /submit/i });
fireEvent.click(submitButton);

await waitFor(() => {
  expect(screen.getByText('Form submitted successfully')).to.exist;
});
```

### Mocking Date/Time
```js
let clock;

beforeEach(() => {
  clock = sinon.useFakeTimers(new Date('2026-01-24').getTime());
});

afterEach(() => {
  clock.restore();
});
```

### Testing Error States
```js
// Mock API error
server.use(
  http.get('/api/data', () => {
    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
  })
);

await waitFor(() => {
  expect(screen.getByRole('alert')).to.contain.text('Error loading data');
});
```

---

## 9. Debugging Flaky Tests

### Identify Timing Issues
```js
// Temporarily add logging to see execution order
console.log('Before click');
fireEvent.click(button);
console.log('After click, before waitFor');
await waitFor(() => {
  console.log('Inside waitFor');
  expect(screen.getByText('Success')).to.exist;
});
```

### Increase Timeout for Debugging
```js
await waitFor(
  () => {
    expect(screen.getByText('Success')).to.exist;
  },
  { timeout: 5000 } // Increase from default 1000ms
);
```

### Check for Unhandled Promise Rejections
```js
// In test setup
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});
```

---

## Related Documentation

- [Node Upgrade Path](./node-upgrade-path.md) - Overall upgrade strategy
- [Platform Testing Helpers](../src/platform/testing/unit/helpers.js) - Utility functions
- [MSW Documentation](https://mswjs.io/docs/) - Network mocking
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - Component testing
