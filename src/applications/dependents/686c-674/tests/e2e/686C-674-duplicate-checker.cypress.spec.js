import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import { setupCypress } from './cypress.helpers';

Cypress.config('waitForAnimations', true);

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['duplicate-children'],
    fixtures: { data: path.join(__dirname, 'fixtures') },
    setupPerTest: () => {
      // Pass form start page path
      setupCypress('/686-report-add-child/summary');
    },

    stopTestAfterPath: '/review-and-submit',
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.wait('@mockVaFileNumber');
          cy.get('va-button[data-testid="continue-your-application"]').click();
        });
      },

      '686-report-add-child/summary': ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-card').should('have.length', 3);
          cy.get('va-alert[status="warning"]')
            .should('have.length', 2)
            .first()
            .should('contain', 'more than once');
          cy.injectAxeThenAxeCheck();

          cy.get(`va-link[label="Edit Penny Foster"]`)
            .first()
            .click();

          cy.fillVaTextInput('root_fullName_first', 'Mary');
          cy.get('va-button[continue]').click();

          cy.get('va-modal[status="warning"]')
            .shadow()
            .find('.va-modal-alert-body')
            .should('contain', 'already have a dependent with this date');

          cy.injectAxeThenAxeCheck();

          cy.get('va-modal[status="warning"]')
            .shadow()
            .find('.va-modal-alert-body va-button')
            .first() // cancel button
            .click();

          cy.selectVaRadioOption('root_view:completedAddChild', 'N');

          cy.clickFormContinue();
        });
      },
    },
    // skip: Cypress.env('CI'),
  },

  manifest,
  formConfig,
);

testForm(testConfig);
