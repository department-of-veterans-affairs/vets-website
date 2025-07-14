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
import { normalizeFullName } from '../../utils';

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
        cy.get('@testData').then(testData => {
          cy.get('[data-testid="privacy-agreement-checkbox"]').then($el =>
            cy.selectVaCheckbox($el, true),
          );
          cy.get('.signature-input').then($el => {
            cy.fillVaTextInput($el, normalizeFullName(testData.fullName, true));
          });
          cy.get('.signature-checkbox').then($el =>
            cy.selectVaCheckbox($el, true),
          );
        });
      },
    },

    setupPerTest: () => {
      cy.intercept('GET', '/v0/user', userSip);
      cy.intercept('/v0/feature_toggles*', featureToggles);
      cy.intercept('PUT', '/v0/in_progress_forms/28-1900_V2', mockInProgress);
      cy.intercept('GET', '/v0/in_progress_forms/28-1900_V2', mockPrefill);
      cy.intercept('POST', '/v0/veteran_readiness_employment_claims', submit);
      cy.login(userSip);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
