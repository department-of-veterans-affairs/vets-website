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

### Appeals Application

- [ ] src/applications/appeals/995/tests/utils/evidence.unit.spec.jsx
- [ ] src/applications/appeals/995/tests/utils/toggle.unit.spec.jsx
- [ ] src/applications/appeals/996/tests/containers/ConfirmationPage.unit.spec.jsx
- [ ] src/applications/appeals/shared/tests/utils/addIssues.unit.spec.jsx

### Authentication

- [ ] src/applications/auth/tests/AuthApp.unit.spec.jsx

### Check-In Application

- [ ] src/applications/check-in/hooks/tests/useStorage/useStorage.unit.spec.jsx

### Claims Status Application

- [ ] src/applications/claims-status/tests/components/DocumentRequestPage.unit.spec.jsx
- [ ] src/applications/claims-status/tests/components/YourClaimsPageV2.unit.spec.jsx
- [ ] src/applications/claims-status/tests/components/claim-files-tab/FilesNeeded.unit.spec.jsx
- [ ] src/applications/claims-status/tests/components/claim-files-tab/Standard5103Alert.unit.spec.jsx

### Disability Benefits Application

- [ ] src/applications/disability-benefits/all-claims/tests/components/UpdateMilitaryHistory.unit.spec.jsx
- [ ] src/applications/disability-benefits/all-claims/tests/containers/Form526EZApp.unit.spec.jsx
- [ ] src/applications/disability-benefits/all-claims/tests/containers/IntroductionPage.unit.spec.jsx
- [ ] src/applications/disability-benefits/all-claims/tests/containers/WizardContainer.unit.spec.jsx
- [ ] src/applications/disability-benefits/all-claims/tests/pages/additionalDocuments.unit.spec.jsx
- [ ] src/applications/disability-benefits/all-claims/tests/routes.unit.spec.jsx
- [ ] src/applications/disability-benefits/all-claims/tests/utils/serviceBranches.unit.spec.jsx
- [ ] src/applications/disability-benefits/all-claims/tests/utils/utils.unit.spec.jsx

### GI Bill Comparison Tool

- [ ] src/applications/gi/tests/containers/search/NameSearchForm.unit.spec.jsx

### Personalization

- [ ] src/applications/personalization/common/hooks/useSessionStorage.unit.spec.jsx

### Sign-In Changes

- [ ] src/applications/sign-in-changes/tests/InterstitialChanges.unit.spec.jsx

### Static Pages

- [ ] src/applications/static-pages/burial-how-do-i-apply-widget/components/App/index.unit.spec.jsx
- [ ] src/applications/static-pages/cta-widget/tests/index.unit.spec.jsx
- [ ] src/applications/static-pages/wizard/tests/bdd-526.unit.spec.jsx

### Terms of Use

- [ ] src/applications/terms-of-use/tests/Declined.unit.spec.jsx
- [ ] src/applications/terms-of-use/tests/TermsOfUse.unit.spec.jsx
- [ ] src/applications/terms-of-use/tests/helpers.unit.spec.jsx

### VAOS (VA Online Scheduling)

- [ ] src/applications/vaos/referral-appointments/ReviewAndConfirm.unit.spec.jsx
- [ ] src/applications/vaos/referral-appointments/ScheduleReferral.unit.spec.jsx
- [ ] src/applications/vaos/referral-appointments/components/DateAndTimeContent.unit.spec.jsx
- [ ] src/applications/vaos/referral-appointments/tests/utils/timer.unit.spec.jsx

### Virtual Agent

- [ ] src/applications/virtual-agent/tests/components/Bot.unit.spec.jsx
- [ ] src/applications/virtual-agent/tests/components/ChatboxDisclaimer.unit.spec.jsx
- [ ] src/applications/virtual-agent/tests/components/WebChat.unit.spec.jsx
- [ ] src/applications/virtual-agent/tests/event-listeners/clearBotSessionStorage.unit.spec.jsx
- [ ] src/applications/virtual-agent/tests/event-listeners/signOutEventListener.unit.spec.jsx
- [ ] src/applications/virtual-agent/tests/event-listeners/webAuthActivityEventListener.unit.spec.jsx
- [ ] src/applications/virtual-agent/tests/hooks/useDirectline.unit.spec.jsx
- [ ] src/applications/virtual-agent/tests/hooks/useRxSkillEventListener.unit.spec.jsx
- [ ] src/applications/virtual-agent/tests/hooks/useWebMessageActivityEventListener.unit.spec.jsx
- [ ] src/applications/virtual-agent/tests/middleware/cardActionMiddleware.unit.spec.jsx
- [ ] src/applications/virtual-agent/tests/utils/actions.unit.spec.jsx
- [ ] src/applications/virtual-agent/tests/utils/markdownRender.unit.spec.jsx
- [ ] src/applications/virtual-agent/tests/utils/sessionStorage.unit.spec.jsx

### Platform Core

- [ ] src/platform/forms/tests/save-in-progress/ApplicationStatus.unit.spec.jsx
- [ ] src/platform/forms/tests/save-in-progress/RoutedSavableApp.unit.spec.jsx
- [ ] src/platform/site-wide/announcements/tests/actions/index.unit.spec.jsx
- [ ] src/platform/user/tests/authentication/utilities.unit.spec.jsx
- [ ] src/platform/utilities/tests/api/index.unit.spec.jsx
- [ ] src/platform/utilities/tests/feature-toggles/useFeatureToggle.unit.spec.jsx
- [ ] src/platform/utilities/tests/oauth/utilities.unit.spec.jsx

## Migration Progress

- Total files to update: 50
- Files updated: 0
- Progress: 0%

Last updated: May 13, 2025