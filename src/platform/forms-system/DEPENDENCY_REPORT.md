# Forms Library Dependency Report

Generated as part of the forms library extraction plan (Phase 1).

## External platform dependencies (forms-system source files)

### platform/utilities

| Import path | Exports used | Consuming files |
|---|---|---|
| platform/utilities/data/get | `get` (default) | ReviewCardField, addressPattern, ssnPattern, arnPattern, addressDeprecatedPattern, useDuplicateChecks, ArrayBuilderItemPage |
| platform/utilities/data/set | `set` (default) | ReviewCardField, addressPattern, addressDeprecatedPattern, useDuplicateChecks, ArrayBuilderCancelButton |
| platform/utilities/data/omit | `omit` (default) | ReviewCardField, addressPattern, addressDeprecatedPattern, createStringifyFormReplacer |
| platform/utilities/data/debounce | `debounce` (default) | VaFileInputMultipleField, VaFileInputField |
| platform/utilities/environment | `environment` (default) | state/helpers, PersonalInformation, addressPattern, VaCheckboxField, activeFormPageContext |
| platform/utilities/storage/localStorage | `localStorage` (default) | actions.js |
| platform/utilities/ui | `isReactComponent`, `displayFileSize`, `formatSSN`, `formatARN` | ReviewCardField, actions.js, VAFileNumberWidget, SSNWidget, SsnField, ArnField |
| platform/utilities/ui/focus | `focusElement`, `focusByOrder`, `defaultFocusSelector`, `waitForRenderThenFocus` | FormPage, ContactInfo/index, minimal-header, ClientError |
| platform/utilities/scroll | `Element`, `scrollTo`, `scrollAndFocus`, `scrollToTop`, `customScrollAndFocus`, `getScrollOptions` | FormPage, ContactInfo, ReviewCollapsibleChapter, ReviewChapters, ArrayField, ClientError |
| platform/utilities/oauth/utilities | `infoTokenExists`, `refresh` | actions.js |
| platform/utilities/react-hooks | `usePrevious` | EditContactInfo |

### platform/monitoring

| Import path | Exports used | Consuming files |
|---|---|---|
| platform/monitoring/record-event | `recordEvent` (default) | ReviewCardField, actions.js, useDuplicateChecks, SubmitController |
| platform/monitoring/Datadog/utilities | `dataDogLogger` | useDuplicateChecks |
| platform/monitoring/DowntimeNotification | `DowntimeNotification` (default), `externalServiceStatus` | ReviewPage |
| platform/monitoring/DowntimeNotification/components/Down | `DowntimeMessage` (default) | ReviewPage |

### platform/user

| Import path | Exports used | Consuming files |
|---|---|---|
| platform/user/selectors | `selectProfile` | PersonalInformation, PersonalInformationReview |
| platform/user/profile/vap-svc/components/AddressField/AddressView | `AddressView` (default) | ContactInfo |
| platform/user/profile/vap-svc/util | `isFieldEmpty` | ContactInfo |
| platform/user/profile/vap-svc/constants | `FIELD_NAMES` | ContactInfo, EditContactInfo |
| platform/user/profile/vap-svc/containers/InitializeVAPServiceID | `InitializeVAPServiceID` (default) | EditContactInfo |
| platform/user/profile/vap-svc/components/ProfileInformationFieldController | `ProfileInformationFieldController` (default) | EditContactInfo |
| platform/user/exportsFile | `refreshProfile`, `sanitizeUrl` | EditContactInfo |

### platform/site-wide

| Import path | Exports used | Consuming files |
|---|---|---|
| platform/site-wide/user-nav/tests/mocks/user | `generateMockUser` | ContactInfo, useContactInfo |

### platform/static-data

| Import path | Exports used | Consuming files |
|---|---|---|
| platform/static-data/labels | `genderLabels` | PersonalInformation, PersonalInformationReview |

## External platform dependencies (forms source files)

### platform/utilities

| Import path | Exports used | Consuming files |
|---|---|---|
| platform/utilities/environment | `environment` (default) | SaveInProgressIntro, RoutedSavableApp, SaveInProgressDevModal |
| platform/utilities/scroll | `Element`, `scrollToTop`, `getScrollOptions`, `scrollTo`, `scrollToFirstError` | RoutedSavableApp, SaveFormLink, RoutedSavableReviewPage, FormSaved, sub-task/index |
| platform/utilities/storage/localStorage | `localStorage` (default) | SaveInProgressDevModal |
| platform/utilities/ui | `isReactComponent` | FormSaveErrorMessage |
| platform/utilities/ui/focus | `waitForRenderThenFocus`, `focusElement` | ErrorMessage, FormSaved, SaveFormLink |

### platform/monitoring

| Import path | Exports used | Consuming files |
|---|---|---|
| platform/monitoring/record-event | `recordEvent` (default) | SaveInProgressIntro, FormStartControls |
| platform/monitoring/DowntimeNotification | `DowntimeNotification` (default), `externalServiceStatus` | SaveInProgressIntro, RoutedSavableReviewPage |

### platform/site-wide

| Import path | Exports used | Consuming files |
|---|---|---|
| platform/site-wide/user-nav/actions | `toggleLoginModal` | SaveInProgressIntro, PreSubmitSection, FormSaveErrorMessage, RoutedSavableReviewPage, RoutedSavablePage |
| platform/site-wide/wizard | `restartShouldRedirect`, `WIZARD_STATUS`, `WIZARD_STATUS_RESTARTING`, `WIZARD_STATUS_COMPLETE` | RoutedSavableApp, FormStartControls, ApplicationStatus |
| platform/site-wide/feature-toggles/selectors | `toggleValues` | selectors/review/index |

### platform/user

| Import path | Exports used | Consuming files |
|---|---|---|
| platform/user/profile/vap-svc/constants/countries.json | `countries` (default) | address/helpers |

### platform/static-data

| Import path | Exports used | Consuming files |
|---|---|---|
| platform/static-data/CallHRC | `CallHRC` (default) | FormSaveErrorMessage |

## Reverse dependencies (platform modules importing FROM forms-system/forms)

These create circular dependency risks and must be addressed before extraction.

### platform/user/profile/vap-svc (14 files)

Imports SchemaForm, web-component-patterns/fields, setData, state helpers, UI utilities from forms-system.

### platform/testing (1 file)

`schemaform-utils.jsx` imports SchemaForm, replaceRefSchemas, updateSchemasAndData.

### platform/shared/itf (3 files)

IntentToFile imports readableList, setItf from forms-system.

### platform/site-wide (4 files, tests only)

Test files import axeCheck and $ from forms-system.

## Deprecated/legacy code

| File | Status | Notes |
|---|---|---|
| web-component-patterns/addressDeprecatedPattern.jsx | DEPRECATED June 2025 | Use addressUI/addressSchema instead |
| web-component-patterns/phonePatterns.jsx | Contains deprecated exports | internationalPhoneDeprecatedUI/Schema |
| actions.js (lines 294, 341) | Legacy code blocks | Delete when legacy file input patterns removed |
| helpers.js (lines 173, 441) | TODO removal | getActiveProperties, filterInactivePageData |
| save-in-progress/savedFormRequest.js | TODO removal | Replace with apiRequest |
