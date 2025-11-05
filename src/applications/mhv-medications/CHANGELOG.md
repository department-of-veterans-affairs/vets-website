# Changelog: MHV Medications (Sept 30 - Nov 5, 2025)

## Refactoring & Code Quality
- [#120943][issue-120943]: Removed moment.js dependency from medications, improved date handling consistency ([#39617][pr-39617]) (Oct 30)
- [#39285][pr-39285]: Moved pharmacy phone number logic to vets-api, added phone number formatting (Nov 3)
- [#39245][pr-39245]: **RefillAlert → DelayedRefillAlert** - Refactored component naming and structure (Oct 21)
- [#38897][pr-38897]: **RefillNotification refactor** - Improved component structure, added aria-labels, moved constants, created smaller sub-components (Oct 15)

## Accessibility Improvements
- [#118720][issue-118720]: Enhanced screen reader messaging when sorting/filtering medications in list view ([#39121][pr-39121]) (Oct 21)
- [#121180][issue-121180]: Added aria-label to medications filter list for screen reader compatibility and fixed Firefox issues ([#39414][pr-39414]) (Oct 16)
- [#39143][pr-39143]: Fixed h2 not rendering in RefillAlert component (Oct 9)

## PDF & TXT File Enhancements
- [#122091][issue-122091]: Updated medication details PDF and TXT file content with edge case handling ([#39595][pr-39595]) (Oct 27)
- [#38787][pr-38787]: Added partial fill data to generated PDF and TXT files with unit tests (Oct 23)
- [#118661][issue-118661]: Updated print/download dropdown to use filtered list instead of full list ([#39088][pr-39088]) (Oct 9)
- [#118663][issue-118663]: Updated PDF and TXT file content and format, refactored configs, improved recent Rx refill logic ([#39426][pr-39426]) (Oct 20)

## Content & UI Updates
- [#121896][issue-121896]: Refactored status descriptions for pending refills and renewals across PDF, TXT, Print, and Web views ([#39328][pr-39328]) (Oct 22)
- [#119115][issue-119115]: Updated content on details page for "Active: Refill in progress" medications to improve line formatting ([#39059][pr-39059]) (Oct 10)
- [#119376][issue-119376]: Updated small content change for the filter on the Medications list page ([#39122][pr-39122]) (Oct 8)

## Feature Additions
- [#119376][issue-119376]: Created new `NewCernerFacilityAlert` with va-alert-expandable when showNewFacilityAlert toggle is ON and user is associated with an Oracle Health Cerner facility ([#39302][pr-39302]) (Oct 16)

## Bug Fixes & Testing
- [#119106][issue-119106]: Fixed PropType validation error - changed 'hasError' prop from object to boolean in PrintonlyPage ([#38704][pr-38704]) (Oct 7)
- [#39108][pr-39108]: Fixed missing and misspelled data-test-id attributes with E2E test updates (Oct 8)
- [#39223][pr-39223]: Fixed test assertions for accordion updates (Oct 8)
- Fixed unit test for UTC dates after moment.js removal (Oct 30)

## Monitoring & Analytics
- [#39521][pr-39521]: Removed Unique User Metrics from Medications (Oct 23)

## Documentation
- Added FEATURE_TOGGLES.md for mhv-medications (Nov 5)

---

**Total commits**: 22
**Date range**: October 7 - November 5, 2025

<!-- Issue References -->
[issue-120943]: https://github.com/department-of-veterans-affairs/va.gov-team/issues/120943
[issue-118720]: https://github.com/department-of-veterans-affairs/va.gov-team/issues/118720
[issue-121180]: https://github.com/department-of-veterans-affairs/va.gov-team/issues/121180
[issue-122091]: https://github.com/department-of-veterans-affairs/va.gov-team/issues/122091
[issue-118661]: https://github.com/department-of-veterans-affairs/va.gov-team/issues/118661
[issue-118663]: https://github.com/department-of-veterans-affairs/va.gov-team/issues/118663
[issue-121896]: https://github.com/department-of-veterans-affairs/va.gov-team/issues/121896
[issue-119115]: https://github.com/department-of-veterans-affairs/va.gov-team/issues/119115
[issue-119376]: https://github.com/department-of-veterans-affairs/va.gov-team/issues/119376
[issue-119106]: https://github.com/department-of-veterans-affairs/va.gov-team/issues/119106

<!-- PR References -->
[pr-39617]: https://github.com/department-of-veterans-affairs/vets-website/pull/39617
[pr-39285]: https://github.com/department-of-veterans-affairs/vets-website/pull/39285
[pr-39245]: https://github.com/department-of-veterans-affairs/vets-website/pull/39245
[pr-38897]: https://github.com/department-of-veterans-affairs/vets-website/pull/38897
[pr-39121]: https://github.com/department-of-veterans-affairs/vets-website/pull/39121
[pr-39414]: https://github.com/department-of-veterans-affairs/vets-website/pull/39414
[pr-39143]: https://github.com/department-of-veterans-affairs/vets-website/pull/39143
[pr-39595]: https://github.com/department-of-veterans-affairs/vets-website/pull/39595
[pr-38787]: https://github.com/department-of-veterans-affairs/vets-website/pull/38787
[pr-39088]: https://github.com/department-of-veterans-affairs/vets-website/pull/39088
[pr-39426]: https://github.com/department-of-veterans-affairs/vets-website/pull/39426
[pr-39328]: https://github.com/department-of-veterans-affairs/vets-website/pull/39328
[pr-39059]: https://github.com/department-of-veterans-affairs/vets-website/pull/39059
[pr-39122]: https://github.com/department-of-veterans-affairs/vets-website/pull/39122
[pr-39302]: https://github.com/department-of-veterans-affairs/vets-website/pull/39302
[pr-38704]: https://github.com/department-of-veterans-affairs/vets-website/pull/38704
[pr-39108]: https://github.com/department-of-veterans-affairs/vets-website/pull/39108
[pr-39223]: https://github.com/department-of-veterans-affairs/vets-website/pull/39223
[pr-39521]: https://github.com/department-of-veterans-affairs/vets-website/pull/39521
