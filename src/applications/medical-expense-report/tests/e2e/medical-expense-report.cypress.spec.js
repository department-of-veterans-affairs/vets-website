import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import user from './fixtures/mocks/user.json';
import mockSubmit from './fixtures/mocks/mock-submit.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataSets: ['minimal-test'],
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findByRole('link', {
            name: /Report your medical expenses/i,
          }).click({ force: true });
        });
      },
      'applicant/veteran-information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data.veteranSocialSecurityNumber) {
              cy.fillVaTextInput(
                'root_veteranSocialSecurityNumber_ssn',
                data.veteranSocialSecurityNumber.ssn,
              );
            }
            if (data.veteranDateOfBirth) {
              cy.fillDate('root_veteranDateOfBirth', data.veteranDateOfBirth);
            }
            cy.clickFormContinue();
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { claimantFullName } = data;
            cy.get('va-statement-of-truth')
              .shadow()
              .get('#veteran-signature')
              .shadow()
              .get('input[name="veteran-signature"')
              .type(
                `${claimantFullName.first} ${claimantFullName.middle || ''} ${
                  claimantFullName.last
                }`.trim(),
              );
            cy.get('va-statement-of-truth')
              .shadow()
              .find('input[type="checkbox"]')
              .check({ force: true });
            cy.axeCheck();
            cy.findByText(/submit/i, { selector: 'button' }).click();
          });
        });
      },
      // 'important-information': ({ afterHook }) => {
      //   cy.injectAxeThenAxeCheck();
      //   afterHook(() => {
      //     cy.findByText(/continue/i, { selector: 'button' }).click();
      //   });
      // },
    },
    setup: () => {
      cy.log('Logging something before starting tests.');
    },
    setupPerTest: () => {
      // `cy.server` is already set up by default, so just start adding routes.

      // Start an auth'd session here if your form requires it.
      cy.login(user);
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);
      // cy.route({
      //   method: 'GET',
      //   url: '/v0/endpoint',
      //   response: { body: 'mock body' },
      // });

      // cy.route({
      //   method: 'POST',
      //   url: '/v0/endpoint',
      //   status: 200,
      // });
    },
  },
  manifest,
  formConfig,
);

// const testConfig = createTestConfig(
//   {
//     dataPrefix: 'data',
//     dataDir: path.join(__dirname, 'fixtures', 'data'),
//     dataSets: ['minimal-test'],
//     pageHooks: {
//       // introduction: ({ afterHook }) => {
//       //   afterHook(() => {
//       //     cy.findAllByText(/^start/i, { selector: 'a[href="#start"]' })
//       //       .last()
//       //       .click({ force: true });
//       //   });
//       // },
//     },
//     setup: () => {
//       Cypress.config({
//         defaultCommandTimeout: 10000,
//         includeShadowDom: true,
//         waitForAnimations: true,
//       });
//     },
//     setupPerTest: () => {
//       cy.intercept('GET', '/v0/user', mockUser);
//       cy.intercept('POST', formConfig.submitUrl, { status: 200 });
//       // cy.login(mockUser);
//     },

//     // Skip tests in CI until the form is released.
//     // Remove this setting when the form has a content page in production.
//     skip: Cypress.env('CI'),
//   },
//   manifest,
//   formConfig,
// );

testForm(testConfig);
