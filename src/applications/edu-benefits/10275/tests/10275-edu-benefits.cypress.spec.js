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
      '/school-administrators/commit-principles-of-excellence-form-22-10275/additional-locations/0/point-of-contact?add=true': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.get('[label="John William Doe"]')
            .should('exist')
            .click();
          // cy.selectVaRadioOption(
          //   '[label="John William Doe"]',
          //   'authorizedOfficial',
          // );
          cy.tabToSubmitForm();
        });
      },
      // '/school-administrators/commit-principles-of-excellence-form-22-10275/new-commitment-institution-details': ({
      //   afterHook,
      // }) => {
      //   afterHook(() => {
      //     cy.fillVaTextInput(
      //       'root_institutionDetails_facilityCode',
      //       '31860132',
      //     );

      //     cy.get('va-loading-indicator', { timeout: 10000 }).should(
      //       'not.exist',
      //     );

      //     cy.get('#institutionHeading', { timeout: 10000 }).should(
      //       'contain',
      //       'TESTING INSTITUTE OF HIGHER LEARNING',
      //     );
      //     cy.wait('@getInstitutionByFacilityCode');
      //     cy.tabToSubmitForm();
      //   });
      // },
    },

    // '/school-administrators/commit-principles-of-excellence-form-22-10275/new-commitment-authorizing-official': ({
    //   afterHook,
    // }) => {
    //   afterHook(() => {
    //     cy.fillVaTextInput('root_authorizedOfficial_fullName_first', 'Jane');
    //     cy.tabToSubmitForm();
    //   });
    // },
    // '/school-administrators/commit-principles-of-excellence-form-22-10275/additional-locations/:index/point-of-contact?add=true': ({
    //   afterHook,
    // }) => {
    //   afterHook(() => {
    //     cy.selectVaRadioOption('[name="pointOfContact"]', 'authorizedOfficial');
    //     cy.tabToSubmitForm();
    //   });
    // },

    // setupPerTest: () => {
    // cy.intercept('GET', '**/gi/institutions/31860132', {
    //   statusCode: 200,
    //   body: {
    //     data: {
    //       id: '31860132',
    //       type: 'institution',
    //       attributes: {
    //         name: 'INSTITUTE OF TESTING',
    //         address1: '123 STREET WAY',
    //         address2: '',
    //         address3: '',
    //         city: 'SAN FRANCISCO',
    //         state: 'CA',
    //         zip: '13579',
    //         country: 'USA',
    //         programTypes: ['IHL', 'NCD'],
    //       },
    //     },
    //   },
    // }).as('getInstitutionByFacilityCode');
    // cy.intercept('GET', '/v0/user', mockUser);
    // cy.intercept('POST', formConfig.submitUrl, { status: 200 });
    // cy.login(mockUser);
    // },

    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
