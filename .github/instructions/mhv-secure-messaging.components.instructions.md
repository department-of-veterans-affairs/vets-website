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
| `useFocusSettle` | Delay content until page focus is stable (1s debounce + 5s ceiling). Internal to `SmAlert` — consumers should not need to use directly. |
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
| `SmAlert` | **App-standard alert wrapper** — drop-in replacement for `VaAlert` with built-in `useFocusSettle` for reliable screen-reader announcements. Use `SmAlert` for all alerts in secure messaging; `VaAlert` is only used internally by `SmAlert`. Pass `srMessage` prop with the text to announce. |
| `BlockedTriageGroupAlert` | Display when recipients are blocked or not associated |
| `EmergencyNote` | Crisis line info — always display above compose/reply forms |
| `HorizontalRule` | Consistent divider component |
| `AttachmentsList` | Render attachments with remove buttons (compose vs view mode) |
| `RouterLink` / `RouterLinkAction` | Internal navigation wrappers (see above) |
| `DismissibleAlert` | Server-persisted dismissible tooltip alert (uses tooltip Redux slice + API) |

### DismissibleAlert (Tooltip Pattern)

`DismissibleAlert` wraps `VaAlert` with server-persisted dismiss state. Once a user closes it, the backend records it as hidden so it won't reappear.

- **Location**: `components/shared/DismissibleAlert.jsx`
- **Redux**: Uses `state.sm.tooltip` (`tooltipVisible`, `tooltipId`)
- **API**: `getTooltipsList`, `createTooltip`, `incrementTooltipCounter`, `hideTooltip` from `SmApi.js`
- **Lifecycle**: On mount, fetches or creates a tooltip by name → sets visibility → increments view counter. On close, calls `hideTooltip` API → sets `tooltipVisible: false`.
- **Accessibility**: Always includes `closeBtnAriaLabel="Close notification"` (consistent with other closeable alerts)
- **Datadog**: Uses `data-dd-privacy="mask"` and `data-dd-action-name` (includes `tooltipId`)

```jsx
<DismissibleAlert
  tooltipName="my_feature_tooltip"
  status="info"
  headline="New feature available"
>
  <p>Descriptive content here.</p>
</DismissibleAlert>
```

**When to use**: One-time or limited-display informational banners that should persist dismiss state across sessions.
**Do NOT**: Build ad-hoc dismissible alerts with local state — always use this component for server-persisted dismissals.

## Alert & Modal Patterns

- Use `SmAlert` (not `VaAlert` directly) for all alerts in secure messaging — it wraps `VaAlert` with built-in focus-settle screen-reader announcement via `useFocusSettle`
- Pass `srMessage` prop with the text to announce to screen readers; pass `''` or omit to silence
- Use `status` prop: 'error', 'success', 'warning', 'info'
- Use `closeable` prop for dismissible alerts
- Focus alert after display for accessibility (error alerts only — see Focus Restriction below)
- Modals in `components/Modals/` — use `visible` prop, always manage focus on open/close

**Why SmAlert exists (VaAlert limitation):** VaAlert's `visible` prop triggers a complete DOM swap — when `visible=false`, VaAlert renders a `<div aria-live="polite"></div>` placeholder; when `visible=true`, that div is destroyed and replaced with the full alert DOM tree (which has no `aria-live`). Because the live region is removed during the transition, screen readers never detect the content change and skip the announcement entirely. SmAlert works around this by managing its own persistent `aria-live="polite"` span inside the alert.

**Anti-pattern:**
```jsx
// ❌ Don't use VaAlert directly — use SmAlert to get focus-settle announcements
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
<VaAlert status="success">...</VaAlert>

// ✅ Use SmAlert with srMessage
import SmAlert from '../shared/SmAlert';
<SmAlert status="success" srMessage="Folder renamed successfully">...</SmAlert>
```

### AlertBackgroundBox & Alert Positioning Pattern

The `AlertBackgroundBox` component (`components/shared/AlertBackgroundBox.jsx`) displays success, error, and warning alerts throughout the application. **CRITICAL**: Alerts must always appear **below** the page H1 heading, never above.

- **Accessibility Requirements**:
  - **WCAG SC 1.3.2 (Meaningful Sequence)**: Content order must be programmatically determinable
  - **WCAG SC 2.4.3 (Focus Order)**: Focus order preserves meaning and operability
  - **WCAG SC 4.1.3 (Status Messages)**: Status messages announced by AT without receiving focus
  - **MHV Decision Records**: Focus should be set to H1 on page load

- **Implementation Pattern**:
  - Use conditional role based on alert type:
    - `role="status"` for success and warning alerts (non-interruptive)
    - `role="alert"` for error alerts (interruptive, higher priority)
  - Always focus H1 on page load, not the alert
  - For dismissible alerts, move focus back to H1 after alert is dismissed

- **Direct Import Pattern**: Components that contain an H1 (ComposeForm, ReplyForm, FolderHeader, MessageThreadHeader) import and render `AlertBackgroundBox` directly after their H1:
  ```jsx
  import AlertBackgroundBox from '../shared/AlertBackgroundBox';

  const ComposeForm = (props) => {
    return (
      <>
        <h1 className="page-title">{pageTitle}</h1>
        <AlertBackgroundBox
          closeable
          className="vads-u-margin-y--1 va-alert"
        />
        {/* ... rest of form */}
      </>
    );
  };
  ```

- **Error State Handling**: When page data fails to load (e.g., 503 error), the H1 may not exist. Render AlertBackgroundBox at the top of the content area for error visibility:
  ```jsx
  {folder === null ? (
    <AlertBackgroundBox closeable />  {/* Error state: no H1 */}
  ) : (
    folderId === undefined && <LoadingIndicator />
  )}
  {folderId !== undefined && (
    <>
      <FolderHeader folder={folder} />  {/* Contains H1 */}
      {content}
    </>
  )}
  ```

- **Focus Management**: Always focus H1, never the alert:
  ```jsx
  // ✅ CORRECT: Always focus H1, let role="status" announce alert
  useEffect(() => {
    if (folder !== undefined) {
      focusElement(document.querySelector('h1'));
    }
  }, [alertList, folder]);

  // ❌ WRONG: Conditional focus on alert
  useEffect(() => {
    const alertVisible = alertList[alertList?.length - 1];
    const selector = alertVisible?.isActive ? 'va-alert' : 'h1';
    focusElement(document.querySelector(selector));
  }, [alertList, folder]);
  ```

## Accessibility

- Focus first error after validation failure using `focusOnErrorField()`
- Trap focus in modals with `trapFocus()` from MHV exports
- Return focus after modal close
- Use proper heading hierarchy and landmark regions
- Add `aria-label` or `aria-describedby` to all interactive elements
- Use `message-aria-describedby` on web components
- `focusElement()` from platform utilities for programmatic focus management

### Delayed sr-only aria-live Announcement

**When to use:** An `aria-live="polite"` region needs to announce alert content but page focus is still settling (e.g., heading receives focus on load). VoiceOver reads the focused element first — injecting polite live-region content simultaneously causes it to be skipped or to interrupt the current announcement.

**Implementation:** This pattern is encapsulated in `useFocusSettle` (hook) and `SmAlert` (component). **Do not re-implement this logic inline** — use `SmAlert` with the `srMessage` prop instead. The hook and component handle:
- `useLayoutEffect` + `focusin` listener for debounced focus detection
- 1s debounce timer reset on each focus change
- 5s hard ceiling to guarantee announcement
- `timerSourceRef` to prevent duplicate announces
- DOM text mutation (clear → RAF → set) for reliable screen-reader detection

```jsx
// ✅ Just use SmAlert — focus-settle is built in
<SmAlert status="success" srMessage="Folder renamed successfully">
  <p>Folder renamed successfully</p>
</SmAlert>
```

**Why `useLayoutEffect` (inside useFocusSettle):** Fires before paint, guaranteeing the `focusin` listener is registered before the browser delivers focus events. `useEffect` has a timing gap.

**Anti-pattern:**
```jsx
// ❌ Don't implement focus-settle inline — use SmAlert
const [srContent, setSrContent] = useState('');
useLayoutEffect(() => { /* manual focusin logic */ }, [content]);

// ❌ Don't use useEffect — focusin may fire before the listener is registered
useEffect(() => { document.addEventListener('focusin', handler); }, []);
```

**Why:** Discovered via VoiceOver testing (ticket #133563). Screen readers skip polite announcements when focus moves to a different element at the same time.

### Focus Restriction for Non-Error Alerts

**When to use:** A component uses `focusElement()` to move focus to an alert on load (e.g., via `onVa-component-did-load`), but VoiceOver is already reading other content.

**Pattern:** Gate `focusElement()` calls to error alerts only. For success/info/warning alerts, let the delayed sr-only span handle the announcement instead.

```jsx
const handleAlertFocus = useCallback(() => {
  if (activeAlert?.alertType !== 'error') return;
  setTimeout(() => { focusElement(alertRef.current); }, 500);
}, [activeAlert?.alertType, props.focus]);
```

**Anti-pattern:**
```jsx
// ❌ Don't steal focus for all alert types — interrupts VoiceOver mid-announcement
const handleAlertFocus = useCallback(() => {
  setTimeout(() => { focusElement(alertRef.current); }, 500);
}, [props.focus]);
```

**Why:** The 500ms focus-steal for success alerts interrupts VoiceOver while it reads the page heading, causing the alert text to be skipped entirely.
