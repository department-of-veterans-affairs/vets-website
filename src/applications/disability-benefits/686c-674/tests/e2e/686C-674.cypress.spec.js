import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import mockVaFileNumber from './fixtures/va-file-number.json';

import formConfig from 'applications/disability-benefits/686c-674/config/form';
import manifest from 'applications/disability-benefits/686c-674/manifest.json';

Cypress.config('waitForAnimations', true);

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['add-child-add-674', 'spouse-child-all-fields'],
    fixtures: { data: path.join(__dirname, 'fixtures') },
    setupPerTest: () => {
      cy.login();
      cy.route('GET', '/v0/profile/valid_va_file_number', mockVaFileNumber).as(
        'mockVaFileNumber',
      );
      cy.get('@testData').then(testData => {
        cy.route('GET', '/v0/in_progress_forms/686C-674', testData);
        cy.route('PUT', 'v0/in_progress_forms/686C-674', testData);
      });
      cy.route('POST', '/v0/dependents_applications', {
        formSubmissionId: '123fake-submission-id-567',
        timestamp: '2020-11-12',
        attributes: {
          guid: '123fake-submission-id-567',
        },
      }).as('submitApplication');
    },
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.wait('@mockVaFileNumber');
          cy.findAllByText(/Add or remove a dependent/i, { selector: 'button' })
            .first()
            .click();
        });
      },
      'current-marriage-information': ({ afterHook }) => {
        afterHook(() => {
          cy.fillPage();
          cy.get('#root_currentMarriageInformation_location_country').select(
            'Argentina',
          );
          cy.get('.usa-button-primary').click();
        });
      },
      'add-child/0/additional-information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#root_doesChildLiveWithYouYes').click();
          cy.get('.usa-button-primary').click();
        });
      },
      '686-report-dependent-death/0/additional-information': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.get('#root_dateMonth').select('Jan');
          cy.get('#root_dateDay').select('1');
          cy.get('#root_dateYear').type('1991');
          cy.get('#root_location_state').select('Alabama');
          cy.get('#root_location_city').type('city');
          cy.get('.usa-button-primary').click();
        });
      },
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
