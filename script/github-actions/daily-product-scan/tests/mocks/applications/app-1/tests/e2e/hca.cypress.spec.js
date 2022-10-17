// import path from 'path';

// import testForm from 'platform/testing/e2e/cypress/support/form-tester';
// import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

// import formConfig from '../../config/form';
// import manifest from '../../manifest.json';
// import featureToggles from './fixtures/feature-toggles.json';

// const testConfig = createTestConfig(
//   {
//     dataPrefix: 'data',
//     dataSets: ['maximal-test', 'minimal-test', 'foreign-address-test'],
//     fixtures: { data: path.join(__dirname, 'fixtures/schema') },

//     pageHooks: {
//       introduction: ({ afterHook }) => {
//         afterHook(() => {
//           cy.findAllByText(/start.+without signing in/i, { selector: 'button' })
//             .first()
//             .click();
//         });
//       },

//       'id-form': () => {
//         cy.get('@testData').then(data => {
//           cy.findByLabelText(/first name/i).type(data.veteranFullName.first);
//           cy.findByLabelText(/last name/i).type(data.veteranFullName.last);

//           const [year, month, day] = data.veteranDateOfBirth
//             .split('-')
//             .map(dateComponent => parseInt(dateComponent, 10).toString());
//           cy.findByLabelText(/month/i).select(month);
//           cy.findByLabelText(/day/i).select(day);
//           cy.findByLabelText(/year/i).type(year);

//           cy.findByLabelText(/social security/i).type(
//             data.veteranSocialSecurityNumber,
//           );
//         });
//       },
//     },

//     setupPerTest: () => {
//       cy.server();
//       cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);

//       cy.route({
//         method: 'GET',
//         url: '/v0/health_care_applications/enrollment_status*',
//         status: 404,
//         response: {
//           errors: [
//             {
//               title: 'Record not found',
//               detail: 'The record identified by  could not be found',
//               code: '404',
//               status: '404',
//             },
//           ],
//         },
//       });

//       cy.route('POST', '/v0/health_care_applications', {
//         formSubmissionId: '123fake-submission-id-567',
//         timestamp: '2016-05-16',
//       });
//     },
//   },
//   manifest,
//   formConfig,
// );

// testForm(testConfig);
