# MSW Adapter Migration Todo List

This document tracks the progress of migrating test files from direct MSW v1 usage to our new backward-compatible MSW adapter. This migration enables tests to work in both Node 14 and Node 22 environments.

## Migration Process

For each test file:

1. Replace imports from `msw` with imports from the adapter:
   ```javascript
   // Before
   import { rest } from 'msw';
   
   // After
   import { createGetHandler, jsonResponse } from 'platform/testing/unit/msw-adapter';
   ```

2. Update request handlers:
   ```javascript
   // Before
   rest.get('/api/endpoint', (req, res, ctx) => {
     return res(ctx.status(200), ctx.json({ data }));
   })
   
   // After
   createGetHandler('/api/endpoint', () => {
     return jsonResponse({ data }, { status: 200 });
   })
   ```

3. Update network error handlers:
   ```javascript
   // Before
   rest.get('/api/endpoint', (req, res) => {
     return res.networkError('Error message');
   })
   
   // After
   createGetHandler('/api/endpoint', () => {
     return networkError('Error message');
   })
   ```

## Files to Update

### Form 686c-674 (Declaration of Dependents)

- [x] src/applications/686c-674/tests/actions/index.unit.spec.jsx
- [x] src/applications/686c-674/tests/config/utilities.unit.spec.jsx
- [x] src/applications/686c-674/tests/containers/introductionPage.unit.spec.jsx

### Ask VA

- [ ] src/applications/ask-va/tests/components/reviewPage/ReviewSectionContent.unit.spec.jsx
- [ ] src/applications/ask-va/tests/containers/DashboardCards.unit.spec.jsx

### Authentication

- [ ] src/applications/auth/tests/AuthApp.unit.spec.jsx

### Claims Status

- [ ] src/applications/claims-status/tests/actions/index.unit.spec.jsx
- [ ] src/applications/claims-status/tests/utils/helpers.unit.spec.jsx

### Disability Benefits

- [ ] src/applications/disability-benefits/all-claims/tests/components/SelectArrayItemsWidget.unit.spec.jsx
- [ ] src/applications/disability-benefits/all-claims/tests/content/ancillaryFormsWizardSummary.unit.spec.jsx
- [ ] src/applications/disability-benefits/all-claims/tests/pages/ancillaryFormsWizardSummary.unit.spec.jsx
- [ ] src/applications/disability-benefits/view-payments/tests/components/view-payments-lists/view-payments-lists.unit.spec.jsx

### Facility Locator

- [ ] src/applications/facility-locator/tests/api-url-parameters.latLongOnly.unit.spec.jsx
- [ ] src/applications/facility-locator/tests/api-url-parameters.railsEngine.unit.spec.jsx

### Pensions

- [ ] src/applications/pensions/tests/unit/NoFormPage.unit.spec.jsx

### Personalization

- [ ] src/applications/personalization/appointments/actions/index.unit.spec.jsx
- [ ] src/applications/personalization/dashboard/tests/components/benefit-applications/ApplicationsInProgress.unit.spec.jsx
- [ ] src/applications/personalization/dashboard/tests/components/RenderClaimsWidgetDowntimeNotification.unit.spec.jsx
- [ ] src/applications/personalization/profile/tests/actions/directDeposit.unit.spec.jsx
- [ ] src/applications/personalization/profile/tests/components/contact-information/ContactInformation.delete-address.unit.spec.jsx
- [ ] src/applications/personalization/profile/tests/components/contact-information/ContactInformation.delete-email-address.unit.spec.jsx
- [ ] src/applications/personalization/profile/tests/components/contact-information/ContactInformation.delete-telephone.unit.spec.jsx
- [ ] src/applications/personalization/profile/tests/components/contact-information/ContactInformation.edit-email-address.unit.spec.jsx
- [ ] src/applications/personalization/profile/tests/components/contact-information/ContactInformation.edit-telephone.unit.spec.jsx
- [ ] src/applications/personalization/profile/tests/components/contact-information/ContactInformation.update-address.unit.spec.jsx
- [ ] src/applications/personalization/profile/tests/ducks/communicationPreferences.unit.spec.jsx
- [ ] src/applications/personalization/profile/tests/hooks/useDirectDeposit/useDirectDeposit.unit.spec.jsx

### Rated Disabilities

- [ ] src/applications/rated-disabilities/tests/containers/AppContent.unit.spec.jsx

### Representative Search

- [ ] src/applications/representative-search/tests/api-url-parameters.railsEngine.unit.spec.jsx

### Sign-In Changes

- [ ] src/applications/sign-in-changes/tests/InterstitialChanges.unit.spec.jsx

### Static Pages

- [ ] src/applications/static-pages/download-1095b/components/App/index.unit.spec.jsx

### Terms of Use

- [ ] src/applications/terms-of-use/tests/MyVAHealth.unit.spec.jsx
- [ ] src/applications/terms-of-use/tests/TermsOfUse.unit.spec.jsx

## Migration Progress

- Total files to update: 33
- Files updated: 3
- Progress: 9%

Last updated: May 13, 2025