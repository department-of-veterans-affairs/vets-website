// import path from 'path';
// import testForm from 'platform/testing/e2e/cypress/support/form-tester';
// import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
// import formConfig from '../../config/form';
// import manifest from '../../manifest.json';
// import mockUser from './fixtures/mocks/mock-user.json';
// import featureToggles from './fixtures/mocks/feature-toggles.json';
//
// Cypress.config('waitForAnimations', true);
//
// const form = createTestConfig(
//   {
//     dataPrefix: 'data',
//     dataSets: ['minimal'],
//     fixtures: {
//       data: path.join(__dirname, 'fixtures', 'data'),
//       mocks: path.join(__dirname, 'fixtures', 'mocks'),
//     },
//     setupPerTest: () => {
//       cy.login(mockUser);
//       cy.intercept('GET', '/v0/feature_toggles*', featureToggles);
//       cy.intercept('POST', '/v0/education_benefits_claims/5495', {
//         data: {
//           attributes: {
//             confirmationNumber: 'BB935000000F3VnCAW',
//             submittedAt: '2020-08-09T19:18:11+00:00',
//           },
//         },
//       });
//       cy.get('@testData').then(testData => {
//         cy.intercept('GET', '/v0/in_progress_forms/5495', testData);
//       });
//     },
//     pageHooks: {
//       introduction: ({ afterHook }) => {
//         afterHook(() => {
//           cy.contains(/continue/i, {
//             selector: 'button',
//           })
//             .first()
//             .click();
//         });
//       },
//     },
//     skip: false,
//   },
//   manifest,
//   formConfig,
// );
// testForm(form);
