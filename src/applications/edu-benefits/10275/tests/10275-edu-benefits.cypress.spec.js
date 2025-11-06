import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../config/form';
import manifest from '../manifest.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    dataSets: ['maximal-test'],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.get('.schemaform-start-button')
            .first()
            .click();
        });
      },
    },
    '/school-administrators/commit-principles-of-excellence-form-22-10275/new-commitment-institution-details': ({
      afterHook,
    }) => {
      afterHook(() => {
        cy.fillVaTextInput('root_institutionDetails_facilityCode', '10002000');

        cy.get('va-loading-indicator', { timeout: 10000 }).should('not.exist');

        cy.get('#institutionHeading', { timeout: 10000 }).should(
          'contain',
          'INSTITUTE OF TESTING',
        );
        cy.tabToSubmitForm();
      });
    },
    '/school-administrators/commit-principles-of-excellence-form-22-10275/new-commitment-authorizing-official': ({
      afterHook,
    }) => {
      afterHook(() => {
        cy.fillVaTextInput('root_authorizedOfficial_fullName_first', 'Jane');
        cy.tabToSubmitForm();
      });
    },
    // '/school-administrators/commit-principles-of-excellence-form-22-10275/new-commitment-authorizing-official': ({
    //   afterHook,
    // }) => {
    //   afterHook(() => {
    //     cy.fillVaTextInput('root_authorizedOfficial_fullName_first', 'Jane');
    //     cy.fillVaTextInput('root_certifyingOfficial_last', 'Miller');
    //     cy.fillVaTextInput(
    //       'root_certifyingOfficial_title',
    //       'Certifying Official',
    //     );
    //     //   cy.tabToSubmitForm();
    //     cy.selectVaRadioOption('root_authorizedOfficial_view:isPOC', 'N');
    //     cy.tabToSubmitForm();
    //   });
    // },

    // setupPerTest: () => {
    //   cy.intercept('GET', '/v0/user', mockUser);
    //   cy.intercept('POST', formConfig.submitUrl, { status: 200 });
    //   cy.login(mockUser);
    // },

    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
