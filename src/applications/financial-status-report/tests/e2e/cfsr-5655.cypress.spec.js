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
import copays from './fixtures/mocks/copays.json';
import VeteranEmploymentHistory from './pages/employment/VeteranEmploymentHistory';
import SpouseEmploymentHistory from './pages/employment/SpouseEmploymentHistory';

Cypress.config('waitForAnimations', true);

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['cfsr-maximal', 'cfsr-minimal'],
    fixtures: { data: path.join(__dirname, 'fixtures', 'data') },

    setupPerTest: () => {
      sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
      cy.login(mockUser);
      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          features: [
            { name: 'show_financial_status_report_wizard', value: true },
            { name: 'show_financial_status_report', value: true },
            { name: 'combined_financial_status_report', value: true },
          ],
        },
      });
      cy.intercept('GET', '/v0/debts', debts);
      cy.intercept('GET', '/v0/medical_copays', copays);
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
          cy.get(`input[name="request-help-with-copay"]`)
            .first()
            .check();
          cy.get('.usa-button-primary').click();
        });
      },
      'employment-records': ({ afterHook }) => {
        afterHook(() => {
          VeteranEmploymentHistory.fillEmployerInfo();
          VeteranEmploymentHistory.attemptNextPage();
        });
      },
      'spouse-employment-records': ({ afterHook }) => {
        afterHook(() => {
          SpouseEmploymentHistory.fillEmployerInfo();
          SpouseEmploymentHistory.attemptNextPage();
        });
      },
      'spouse/income/0': ({ afterHook }) => {
        afterHook(() => {
          cy.get(`#root_spouseGrossSalary`).type('3500');
          cy.get('.usa-button-primary').click();
        });
      },
      'cfsr-recreational-vehicle-records': ({ afterHook }) => {
        afterHook(() => {
          cy.findByLabelText(
            /What is the estimated value of your trailers, campers, and boats?/,
          )
            .type('2500')
            .type('{downarrow}{enter}');
          cy.get('.usa-button-primary').click();
        });
      },
      'resolution-option/0': ({ afterHook }) => {
        afterHook(() => {
          cy.get('[type="radio"][value="monthly"]').click();
          cy.get('.usa-button-primary').click();
        });
      },
      'resolution-comment/0': ({ afterHook }) => {
        afterHook(() => {
          cy.get(`#root_resolutionComment`).type('10.00');
          cy.get('.usa-button-primary').click();
        });
      },
      'resolution-option/1': ({ afterHook }) => {
        afterHook(() => {
          cy.get('[type="radio"][value="waiver"]').click();
          cy.get('[type="checkbox"]').click();
          cy.get('.usa-button-primary').click();
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#veteran-signature')
            .shadow()
            .find('input')
            .first()
            .type('Mark Webb');
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
