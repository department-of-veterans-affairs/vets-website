// import path from 'path';

// import testForm from 'platform/testing/e2e/cypress/support/form-tester';
// import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

// import formConfig from '../../config/form';
// import manifest from '../../manifest.json';

// Cypress.config('waitForAnimations', true);

// const testConfig = createTestConfig(
//   {
//     dataPrefix: 'data',
//     dataSets: ['dependent-workflow-test'],
//     fixtures: { data: path.join(__dirname, 'formDataSets') },
//     pageHooks: {
//       introduction: ({ afterHook }) => {
//         cy.get('#claimant-relationship-0').click();
//         cy.get('#vre-benefits-1').click();
//         cy.get('#education-benefits-0').click();
//         cy.get('#begin-form-now-0').click();
//         cy.get('.vads-c-action-link--green').click();

//         // Previous button click fully loads a new page, so we need to
//         // re-inject aXe to get the automatic aXe checks working.
//         cy.injectAxe();

//         afterHook(() => {
//           cy.get('.schemaform-start-button')
//             .first()
//             .click();
//         });
//       },
//       'claimant-address': ({ afterHook }) => {
//         afterHook(() => {
//           cy.fillPage();
//           cy.get('#root_claimantAddress_state').select('Alabama');
//           cy.get('.usa-button-primary').click();
//         });
//       },
//     },
//     setupPerTest: () => {
//       window.sessionStorage.removeItem('wizardStatus');
//       cy.intercept('POST', '/v0/education_career_counseling_claims', {
//         formSubmissionId: '123fake-submission-id-567',
//         timestamp: '2020-11-12',
//         attributes: {
//           guid: '123fake-submission-id-567',
//         },
//       }).as('submitApplication');
//     },
//   },
//   manifest,
//   formConfig,
// );

// testForm(testConfig);
