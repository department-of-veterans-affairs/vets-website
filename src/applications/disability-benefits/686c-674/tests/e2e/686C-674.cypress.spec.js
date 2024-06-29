import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from 'applications/disability-benefits/686c-674/config/form';
import manifest from 'applications/disability-benefits/686c-674/manifest.json';
import mockVaFileNumber from './fixtures/va-file-number.json';

Cypress.config('waitForAnimations', true);

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['add-child-add-674', 'spouse-child-all-fields'],
    fixtures: { data: path.join(__dirname, 'fixtures') },
    setupPerTest: () => {
      cy.login();
      cy.intercept(
        'GET',
        '/v0/profile/valid_va_file_number',
        mockVaFileNumber,
      ).as('mockVaFileNumber');
      cy.get('@testData').then(testData => {
        cy.intercept('GET', '/v0/in_progress_forms/686C-674', testData);
        cy.intercept('PUT', 'v0/in_progress_forms/686C-674', testData);
      });
      cy.intercept('POST', '/v0/dependents_applications', {
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
          cy.get('va-omb-info')
            .get('div')
            .get('va-button')
            .should('exist');
          cy.get('.help-talk va-telephone:first')
            .contains('800-827-1000')
            .should('have.prop', 'href');
          cy.get('.help-talk va-telephone:last')
            .contains('711')
            .should('have.prop', 'href');
          cy.get('a.vads-c-action-link--green')
            .first()
            .click();
        });
      },
      'veteran-information': ({ afterHook }) => {
        afterHook(() => {
          cy.fillPage();
          cy.get('.progress-box va-telephone')
            .contains('800-827-1000')
            .should('have.prop', 'href');
          cy.get('.usa-button-primary').click();
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
      'add-child/0': ({ afterHook }) => {
        afterHook(() => {
          cy.fillPage();
          cy.get('@testData').then(data => {
            if (!data.childrenToAdd[0].childStatus.biological) {
              cy.get('#root_childStatus_stepchild').check();
              cy.get('#root_childStatus_biologicalStepchildYes').check();
            }
          });
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
