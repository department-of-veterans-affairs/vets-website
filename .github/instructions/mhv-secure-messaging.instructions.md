---
applyTo: "src/applications/mhv-secure-messaging/**"
---

# MHV Secure Messaging — Core Instructions

## Self-Maintenance

**CRITICAL**: When you make fundamental changes to the mhv-secure-messaging application, update the relevant instruction file:

| File | Scope |
|---|---|
| `mhv-secure-messaging.instructions.md` | Business logic, constants, helpers, API, architecture |
| `mhv-secure-messaging.components.instructions.md` | Component patterns, hooks, accessibility, links |
| `mhv-secure-messaging.unit-tests.instructions.md` | Unit test patterns, sinon, RTL, fixtures |
| `mhv-secure-messaging.cypress.instructions.md` | E2E test patterns, page objects, Cypress helpers |
| `mhv-secure-messaging.redux.instructions.md` | State shape, actions, reducers, selectors |

## Application Overview

- **Entry Name**: `mhv-secure-messaging`
- **Root URL**: `/my-health/secure-messages`
- **Entry File**: `app-entry.jsx`
- **Purpose**: Secure messaging between veterans and VA healthcare teams

## Architecture

### Redux Structure

- **Root reducer**: Combined reducer at `reducers/index.js` under `sm` namespace
- **Reducer modules**: `alerts`, `recipients`, `breadcrumbs`, `categories`, `facilities`, `folders`, `search`, `threads`, `threadDetails`, `triageTeams`, `preferences`, `prescription`
- **Action types**: Centralized in `util/actionTypes.js` under `Actions` object with nested namespaces (e.g., `Actions.Message.GET`, `Actions.Draft.CREATE_DRAFT`)
- **Selectors**: Defined in `selectors.js` (e.g., `folder`, `selectSignature`, `populatedDraft`)
- **State access pattern**: Always use `state.sm.<reducer>` to access secure messaging state

### API Layer

- **Backend Service**: API services provided by **vets-api**
  - Backend controller: `SMController` — [source](https://github.com/department-of-veterans-affairs/vets-api/blob/master/modules/my_health/app/controllers/my_health/sm_controller.rb)
  - vets-api passes through to the MHV SM Patient API: https://github.com/department-of-veterans-affairs/mhv-sm-patient-api
- **API client**: `api/SmApi.js` for secure messaging endpoints
- **Base path**: `${environment.API_URL}/my_health/v1`
- **Mock responses**: `api/mocks/`, configured via `src/platform/mhv/api/mocks/index.js`
- **Patterns**: All API functions return promises; use async/await in action creators with try/catch

## Constants & Configuration (`util/constants.js`)

- **Paths**: Route paths in `Paths` object — always use these instead of hardcoded strings
- **DefaultFolders**: Folder IDs (Inbox=0, Sent=-1, Drafts=-2, Trash=-3); negative for system, positive for custom
- **ErrorMessages**: Structured by component (e.g., `ErrorMessages.ComposeForm.RECIPIENT_REQUIRED`, `ErrorMessages.Navigation.*`, `ErrorMessages.ComposeForm.ATTACHMENTS.*`)
- **Categories**: Message categories (Appointments, Medications, Test Results, etc.)
- **Alerts**: Organized by domain (`Alerts.Message`, `Alerts.Folder`, `Alerts.Thread`); use for success/error feedback
- **ElectronicSignatureBox**: Title, description, labels, legal note text
- **threadSortingOptions**: Sorting configs with label, sortField, sortOrder
- **draftAutoSaveTimeout**: 10000ms — never hardcode timeout values
- **Attachment limits**:
  - `MAX_FILE_SIZE`: 6MB / `MAX_FILE_SIZE_LARGE`: 25MB
  - `MAX_FILE_COUNT`: 4 / `MAX_FILE_COUNT_LARGE`: 10
  - `TOTAL_MAX_FILE_SIZE`: 10MB / `TOTAL_MAX_FILE_SIZE_LARGE`: 25MB
- **acceptedFileTypes** / **acceptedFileTypesExtended**: Allowed file MIME types
- **RecipientStatus**: `BLOCKED`, `ALLOWED`, `NOT_ASSOCIATED`
- **Errors.Code**: `BLOCKED_USER: 'SM119'`, `ATTACHMENT_SCAN_FAIL: 'SM172'`, etc.
- **RxRenewalText**: `LOCKED_CATEGORY_DISPLAY` ("Medication renewal request")
- **MessageHintText**: `RX_RENEWAL_SUCCESS`, `RX_RENEWAL_ERROR`

## Helper Functions (`util/helpers.js`)

- **Date**: `dateFormat(timestamp, format)`, `threadsDateFormat(timestamp, format)` — always use for consistent date display
- **Navigation**: `navigateToFolderByFolderId(folderId, history)`, `folderPathByFolderId(folderId)`
- **Messages**: `isOlderThan(timestamp, days)`, `getLastSentMessage(messages)`, `decodeHtmlEntities(str)` (**CRITICAL** — always decode before display)
- **Recipients**: `sortRecipients(recipientsList)`, `messageSignatureFormatter()`
- **URLs**: `httpRegex`, `urlRegex`
- **Threads**: `updateMessageInThread(thread, response)` — preserves fields not in response
- **Pages**: `handleHeader(folder)`, `getPageTitle({ folderName, pathname })`

## Business Logic & Requirements

### 45-Day Reply Restriction
- **Rule**: Users cannot reply to messages where the last sent message is more than 45 days old
- **Implementation**:
  - Use `isOlderThan(lastSentDate, 45)` to check eligibility
  - `getLastSentMessage()` finds the most recent sent message in thread
  - Set `cannotReply` flag in thread state when retrieving threads
  - Display `Alerts.Message.STALE_REPLY_BODY` when restriction applies
  - Different messaging for VistA vs OH (Oracle Health) messages
- **UI Impact**:
  - Reply button disabled or hidden
  - Info alert displayed explaining restriction
  - Directs users to start new message or contact facility

### Electronic Signature Requirements

- Some recipients require electronic signatures (Privacy Issue, Release of Information, Medical Records teams)
- Detection regex in `actions/recipients.js`:
  ```javascript
  /.*[\s_]*(Privacy Issue|Privacy Issues|Release of Information Medical Records|Record Amendment)[\s_]*Admin|.*[\s_]*Release[\s_]*of[\s_]*Information/i
  ```
- `signatureRequired` flag on recipient; show/hide `ElectronicSignature` component dynamically
- Validation: alphabetic-only full name + checkbox; use `validateNameSymbols()` from `platform/forms-system`
- Signature format: `\n--------------------------------------------------\n\n[Full Name]\nSigned electronically on [Date].`
- **CRITICAL**: Signatures cannot be saved in drafts — show warning modal, strip before save

### Draft Auto-Save Logic

- Debounced after `draftAutoSaveTimeout` (10s) via `useDebounce` hook
- Save actions: `createDraft()`, `updateDraft()`, `createReplyDraft()`, `updateReplyDraft()` in SmApi
- Track via `draftInProgress` in `threadDetails` reducer; `savedDraft` flag for indicator; `saveError` for failures
- **CRITICAL**: Cannot save attachments or signatures in drafts — show warning modals
- Must decode HTML entities before saving: `decodeHtmlEntities(messageData.body)`
- Navigation guards detect unsaved changes and show save/delete/continue modals

### Attachment Handling

- **Types**: Standard (DOC, DOCX, GIF, JPG, PDF, PNG, RTF, TXT, XLS, XLSX, etc.) + extended with feature flag (BMP, TIFF, PPT, MP4, MOV, etc.)
- **Size**: Individual 6MB/25MB, total 10MB/25MB (based on feature flag); empty files rejected
- **Duplicate detection**: Check name + size
- **Virus scanning**: Backend scans after upload; error code `SM172` = scan failure; user must remove flagged files
- **CRITICAL**: Attachments NOT saved with drafts — show `ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT` modal

### Recipient Management

- **Status types**: `ALLOWED`, `BLOCKED` (SM119, SM151), `NOT_ASSOCIATED` (SM129)
- **Blocked**: Show `BlockedTriageGroupAlert` with `BlockedTriageAlertStyles` (INFO, WARNING, ALERT)
- **Recent recipients**: Last 6 months from Sent folder via `getRecentRecipients()`
- **Contact list**: Curated via `updateTriageTeamRecipients()`; min 1 team required
- **Sorting**: Always use `sortRecipients()` to alphabetize
- **System association**: Resolve facility via `getVamcSystemNameFromVhaId()` from drupal static data

### Folder Operations

- **System folders**: Inbox (0), Sent (-1), Drafts (-2), Trash (-3) — cannot rename/delete
- **Custom folders**: Not blank, letters/numbers/spaces only, unique name; delete only if empty
- **Moving messages**: `moveMessageThread(threadId, folderId)` → refresh list → show success alert
- **Navigation**: Always use `folderPathByFolderId()` / `navigateToFolderByFolderId()`

### Message Thread Behavior

- Array of messages with same `threadId`; can contain sent messages and drafts
- Loading: `retrieveMessageThread(messageId)` → decode HTML entities, set `cannotReply`, determine `replyToName`
- Reply drafts: Multiple per thread, each with unique `messageId`; use `createReplyDraft()`/`updateReplyDraft()`
- Key metadata: `messageId`, `threadId`, `folderId`, `sentDate`/`draftDate`, `body` (must decode), `hasAttachments`, `readReceipt`

### Search Functionality

- Basic (keyword) or advanced (keyword + folder + date range + sender/recipient)
- Validation: at least one field, start ≤ end date, end not future
- Results in thread list format with pagination (10/page); use `runBasicSearch()`/`runAdvancedSearch()`

### RX Renewal / Medication Integration

- Entry: `/my-health/secure-messages/new-message?prescriptionId={id}&redirectPath={path}`
- Detection: `renewalPrescription?.prescriptionId || rxError`
- State: `prescription` reducer (`{ renewalPrescription, redirectPath, error, isLoading }`)
- **Fetch API**: `api/RxApi.js` — `GET /my_health/v1/prescriptions/{prescriptionId}`
- **Send API**: `api/SmApi.js` — `createRenewalMessage()` → `POST /my_health/v1/messaging/messages/renewal`
  - `prescription_id` sent as a **top-level field** in the message payload (not embedded in body)
  - `sendMessage` action routes to `createRenewalMessage` when 4th arg `isRxRenewal` is `true`
  - 5th arg `suppressSuccessAlert` controls whether the success alert is dispatched — `true` suppresses it, `false` shows it
  - ComposeForm passes `!!(isRxRenewalDraft && redirectPath)` as the 5th arg, so the alert is only suppressed when both a renewal AND a redirect path are present
  - vets-api Faraday camelcase middleware transforms `prescription_id` → `prescriptionId` for upstream MHV API
- Category locked to "Medications" via `LockedCategoryDisplay` component
- Body auto-populated via `buildRxRenewalMessageBody(prescription)` from `util/helpers.js`
- Errors: 404 → allow manual entry; non-VA meds → warning; log to Datadog
- After send with `redirectPath`: redirect to `redirectPath` with `?rxRenewalMessageSuccess=true` (success alert suppressed — the destination page shows its own confirmation)
- After send without `redirectPath`: standard success alert is displayed (no redirect)
- **Note**: `prescriptionId` is NOT saved in drafts — it remains in Redux state from the initial navigation URL param

## MHV Platform Integration

- **Utilities** (`@department-of-veterans-affairs/mhv/exports`): `updatePageTitle()`, `addUserProperties()`, `renderMHVDowntime()`, `openCrisisModal()`, `trapFocus()`
- **Downtime**: `DowntimeNotification` from `platform-monitoring` with `downtimeNotificationParams`

## Feature Flags

- Import names from `src/platform/utilities/feature-toggles/featureFlagNames.json`
- Hook: `useFeatureToggles()` from `hooks/useFeatureToggles.js`; check `featureTogglesLoading` first
- Common flags: `customFoldersRedesignEnabled`, `readReceiptsEnabled`, `mhvSecureMessagingRecentRecipients`, `smLargeAttachmentsEnabled`, `smExtendedAttachmentTypes`

## Analytics & Monitoring

### Datadog RUM

- `datadogRum.addAction(actionName, context)` / `datadogRum.addError(error, context)`
- Config in `App.jsx` via `useDatadogRum()` and `setDatadogRumUser()`
- **CRITICAL PII/PHI**: All fields with potential PII/PHI MUST use `data-dd-privacy="mask"` and `data-dd-action-name`
  - Applies to: subject, body, recipient names, signatures, attachment file names, any user content
  - When in doubt, mask it

### Google Analytics

- `recordEvent({ event: 'secure-messaging-*', ... })` from `platform/monitoring/record-event`

## Error Handling

### Error Codes

| Code | Meaning |
|---|---|
| SM119, SM151 | User blocked from messaging recipient |
| SM129 | User no longer associated with triage group |
| SM172 | Attachment failed virus scan |
| 503 | Service outage |
| 404 | Message/thread not found |

### Backend error structure

```javascript
{ errors: [{ code: 'SM119', status: '403', detail: '...', title: 'Forbidden' }] }
```

Check specific codes in catch blocks; show appropriate alerts via `addAlert()`.

## Import Patterns

### Platform

- **API**: `apiRequest` from `@department-of-veterans-affairs/platform-utilities/exports`
- **UI**: `focusElement`, `scrollToTop`, `scrollTo` from `platform-utilities/ui`
- **Forms**: `validateNameSymbols` from `platform/forms-system/src/js/web-component-patterns`
- **Monitoring**: `recordEvent` from `platform/monitoring/record-event`
- **Drupal data**: `getVamcSystemNameFromVhaId`, `selectEhrDataByVhaId` from `platform/site-wide/drupal-static-data`

### Component Library

- React bindings: `VaTextInput`, `VaButton`, `VaAlert`, etc. from `@department-of-veterans-affairs/component-library/dist/react-bindings`

### Local Modules

```javascript
import { sendMessage, sendReply } from '../actions/messages';
import { Paths, Alerts, ErrorMessages, DefaultFolders } from '../util/constants';
import { dateFormat, decodeHtmlEntities, sortRecipients } from '../util/helpers';
```

## Common Anti-patterns

- ❌ Hardcode paths — use `Paths` constants
- ❌ Hardcode error messages — use `ErrorMessages` or `Alerts`
- ❌ Hardcode timeout values — use `draftAutoSaveTimeout`
- ❌ Display message body without `decodeHtmlEntities()`
- ❌ Save attachments or signatures in drafts
- ❌ Access Redux state without `state.sm.` prefix
- ❌ Use `onChange` on VA web components — use proper custom events
- ❌ Allow replies without checking 45-day rule
- ❌ Skip error handling in async actions
- ❌ Forget `setThreadRefetchRequired(true)` after state-changing operations
- ❌ Use dot notation for snake_case API keys — ESLint camelCase rule blocks `messageData.draft_id`

### Bracket Notation for snake_case API Payload Keys

vets-api expects snake_case keys (`draft_id`, `recipient_id`, `prescription_id`) but ESLint enforces camelCase. The codebase uses template-literal bracket notation to bypass the rule:

```javascript
// ✅ CORRECT — bypasses ESLint camelCase
messageData[`${'draft_id'}`] = draft?.messageId;
messageData[`${'recipient_id'}`] = draftInProgress.recipientId;
messageData[`${'prescription_id'}`] = rxPrescriptionId.toString();
```

```javascript
// ❌ WRONG — ESLint camelCase violation
messageData.draft_id = draft?.messageId;
messageData['draft_id'] = draft?.messageId; // Also flagged
```

Follow this pattern for any new snake_case key added to message payloads.

## Thread List Refresh Pattern

When an action modifies thread/message state (read status, send, delete, move), dispatch `setThreadRefetchRequired(true)` to trigger a refetch in `FolderThreadListView`.

```javascript
import { setThreadRefetchRequired } from './threads';

export const myAction = (param) => async dispatch => {
  const response = await apiCall(param);
  if (!response.errors) {
    dispatch({ type: Actions.MyFeature.SUCCESS, response });
    dispatch(setThreadRefetchRequired(true)); // Trigger list refresh
  }
};
```

Use after: `markMessageAsReadInThread`, `sendMessage`/`sendReply`, `deleteMessage`, `moveMessageThread`, `saveDraft`/`deleteDraft`
