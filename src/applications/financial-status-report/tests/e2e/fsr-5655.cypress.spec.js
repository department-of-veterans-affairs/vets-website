import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mockUser.json';
import debts from './fixtures/mocks/debts.json';
import { WIZARD_STATUS_COMPLETE } from 'applications/static-pages/wizard';
import { WIZARD_STATUS } from '../../wizard/constants';

Cypress.config('waitForAnimations', true);

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['minimal'],
    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
    },
    setupPerTest: () => {
      sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
      cy.login(mockUser);
      cy.intercept('GET', '/v0/debts', debts);
      cy.get('@testData').then(testData => {
        cy.intercept('GET', '/v0/in_progress_forms/5655', testData);
        cy.intercept('PUT', 'v0/in_progress_forms/5655', testData);
      });
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
      'resolution-options': ({ afterHook }) => {
        afterHook(() => {
          cy.get('[type="radio"][value="Waiver"]').click();
          cy.get(`input[name="agree-to-waiver"]`).check();
          cy.get('.usa-button-primary').click();
        });
      },

      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get(`input[name="veteran-signature"]`).type('Greg A Anderson');
          cy.get(`input[name="veteran-certify"]`).check();
          cy.get(`input[name="privacy-policy"]`).check();
        });
      },
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
