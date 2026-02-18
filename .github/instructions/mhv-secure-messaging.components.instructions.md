---
applyTo: "src/applications/mhv-secure-messaging/{components,containers}/**"
---

# MHV Secure Messaging — Component Patterns

## React Router + VADS Link Integration

### RouterLink (Standard Internal Navigation)

- Wraps `VaLink` with React Router integration for client-side navigation
- Uses `useHistory` hook + `preventDefault` + `history.push(href)`
- Includes safety fallback to `window.location.href` if used outside Router context
- Located in `components/shared/`
- Props: `href` (required), `text` (required), `active` (optional, default false), `label`, `reverse`
- Supports all `data-*` attributes (`data-testid`, `data-dd-action-name`, `data-dd-privacy`)
- **When to use**: Utility links, navigation in forms, secondary UI — NOT primary CTAs
- Example:
  ```jsx
  <RouterLink
    href="/profile/personal-information#messaging-signature"
    text="Edit signature for all messages"
    data-testid="edit-signature-link"
  />
  ```

### RouterLinkAction (Primary CTA Internal Navigation)

- Wraps `VaLink` with `active={true}` for bold + chevron styling
- **Technical note**: Uses `VaLink active={true}`, NOT `VaLinkAction`, because `VaLinkAction` doesn't expose an `onClick` prop needed for React Router integration
- Props: `href` (required), `text` (required), `label`, `reverse`
- **When to use**: Primary CTAs in alerts, dashboard, high-visibility links
- Example:
  ```jsx
  <RouterLinkAction
    href={Paths.COMPOSE}
    text="Start a new message"
    data-dd-action-name="Start message from alert"
  />
  ```

### Cross-App Links (Different VA.gov SPAs)

Use `VaLink`/`VaLinkAction` directly WITHOUT router wrapper — `router.push()` only works within the same SPA.

Common cross-app destinations:
- `/find-locations` → facility-locator SPA
- `/profile/*` → profile SPA
- `/my-health/medical-records/*` → mhv-medical-records SPA

Example: `<VaLinkAction href="/find-locations" text="Find your VA health facility" />`

### External Links (Non-VA Sites)

Use `VaLink` directly with `external` prop:
```jsx
<VaLink href={getCernerURL('/pages/messaging/inbox')} text="Go to My VA Health" external active />
```

### Decision Tree

```
Is this an internal navigation link?
├─ YES → Is it a primary CTA?
│   ├─ YES → Use RouterLinkAction (bold + chevron)
│   └─ NO  → Use RouterLink (standard styling)
└─ NO → External link
    └─ Use VaLink or VaLinkAction with external prop
```

### Anti-patterns

- ❌ Don't use `<a href>` for internal navigation (breaks client-side routing)
- ❌ Don't use `VaLink`/`VaLinkAction` without router wrapper for same-SPA navigation (full page reload)
- ❌ Don't use `RouterLink`/`RouterLinkAction` for cross-app navigation (router.push only works within same SPA)

## Web Component Event Handling

VA web components use custom events, NOT standard `onChange`:

| Component | Event | Value access |
|---|---|---|
| `va-text-input` | `input` | `e.detail.value` |
| `va-select` / `va-combo-box` | `vaSelect` | `e.detail.value` |
| `va-checkbox` | `vaChange` | `e.detail.checked` |
| `va-radio` | `vaValueChange` | `e.detail.value` |

- Set `error` prop on web components for validation errors
- Use `message-aria-describedby` for accessibility
- Focus first error after validation using `focusOnErrorField()` from `util/formHelpers.js`

### VaRadio Accessibility (WCAG 1.3.1)

When VaRadio label contains both a heading and descriptive text, separate them using `label-header-level` and `hint` props to avoid screen reader verbosity:

```jsx
// ✅ CORRECT
<VaRadio
  label="Select a team you want to message"
  hint="This list only includes teams that you've sent messages to in the last 6 months."
  label-header-level="2"
  required
  onVaValueChange={handleRadioChange}
>
  {options.map(opt => <va-radio-option key={opt.id} label={opt.name} value={opt.id} />)}
</VaRadio>
```

`label-header-level` renders the label as a semantic heading inside the legend; `hint` is announced separately.

### Example: Web Component in JSX

```jsx
<va-text-input
  label="Subject"
  name="subject"
  required
  value={subject}
  error={subjectError}
  onInput={(e) => {
    setSubject(e.detail.value);
    setSubjectError('');
  }}
  message-aria-describedby="subject-description"
  data-dd-privacy="mask"
  data-dd-action-name="message-subject-input"
/>
```

## Stale Closure with Web Component Inputs

**When to use:** Any `useCallback` that reads state derived from VA web component `onInput` events.

VA web components fire `onInput` asynchronously from React's perspective. If a `useCallback` captures state variables set by `onInput`, those values may be stale — React may not have re-rendered yet when the callback executes.

**Pattern:** Read the current value from the DOM element (via ref) or a sync ref, not from React state:
```jsx
const folderNameRef = useRef('');
const folderNameInput = useRef();

// onInput handler keeps ref in sync
onInput={(e) => {
  folderNameRef.current = e.target.value;
  setFolderName(e.target.value);
}}

// useCallback reads from DOM/ref instead of state
const confirmAction = useCallback(async () => {
  const currentName =
    folderNameInput.current?.value ?? folderNameRef.current;
  // ... use currentName, not folderName state
}, [/* omit folderName — read from ref instead */]);
```

**Anti-pattern:**
```jsx
// ❌ BROKEN: await on setState (returns void) creates a microtask boundary
// that splits React batches, and folderName may be stale in the closure
await setNameWarning('');
if (folderName === '') { ... } // folderName is stale!
```

**Why:** `setState` returns `void` — `await` on it creates a pointless microtask boundary that can split React batch updates. Meanwhile, the `folderName` captured by `useCallback` reflects the value at the time of the last render, not the latest `onInput`. Reading from the DOM element or a sync ref guarantees the current value.

## Form Validation

### Compose Form Validation

- Recipient: Required, must be valid (not blocked, still associated)
- Category: Required
- Subject: Required, not blank
- Body: Required, not blank
- Signature (if required): Full name alphabetic only + checkbox checked

### Validation Timing

- On blur for individual fields
- On submit for all fields
- Clear errors when field is corrected

### Error Display Pattern

```javascript
const validateForm = () => {
  let isValid = true;

  if (!recipientId) {
    setRecipientError(ErrorMessages.ComposeForm.RECIPIENT_REQUIRED);
    isValid = false;
  }

  if (!isValid) {
    focusOnErrorField(); // Focus first error
    scrollToTop();       // Scroll to show errors
  }

  return isValid;
};
```

## Container Components (`containers/`)

- Connected to Redux using `useSelector` and `useDispatch`
- Handle routing and page-level logic
- Key containers: `Compose`, `ThreadDetails`, `FolderThreadListView`, `SearchResults`, `MessageReply`
- Pattern: Fetch data in `useEffect`, dispatch actions, pass data to presentational components

## Custom Hooks

| Hook | Purpose |
|---|---|
| `useDebounce` | Debounce value changes for auto-save |
| `useInterval` | Run function at intervals (e.g., session check) |
| `usePreviousUrl` | Track previous URL for navigation |
| `useBeforeUnloadGuard` | Warn before closing window with unsaved changes |
| `useFeatureToggles` | Access feature flags (check `featureTogglesLoading` first) |

## Navigation Guards

- **RouteLeavingGuard**: General purpose — props: `when`, `navigate`, `shouldBlockNavigation`, `modalVisible`, `modalProps`
- **SmRouteNavigationGuard**: SM-specific guard for draft scenarios
- Track unsaved changes via `draftInProgress` fields in state
- Modal types from `ErrorMessages`:
  - `CONT_SAVING_DRAFT`: New draft with changes
  - `CONT_SAVING_DRAFT_CHANGES`: Existing draft with changes
  - `UNABLE_TO_SAVE_DRAFT_ATTACHMENT`: Draft with attachments
  - `UNABLE_TO_SAVE_DRAFT_SIGNATURE`: Draft with signature

## Key Shared Components

| Component | Purpose |
|---|---|
| `BlockedTriageGroupAlert` | Display when recipients are blocked or not associated |
| `EmergencyNote` | Crisis line info — always display above compose/reply forms |
| `HorizontalRule` | Consistent divider component |
| `AttachmentsList` | Render attachments with remove buttons (compose vs view mode) |
| `RouterLink` / `RouterLinkAction` | Internal navigation wrappers (see above) |

## Alert & Modal Patterns

- Use `VaAlert` with `status` prop: 'error', 'success', 'warning', 'info'
- Use `closeable` prop for dismissible alerts
- Focus alert after display for accessibility
- Modals in `components/Modals/` — use `visible` prop, always manage focus on open/close

## Accessibility

- Focus first error after validation failure using `focusOnErrorField()`
- Focus success alert after actions
- Trap focus in modals with `trapFocus()` from MHV exports
- Return focus after modal close
- Use proper heading hierarchy and landmark regions
- Add `aria-label` or `aria-describedby` to all interactive elements
- Use `message-aria-describedby` on web components
- `focusElement()` from platform utilities for programmatic focus management
