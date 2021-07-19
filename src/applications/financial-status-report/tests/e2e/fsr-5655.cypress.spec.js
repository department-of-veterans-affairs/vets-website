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
    fixtures: { data: path.join(__dirname, 'fixtures', 'data') },

    setupPerTest: () => {
      sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
      cy.login(mockUser);
      cy.intercept('GET', '/v0/debts', debts);
      cy.get('@testData').then(testData => {
        cy.intercept('PUT', '/v0/in_progress_forms/5655', testData);
        cy.intercept('GET', '/v0/in_progress_forms/5655', {
          formData: {
            personalIdentification: {
              ssn: '4437',
              fileNumber: '4437',
            },
            personalData: {
              veteranFullName: {
                first: 'Mark',
                last: 'Webb',
                suffix: 'Jr.',
              },
              telephoneNumber: '4445551212',
              emailAddress: 'test2@test1.net',
              dateOfBirth: '1950-10-04',
            },
            income: [
              {
                veteranOrSpouse: 'VETERAN',
                compensationAndPension: '3261.1',
                education: '50',
              },
            ],
          },
          metadata: {
            version: 0,
            prefill: true,
            returnUrl: '/veteran-information',
          },
        });
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
      'resolution-options': ({ afterHook }) => {
        afterHook(() => {
          cy.get('[type="radio"][value="Waiver"]').click();
          cy.get(`input[name="agree-to-waiver"]`).check();
          cy.get('.usa-button-primary').click();
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get(`input[name="veteran-signature"]`).type('Mark Webb');
          cy.get(`input[name="veteran-certify"]`).check();
          cy.get(`input[name="privacy-policy"]`).check();
          cy.get('.usa-button-primary').click();
        });
      },
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
