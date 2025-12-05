import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import user from '../fixtures/mocks/user.json';
import submit from '../fixtures/mocks/submit.json';
import featureToggles from '../fixtures/mocks/featureToggles.json';
import minimalFlow from '../fixtures/data/minimal-flow.json';
import maximalFlow from '../fixtures/data/maximal-flow.json';
import militaryFlow from '../fixtures/data/military-address-flow.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: null,
    dataSets: [
      { title: 'minimalFlow', data: minimalFlow },
      { title: 'maximalFlow', data: maximalFlow },
      { title: 'militaryFlow', data: militaryFlow },
    ],

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.injectAxeThenAxeCheck();
          cy.get('va-link-action[href="#start"]').click();
        });
      },
      'claimant-address': ({ afterHook }) => {
        afterHook(() => {
          cy.injectAxeThenAxeCheck();
          cy.get('@testData').then(data => {
            cy.fillAddressWebComponentPattern(
              'claimantAddress',
              data.claimantAddress,
            );
            cy.get('va-button[text="Continue"]').click();
          });
        });
      },
      'review-and-submit': () => {
        cy.injectAxeThenAxeCheck();
      },
    },

    setupPerTest: () => {
      cy.intercept('GET', '/v0/user', user);
      cy.intercept('/v0/feature_toggles*', featureToggles);
      cy.intercept('POST', '/v0/veteran_readiness_employment_claims', submit);
      cy.login(user);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
