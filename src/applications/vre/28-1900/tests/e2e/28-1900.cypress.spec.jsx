import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import user from '../fixtures/mocks/user.json';
import submit from '../fixtures/mocks/submit.json';
import featureToggles from '../fixtures/mocks/featureToggles.json';
import minimalFlow from '../fixtures/data/minimalFlow.json';
import maximalFlow from '../fixtures/data/maximalFlow.json';
import militaryAddressFlow from '../fixtures/data/militaryAddressFlow.json';
import { selectCheckboxWebComponent } from './utilities';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: null,
    dataSets: [
      { title: 'minimalFlow', data: minimalFlow },
      { title: 'maximalFlow', data: maximalFlow },
      { title: 'militaryAddressFlow', data: militaryAddressFlow },
    ],

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.injectAxeThenAxeCheck();
          cy.get('a.vads-c-action-link--green').click();
        });
      },
      'veteran-address': ({ afterHook }) => {
        afterHook(() => {
          cy.injectAxeThenAxeCheck();
          cy.get('@testData').then(data => {
            if (data.checkBoxGroup?.checkForMailingAddress) {
              selectCheckboxWebComponent(
                'checkBoxGroup_checkForMailingAddress',
                data.checkBoxGroup.checkForMailingAddress,
              );
            } else {
              cy.fillAddressWebComponentPattern(
                'veteranAddress',
                data.veteranAddress,
              );
            }
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'new-address': ({ afterHook }) => {
        afterHook(() => {
          cy.injectAxeThenAxeCheck();
          cy.get('@testData').then(data => {
            cy.fillAddressWebComponentPattern('newAddress', data.newAddress);
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
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
    },

    setupPerTest: () => {
      cy.intercept('GET', '/v0/user', user);
      cy.intercept('/v0/feature_toggles*', featureToggles);
      cy.intercept('PUT', '/v0/in_progress_forms/28-1900', {
        statusCode: 200,
      });
      cy.intercept('POST', '/v0/veteran_readiness_employment_claims', submit);
      cy.login(user);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
