import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import userSip from '../fixtures/mocks/user-sip.json';
import submit from '../fixtures/mocks/submit.json';
import featureToggles from '../fixtures/mocks/featureToggles.json';
import minimalFlow from '../fixtures/data/minimalFlow.json';
import mockPrefill from '../fixtures/mocks/sip-get.json';
import mockInProgress from '../fixtures/mocks/sip-put.json';

// This test ensures that the save-in-progress functionality of the 28-1900 form works as expected.
const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: null,
    dataSets: [{ title: 'save in progress', data: minimalFlow }],

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.injectAxeThenAxeCheck();
          cy.contains('button', 'Continue your application').click();
        });
      },
      'review-and-submit': () => {
        cy.injectAxeThenAxeCheck();
        cy.get('@testData').then(data => {
          cy.get('[id="checkbox"]').then($el =>
            cy.selectVaCheckbox($el, data.privacyAgreementAccepted),
          );
        });
      },
      confirmation: ({ afterHook }) => {
        afterHook(() => {
          cy.get(
            `va-link[text="Download a copy of your VA Form 28-1900"]`,
          ).should('be.visible');
        });
      },
    },

    setupPerTest: () => {
      cy.intercept('GET', '/v0/user', userSip);
      cy.intercept('/v0/feature_toggles*', featureToggles);
      cy.intercept('PUT', '/v0/in_progress_forms/28-1900', mockInProgress);
      cy.intercept('GET', '/v0/in_progress_forms/28-1900', mockPrefill);
      cy.intercept('POST', '/v0/veteran_readiness_employment_claims', submit);
      cy.login(userSip);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
