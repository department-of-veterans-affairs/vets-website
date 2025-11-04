# Changelog: MHV Medications (Sept 30 - Nov 3, 2025)

## Refactoring & Code Quality
- **#120943**: Removed moment.js dependency from medications, improved date handling consistency (Oct 30)
- **RefillAlert → DelayedRefillAlert**: Refactored component naming and structure (Oct 21)
- **RefillNotification refactor**: Improved component structure, added aria-labels, moved constants, created smaller sub-components (Oct 15) -- aria labels?

## Accessibility Improvements
- **#118720**: Enhanced screen reader messaging when sorting/filtering medications in list view (Oct 21)
- **#121180**: Added aria-label to medications filter list for screen reader compatibility and fixed Firefox issues (Oct 16)
- Fixed h2 not rendering in RefillAlert component (Oct 9)

## PDF & TXT File Enhancements
- **#122091**: Updated medication details PDF and TXT file content with edge case handling (Oct 27)
- **#38787**: Added partial fill data to generated PDF and TXT files with unit tests (Oct 23)
- **#118661**: Updated print/download dropdown to use filtered list instead of full list (Oct 9)
- **#118663**: Updated PDF and TXT file content and format, refactored configs, improved recent Rx refill logic (Oct 20)

## Content & UI Updates
- **#121896**: Refactored status descriptions for pending refills and renewals across PDF, TXT, Print, and Web views (Oct 22)
- **#119115**: Updated content on details page for "Active: Refill in progress" medications to improve line formatting (Oct 10)
- **#119376**: Updated small content change for the filter on the Medications list page (Oct 8)

## Feature Additions
- **#119376**: Created new `NewCernerFacilityAlert` Alert with va-alert-expandable when showNewFacilityAlert toggle is ON and user has transitional facility (Oct 16)

## Bug Fixes & Testing
- **#119106**: Fixed PropType validation error - changed 'hasError' prop from object to boolean in PrintonlyPage (Oct 7)
- Fixed missing and misspelled data-test-id attributes with E2E test updates (Oct 8)
- Fixed test assertions for accordion updates (Oct 8)
- Fixed unit test for UTC dates after moment.js removal (Oct 30)

## Monitoring & Analytics
- Removed Unique User Metrics from Medications (Oct 23)

---

**Total commits**: 19
**Date range**: October 7 - October 30, 2025
