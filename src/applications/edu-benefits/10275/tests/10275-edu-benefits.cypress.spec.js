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
      '/school-administrators/commit-principles-of-excellence-form-22-10275/additional-locations/:index/point-of-contact': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.get('.radio-container', { timeout: 10000 }).should('exist');
          cy.get(
            'va-radio-option[name="pointOfContact"][value="authorizedOfficial"]',
            {
              timeout: 10000,
            },
          )
            .first()
            .should('be.visible')
            .click();
          cy.get(
            'va-radio-option[name="pointOfContact"][value="authorizedOfficial"]',
          )
            .first()
            .should('have.attr', 'checked');
          cy.get('va-radio[name="pointOfContact"]', { timeout: 5000 }).should(
            'have.attr',
            'value',
            'authorizedOfficial',
          );
          cy.tabToSubmitForm();
        });
      },
      '/school-administrators/commit-principles-of-excellence-form-22-10275/review-and-submit': ({
        afterHook,
      }) => {
        afterHook(() => {
          // cy.get('@testKey').then(testKey => {
          cy.get('[id="inputField"]', { timeout: 10000 }).type('John Doe', {
            force: true,
          });
          cy.get('[id="checkbox-element"]').check({ force: true });

          cy.findByText(/Continue/i, { selector: 'button' }).click();
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('POST', formConfig.submitUrl);
    },
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
