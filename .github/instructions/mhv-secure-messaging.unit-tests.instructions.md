---
applyTo: "src/applications/mhv-secure-messaging/tests/{actions,components,containers,hooks,reducers,util}/**"
---

# MHV Secure Messaging — Unit Test Patterns

## Test Utilities (`util/testUtils.js`)

**CRITICAL**: Use these helpers for all web component interactions in tests — web components use shadow DOM and custom events that standard RTL methods don't handle.

| Helper | Purpose |
|---|---|
| `inputVaTextInput(container, value, selector)` | Set value on `va-text-input` and dispatch `input` event |
| `selectVaSelect(container, value, selector)` | Trigger `vaSelect` event on `va-select` |
| `comboBoxVaSelect(container, value, selector)` | Handle `va-combo-box` selection |
| `checkVaCheckbox(checkboxGroup, bool)` | Toggle `va-checkbox` |
| `getProps(element)` | Get React props from element |

## Rendering Components

Use `renderWithStoreAndRouter` from platform testing:

```javascript
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

renderWithStoreAndRouter(<Component />, {
  initialState: { sm: { /* state */ } },
  reducers: reducer,
  path: '/messages',
});
```

## Store Setup

Create Redux store with combined reducers. Must include `commonReducer` for feature flags:

```javascript
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { commonReducer } from 'platform/startup/store';

const store = createStore(
  combineReducers({ ...reducer, commonReducer }),
  initialState,
  applyMiddleware(thunk),
);
```

## Mocking & Stubbing with Sinon

### Sandbox Pattern (Recommended)

```javascript
import sinon from 'sinon';

describe('MyComponent', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore(); // Automatically restores all stubs/spies
  });

  it('tests something', () => {
    const mySpy = sandbox.spy(myModule, 'myFunction');
    const myStub = sandbox.stub(myModule, 'otherFunction').returns('value');
    // ...
  });
});
```

### API Mocking

```javascript
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';

mockApiRequest(responseData);           // Success
mockApiRequest({}, false);              // Error
mockApiRequest({ method: 'POST', data: {}, status: 200 }); // Custom
```

### Common Stub Targets

- `sandbox.stub(SmApi, 'getFolder').resolves(mockData)` — API functions
- `sandbox.stub(useFeatureToggles, 'default').returns({ ... })` — feature flags
- `sandbox.spy(datadogRum, 'addAction')` — Datadog tracking
- `sandbox.stub(window, 'print')` — browser APIs
- `sandbox.spy(history, 'push')` — router navigation

### CRITICAL: Always Restore Stubs

- Use sandbox pattern for automatic restoration
- If using manual stubs, restore in `afterEach()`: `myStub.restore()`
- Check before restoring: `if (stub && stub.restore) stub.restore()`

## Assertions

- Use chai `expect()` for assertions
- Mocha for test structure (`describe`, `it`, `beforeEach`, `afterEach`)
- Sinon spy assertions: `expect(spy.calledOnce).to.be.true`, `expect(spy.calledWith(args)).to.be.true`
- Attribute assertions: `expect(element).to.have.attribute('error', 'Error message')`

## Fixtures

- Located in `tests/fixtures/` directory
- JSON files for mock API responses
- Import pattern: `import mockData from '../fixtures/data.json'`

## Testing with Feature Flags

Set feature flags in test store's initial state:

```javascript
const initialState = {
  featureToggles: {
    customFoldersRedesignEnabled: true,
  },
  sm: { /* ... */ },
};
```

Include `commonReducer` in combined reducers (it holds feature toggle state).

## Testing RouterLink / RouterLinkAction

Validate navigation by checking `history.location.pathname` after click:

```javascript
const { container, history } = renderWithStoreAndRouter(
  <RouterLink href="/inbox" text="Go to inbox" />,
  { initialState, reducers: reducer, path: '/messages' }
);
const link = container.querySelector('va-link');
link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
expect(history.location.pathname).to.equal('/inbox');
```

## File Naming Convention

- Unit tests: `ComponentName.unit.spec.jsx` or `helperName.unit.spec.js`
- Place tests in mirrored directory structure under `tests/`
