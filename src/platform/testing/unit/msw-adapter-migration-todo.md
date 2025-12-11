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
   createGetHandler(
     '/api/endpoint',
     () => jsonResponse({ data }, { status: 200 }),
   )
   ```

3. Update network error handlers:
   ```javascript
   // Before
   rest.get('/api/endpoint', (req, res) => {
     return res.networkError('Error message');
   })
   
   // After
   createGetHandler(
     '/api/endpoint',
     () => jsonResponse({ error: 'Error message' }, { status: 503 }),
   )
   ```

## Files to Update

### Form 686c-674 (Declaration of Dependents)

- [x] src/applications/686c-674/tests/actions/index.unit.spec.jsx
- [x] src/applications/686c-674/tests/config/utilities.unit.spec.jsx
- [x] src/applications/686c-674/tests/containers/introductionPage.unit.spec.jsx

### Ask VA

- [x] src/applications/ask-va/tests/components/reviewPage/ReviewSectionContent.unit.spec.jsx
- [x] src/applications/ask-va/tests/containers/DashboardCards.unit.spec.jsx

### Authentication

- [x] src/applications/auth/tests/AuthApp.unit.spec.jsx

### Claims Status

- [x] src/applications/claims-status/tests/actions/index.unit.spec.jsx
- [x] src/applications/claims-status/tests/utils/helpers.unit.spec.jsx

### Disability Benefits

- [x] src/applications/disability-benefits/view-payments/tests/components/view-payments-lists/view-payments-lists.unit.spec.jsx

### Pensions

- [x] src/applications/pensions/tests/unit/NoFormPage.unit.spec.jsx

### Personalization

- [x] src/applications/personalization/appointments/actions/index.unit.spec.jsx
- [x] src/applications/personalization/profile/tests/actions/directDeposit.unit.spec.jsx
- [x] src/applications/personalization/profile/tests/components/contact-information/ContactInformation.delete-address.unit.spec.jsx
- [x] src/applications/personalization/profile/tests/components/contact-information/ContactInformation.delete-email-address.unit.spec.jsx
- [x] src/applications/personalization/profile/tests/components/contact-information/ContactInformation.delete-telephone.unit.spec.jsx
- [x] src/applications/personalization/profile/tests/components/contact-information/ContactInformation.edit-email-address.unit.spec.jsx
- [x] src/applications/personalization/profile/tests/components/contact-information/ContactInformation.edit-telephone.unit.spec.jsx
- [x] src/applications/personalization/profile/tests/components/contact-information/ContactInformation.update-address.unit.spec.jsx
- [x] src/applications/personalization/profile/tests/ducks/communicationPreferences.unit.spec.jsx
- [x] src/applications/personalization/profile/tests/hooks/useDirectDeposit/useDirectDeposit.unit.spec.jsx

### Rated Disabilities

- [x] src/applications/rated-disabilities/tests/containers/AppContent.unit.spec.jsx

### Static Pages

- [x] src/applications/static-pages/download-1095b/components/App/index.unit.spec.jsx

### Terms of Use

- [x] src/applications/terms-of-use/tests/MyVAHealth.unit.spec.jsx
- [x] src/applications/terms-of-use/tests/TermsOfUse.unit.spec.jsx

### Platform User

- [x] src/platform/user/profile/vap-svc/tests/components/ContactInfoFormAppConfigContext.unit.spec.jsx
- [x] src/platform/user/tests/authentication/components/DowntimeBanner.unit.spec.jsx
- [x] src/platform/user/widgets/representative-status/tests/App.unit.spec.jsx
- [x] src/platform/user/widgets/representative-status/tests/repStatusApi.unit.spec.jsx

### Platform Utilities

- [x] src/platform/forms/tests/save-in-progress/actions.unit.spec.jsx (unmodified, already updated in node 22 branch)
- [x] src/platform/utilities/tests/api/index.unit.spec.jsx (unmodified, already updated in node 22 branch)

## Migration Progress

- Total files to update: 31
- Files updated: 31
- Progress: 100%

## Running Unit Tests

To run unit tests for all files in this migration list:

```bash
yarn test:unit - src/applications/686c-674/tests/actions/index.unit.spec.jsx src/applications/686c-674/tests/config/utilities.unit.spec.jsx src/applications/686c-674/tests/containers/introductionPage.unit.spec.jsx src/applications/ask-va/tests/components/reviewPage/ReviewSectionContent.unit.spec.jsx src/applications/ask-va/tests/containers/DashboardCards.unit.spec.jsx src/applications/auth/tests/AuthApp.unit.spec.jsx src/applications/claims-status/tests/actions/index.unit.spec.jsx src/applications/claims-status/tests/utils/helpers.unit.spec.jsx src/applications/disability-benefits/view-payments/tests/components/view-payments-lists/view-payments-lists.unit.spec.jsx src/applications/pensions/tests/unit/NoFormPage.unit.spec.jsx src/applications/personalization/appointments/actions/index.unit.spec.jsx src/applications/personalization/profile/tests/actions/directDeposit.unit.spec.jsx src/applications/personalization/profile/tests/components/contact-information/ContactInformation.delete-address.unit.spec.jsx src/applications/personalization/profile/tests/components/contact-information/ContactInformation.delete-email-address.unit.spec.jsx src/applications/personalization/profile/tests/components/contact-information/ContactInformation.delete-telephone.unit.spec.jsx src/applications/personalization/profile/tests/components/contact-information/ContactInformation.edit-email-address.unit.spec.jsx src/applications/personalization/profile/tests/components/contact-information/ContactInformation.edit-telephone.unit.spec.jsx src/applications/personalization/profile/tests/components/contact-information/ContactInformation.update-address.unit.spec.jsx src/applications/personalization/profile/tests/ducks/communicationPreferences.unit.spec.jsx src/applications/personalization/profile/tests/hooks/useDirectDeposit/useDirectDeposit.unit.spec.jsx src/applications/rated-disabilities/tests/containers/AppContent.unit.spec.jsx src/applications/static-pages/download-1095b/components/App/index.unit.spec.jsx src/applications/terms-of-use/tests/MyVAHealth.unit.spec.jsx src/applications/terms-of-use/tests/TermsOfUse.unit.spec.jsx src/platform/user/profile/vap-svc/tests/components/ContactInfoFormAppConfigContext.unit.spec.jsx src/platform/user/tests/authentication/components/DowntimeBanner.unit.spec.jsx src/platform/user/widgets/representative-status/tests/App.unit.spec.jsx src/platform/user/widgets/representative-status/tests/repStatusApi.unit.spec.jsx
```

These commands will help you verify that your MSW adapter migrations are working correctly across both Node environments.

Last updated: May 14, 2025