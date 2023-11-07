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
//       cy.intercept('GET', '/v0/feature_toggles*', featureToggles);
//       cy.intercept('POST', '/v0/education_benefits_claims/1990', {
//         data: {
//           attributes: {
//             confirmationNumber: 'BB935000000F3VnCAW',
//             submittedAt: '2020-08-09T19:18:11+00:00',
//           },
//         },
//       });
//       cy.login(mockUser);
//       cy.get('@testData').then(testData => {
//         cy.intercept('GET', '/v0/in_progress_forms/1990', testData);
//       });
//     },
//     pageHooks: {
//       introduction: ({ afterHook }) => {
//         cy.findByText(/Find the right application form/i, {
//           selector: 'button',
//         })
//           .first()
//           .click();
//         cy.get('#NewBenefit-0').check();
//         cy.get('#ClaimingBenefitOwnService-0').check();
//         cy.get('#NationalCallToService-1').click();
//         cy.get('#VetTec-1').click();
//         cy.get('#apply-now-link').click();
//
//         afterHook(() => {
//           cy.findAllByText(/Start the education application/i, {
//             selector: 'button',
//           })
//             .first()
//             .click();
//         });
//       },
//     },
//     skip: true, // skip allowed while removing the secondary wizard. will turn to false after secondary wizard has been removed
//   },
//   manifest,
//   formConfig,
// );
//
// testForm(form);
