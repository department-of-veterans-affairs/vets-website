---
applyTo: "src/applications/mhv-secure-messaging/{actions,reducers}/**"
---

# MHV Secure Messaging — Redux Patterns

## Redux State Shape

```javascript
state.sm = {
  alerts: { /* alert objects */ },
  recipients: {
    allowedRecipients: [],
    blockedRecipients: [],
    noAssociations: false,
    allTriageGroupsBlocked: false,
    associatedBlockedTriageGroupsQty: 0,
    blockedFacilities: [],
  },
  breadcrumbs: { /* breadcrumb array */ },
  categories: { /* category list */ },
  facilities: { /* facility data */ },
  folders: {
    folder: null,
    folderList: [],
  },
  search: {
    query: {},
    results: [],
    page: 1,
    sort: {},
  },
  threads: {
    threadList: [],
    page: 1,
    sort: {},
    refetchRequired: false,
  },
  threadDetails: {
    messages: [],
    drafts: [],
    cannotReply: false,
    replyToName: '',
    threadFolderId: null,
    draftInProgress: {
      messageId: null,
      recipientId: null,
      category: null,
      subject: '',
      body: '',
      savedDraft: false,
      saveError: null,
      navigationError: null,
    },
  },
  triageTeams: { /* triage team data */ },
  preferences: {
    signature: {},
  },
  prescription: {
    renewalPrescription: null,
    prescriptionId: null,
    redirectPath: null,
    error: null,
    isLoading: false,
  },
}
```

## Common Data Object Shapes

### Message Object

```javascript
{
  messageId: number,
  threadId: number,
  folderId: number,
  category: string,
  subject: string,
  body: string,           // Must be decoded with decodeHtmlEntities()
  sentDate: string | null, // ISO 8601
  draftDate: string | null,
  senderId: number,
  senderName: string,
  recipientId: number,
  recipientName: string,
  triageGroupName: string,
  readReceipt: string | null,
  hasAttachments: boolean,
  attachments: [{ id, name, size, link }],
}
```

### Recipient Object

```javascript
{
  id: number,
  name: string,
  stationNumber: string,
  preferredTeam: boolean,
  relationshipType: string,
  signatureRequired: boolean, // Set by regex check
  healthCareSystemName: string,
  status: 'ALLOWED' | 'BLOCKED' | 'NOT_ASSOCIATED',
}
```

## Action Types

Centralized in `util/actionTypes.js` under `Actions` object with nested namespaces:

```javascript
Actions.Message.GET
Actions.Message.SEND
Actions.Draft.CREATE_DRAFT
Actions.Draft.UPDATE_DRAFT
Actions.Folder.GET_LIST
Actions.Thread.GET
Actions.Prescriptions.GET_PRESCRIPTION_BY_ID
```

## Action Creator Pattern

Async thunk pattern with try/catch and specific error code handling:

```javascript
export const myAction = (param) => async dispatch => {
  try {
    dispatch({ type: Actions.MyFeature.REQUEST });
    const response = await myApiCall(param);

    dispatch({ type: Actions.MyFeature.SUCCESS, response });
  } catch (e) {
    dispatch({ type: Actions.MyFeature.ERROR });

    // Check for specific error codes
    if (e.errors && e.errors[0].code === 'SM119') {
      dispatch(addAlert(ALERT_TYPE_ERROR, '', Alerts.Message.BLOCKED_MESSAGE_ERROR));
    } else if (e.errors && e.errors[0].code === 'SM172') {
      dispatch(addAlert(ALERT_TYPE_ERROR, Alerts.Headers.HIDE_ALERT, Alerts.Message.ATTACHMENT_SCAN_FAIL));
    } else {
      dispatch(addAlert(ALERT_TYPE_ERROR, '', Alerts.Message.SEND_MESSAGE_ERROR));
    }
    throw e;
  }
};
```

## URL Param Fallback Pattern

When an async action fetches data based on a URL parameter and the component needs the raw param even if the fetch fails (e.g., 404), store the raw value in Redux **before** the API call:

```javascript
export const getPrescriptionById = prescriptionId => async dispatch => {
  dispatch({ type: Actions.Prescriptions.CLEAR_PRESCRIPTION });
  // Store raw ID immediately — survives 404/error
  dispatch({
    type: Actions.Prescriptions.SET_PRESCRIPTION_ID,
    payload: prescriptionId,
  });
  try {
    dispatch({ type: Actions.Prescriptions.IS_LOADING });
    const response = await apiGetPrescriptionById(prescriptionId);
    // ... handle success
  } catch (e) {
    // Error handler — prescriptionId is still in state
  }
};
```

In the component, use nullish coalescing to fall back to the raw value:
```javascript
const rxPrescriptionId =
  renewalPrescription?.prescriptionId ?? rawPrescriptionId;
```

**Why:** `CLEAR_PRESCRIPTION` resets state to `initialState`. `SET_PRESCRIPTION_ID` runs immediately after, writing the raw URL param. If the API returns 404, `renewalPrescription` stays `undefined` but `prescriptionId` is preserved. This is how `ComposeForm.send()` ensures `prescription_id` is always included in the renewal payload, even when the prescription data fetch fails.

## Common Actions

| Action | Purpose |
|---|---|
| `retrieveMessageThread(messageId)` | Fetch thread with full details |
| `sendMessage(message, attachments, ohTriageGroup, isRxRenewal)` | Send new message (when `isRxRenewal` is true, routes to `createRenewalMessage` API) |
| `sendReply({ replyToId, message, attachments })` | Send reply |
| `saveDraft(messageData, type, id)` | Save/update draft (type: 'manual' or 'auto') |
| `deleteDraft(messageId)` | Delete draft permanently |
| `moveMessageThread(threadId, folderId)` | Move thread to folder |
| `deleteMessage(threadId)` | Move thread to trash |

## Thread List Refresh Pattern

When an action modifies thread/message state, dispatch `setThreadRefetchRequired(true)`:

```javascript
import { setThreadRefetchRequired } from './threads';

export const myAction = (param) => async dispatch => {
  const response = await apiCall(param);
  if (!response.errors) {
    dispatch({ type: Actions.MyFeature.SUCCESS, response });
    dispatch(setThreadRefetchRequired(true)); // CRITICAL: Trigger list refresh
  }
};
```

**Use after**: `markMessageAsReadInThread`, `sendMessage`/`sendReply`, `deleteMessage`, `moveMessageThread`, `saveDraft`/`deleteDraft`

**Common bug**: Stale thread list — user performs action, returns to inbox, changes not reflected. Cause: missing `setThreadRefetchRequired(true)` dispatch.

## Selectors

Key selectors from `selectors.js`:

| Selector | Returns |
|---|---|
| `folder` | Current folder object |
| `selectSignature` | User signature preferences |
| `populatedDraft` | Draft with populated fields |

## Breadcrumb Management

```javascript
import { setBreadcrumbs } from '../actions/breadcrumbs';

dispatch(setBreadcrumbs([
  Breadcrumbs.MYHEALTH,
  Breadcrumbs.INBOX,
  { href: '#', label: 'Current Page' }
]));
```

Mobile vs desktop rendering handled by `BreadcrumbViews` constant.

## Alert Dispatch Patterns

```javascript
import { addAlert, closeAlert } from '../actions/alerts';

// Add alert
dispatch(addAlert(ALERT_TYPE_SUCCESS, '', Alerts.Message.MOVE_MESSAGE_THREAD_SUCCESS));

// Types: ALERT_TYPE_ERROR, ALERT_TYPE_SUCCESS, ALERT_TYPE_WARNING, ALERT_TYPE_INFO
// Header can be '' or Alerts.Headers.HIDE_ALERT to hide header
// Content should use constants from Alerts or ErrorMessages
```

## HTML Entity Handling in Actions

**CRITICAL**: Always decode HTML entities when processing API responses:

```javascript
const messages = response.data.map(m => ({
  ...m.attributes,
  body: decodeHtmlEntities(m.attributes.body),
}));
```
