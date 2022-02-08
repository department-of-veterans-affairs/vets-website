import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import { WIZARD_STATUS_COMPLETE } from 'applications/static-pages/wizard';
import { WIZARD_STATUS } from '../../wizard/constants';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mockUser.json';
import saveInProgress from './fixtures/mocks/saveInProgress.json';
import debts from './fixtures/mocks/debts.json';

Cypress.config('waitForAnimations', true);

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['minimal', 'maximal'],
    fixtures: { data: path.join(__dirname, 'fixtures', 'data') },

    setupPerTest: () => {
      sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
      cy.login(mockUser);
      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          features: [
            { name: 'show_financial_status_report_wizard', value: true },
            { name: 'show_financial_status_report', value: true },
          ],
        },
      });
      cy.intercept('GET', '/v0/debts', debts);
      cy.get('@testData').then(testData => {
        cy.intercept('PUT', '/v0/in_progress_forms/5655', testData);
        cy.intercept('GET', '/v0/in_progress_forms/5655', saveInProgress);
      });
      cy.intercept('POST', formConfig.submitUrl, {
        statusCode: 200,
        body: {
          status: 'Document has been successfully uploaded to filenet',
        },
      }).as('submitForm');
    },

    pageHooks: {
      introduction: () => {
        cy.findAllByText(/start/i, { selector: 'button' })
          .first()
          .click();
      },
      'available-debts': ({ afterHook }) => {
        afterHook(() => {
          cy.get(`input[name="request-help-with-debt"]`)
            .first()
            .check();
          cy.get('.usa-button-primary').click();
        });
      },
      'employment-records': ({ afterHook }) => {
        afterHook(() => {
          // Employer One - Current Employment
          cy.findByLabelText(/Type of work/).select('Full time');
          cy.get(`select[name="fromMonth"]`).select('1');
          cy.get(`input[name="fromYear"]`).type('2017');
          cy.get(`input[name="current-employment"]`).check();
          cy.get(`input[name="employerName"]`).type('Employer One');
          cy.findAllByText(/Save/i, { selector: 'button' })
            .first()
            .click();
          // Add job link
          cy.get('.add-item-button').click();
          // Employer Two - Previous Employment
          cy.findByLabelText(/Type of work/).select('Full time');
          cy.get(`select[name="fromMonth"]`).select('1');
          cy.get(`input[name="fromYear"]`).type('2015');
          cy.get(`select[name="toMonth"]`).select('1');
          cy.get(`input[name="toYear"]`).type('2017');
          cy.get(`input[name="employerName"]`).type('Employer Two');
          cy.findAllByText(/Save/i, { selector: 'button' })
            .first()
            .click();
          cy.get('.usa-button-primary').click();
        });
      },

      'spouse-employment-records': ({ afterHook }) => {
        afterHook(() => {
          // Employer One - Current Employment
          cy.findByLabelText(/Type of work/).select('Full time');
          cy.get(`select[name="fromMonth"]`).select('5');
          cy.get(`input[name="fromYear"]`).type('2015');
          cy.get(`input[name="current-employment"]`).check();
          cy.get(`input[name="employerName"]`).type('Employer One');
          cy.findAllByText(/Save/i, { selector: 'button' })
            .first()
            .click();
          // Add job link
          cy.get('.add-item-button').click();
          // Employer Two - Previous Employment
          cy.findByLabelText(/Type of work/).select('Full time');
          cy.get(`select[name="fromMonth"]`).select('2');
          cy.get(`input[name="fromYear"]`).type('2013');
          cy.get(`select[name="toMonth"]`).select('3');
          cy.get(`input[name="toYear"]`).type('2018');
          cy.get(`input[name="employerName"]`).type('Employer Two');
          cy.findAllByText(/Save/i, { selector: 'button' })
            .first()
            .click();
          cy.get('.usa-button-primary').click();
        });
      },
      'spouse/income/0': ({ afterHook }) => {
        afterHook(() => {
          cy.get(`#root_spouseGrossSalary`).type('3500');
          cy.get('.usa-button-primary').click();
        });
      },
      'resolution-options': ({ afterHook }) => {
        afterHook(() => {
          cy.get('[type="radio"][value="Compromise"]').click();
          cy.get(`input[name="compromise-resolution-amount"]`).type('100');
          cy.get('.usa-button-primary').click();
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get(`input[name="veteran-signature"]`).type('Mark Webb');
          cy.get(`input[name="veteran-certify"]`).check();
          cy.get(`input[name="privacy-policy"]`).check();
          cy.findAllByText(/Submit your request/i, {
            selector: 'button',
          }).click();
        });
      },
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
