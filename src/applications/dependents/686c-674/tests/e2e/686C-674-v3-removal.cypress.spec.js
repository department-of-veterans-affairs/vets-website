import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import { PICKLIST_DATA } from '../../config/constants';
import manifest from '../../manifest.json';
import { signAndSubmit, setupCypress } from './cypress.helpers';

Cypress.config('waitForAnimations', true);

/**
 * Helper to select checkboxes in the V3 picklist
 * @param {string} key - The dependent key (e.g., 'spousy-3332')
 * @returns {void}
 */
const selectPicklistDependent = key => {
  cy.get(`va-checkbox[data-key="${key}"]`)
    .shadow()
    .find('label')
    .click({ force: true });
};

/**
 * Fill out picklist dependent; works for any followup page
 * @param {Object} dependent - The dependent data to fill
 * @returns {void}
 */
const fillOutPicklistPage = dependent => {
  // Only fill out the field if it exists on the page
  const checkElAndFill = (name, fillFnName) => {
    cy.get(
      'va-radio-option, va-checkbox, va-text-input, va-memorable-date, va-select',
    ).each($el => {
      const attrName = $el[0].getAttribute('name') || '';
      if (attrName === `root_${name}` && dependent.address?.[name]) {
        cy[fillFnName](attrName, dependent.address[name]);
      } else if (
        (attrName === 'first' || attrName === 'last') &&
        name.startsWith('whoDoesTheStepchildLiveWith.')
      ) {
        cy[fillFnName](
          attrName,
          dependent.whoDoesTheStepchildLiveWith?.[attrName],
        );
      } else if (attrName === name) {
        cy[fillFnName](name, dependent[name]);
      }
    });
  };

  checkElAndFill('isStepchild', 'selectVaRadioOption');
  checkElAndFill('removalReason', 'selectVaRadioOption');
  checkElAndFill('stepchildFinancialSupport', 'selectVaRadioOption');

  checkElAndFill('endType', 'selectVaRadioOption');
  checkElAndFill('endAnnulmentOrVoidDescription', 'fillVaTextInput');
  checkElAndFill('endDate', 'fillVaMemorableDate');

  checkElAndFill('endOutsideUs', 'selectVaCheckbox');
  checkElAndFill('endCity', 'fillVaTextInput');
  checkElAndFill('endProvince', 'fillVaTextInput');
  checkElAndFill('endCountry', 'selectVaSelect');
  checkElAndFill('endState', 'selectVaSelect');

  checkElAndFill('isMilitary', 'selectVaCheckbox');
  checkElAndFill('country', 'selectVaSelect');
  checkElAndFill('street', 'fillVaTextInput');
  checkElAndFill('city', 'fillVaTextInput');
  checkElAndFill('state', 'selectVaSelect');
  checkElAndFill('postalCode', 'fillVaTextInput');

  checkElAndFill('whoDoesTheStepchildLiveWith.first', 'fillVaTextInput');
  checkElAndFill('whoDoesTheStepchildLiveWith.last', 'fillVaTextInput');

  cy.injectAxeThenAxeCheck();
};

/**
 * Helper to get the current dependent from picklist based on URL index param
 * @param {Object} data - The test data
 * @param {Function} callback - Callback function with dependent data
 * @returns {void}
 */
const processCurrentDependent = data => {
  return cy.location('search').then(search => {
    const urlParams = new URLSearchParams(search);
    const index = parseInt(urlParams.get('index') || '0', 10);
    const dependent = data[index];
    fillOutPicklistPage(dependent);
  });
};

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataSets: ['removal-only-v3'],
    fixtures: { data: path.join(__dirname, 'fixtures') },
    setupPerTest: () => {
      setupCypress();

      // Enable V3 feature toggle along with existing V2 toggles
      cy.intercept('GET', '/v0/feature_toggles?*', {
        data: {
          type: 'feature_toggles',
          features: [
            { name: 'vaDependentsV3', value: true },
            { name: 'va_dependents_v3', value: true },
            { name: 'vaDependentsNetWorthAndPension', value: false },
            { name: 'va_dependents_net_worth_and_pension', value: false },
          ],
        },
      });
    },

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.wait('@mockVaFileNumber');
          cy.clickStartForm();
        });
      },

      // V3 Picklist selection page
      'options-selection/remove-active-dependents': ({ afterHook }) => {
        afterHook(() => {
          // Only select 1 parent, 1 child, and 1 spouse for testing
          selectPicklistDependent('spousy-3332'); // spouse with marriage ended
          selectPicklistDependent('penny-3479'); // child who married
          // selectPicklistDependent('stacy-3233'); // child who is stepchild with financial support
          // selectPicklistDependent('jennifer-3311'); // child who is stepchild
          selectPicklistDependent('peter-0104'); // parent who died

          cy.clickFormContinue();
        });
      },

      // This pagehook is only called once for this 'remove-dependent' followup
      // page. The search parameter changes for each dependent and page, so we
      // need to get the search index param to figure out the dependent to
      // process. The processCurrentDependent helper looks for any expected
      // fields and fills them in, so we don't need to check the actual page
      // name
      'remove-dependent': ({ afterHook }) => {
        afterHook(() => {
          // TO DO: We should dynamically update all the child dependents date
          // of births in the "mock-dependents.json" file otherwise the reason
          // to remove options may not appear as expected; this current setup
          // will continue to work because Penny's age > 15 years old will
          // always show the marriage option
          cy.get('@testData').then(data => {
            const picklistData = data[PICKLIST_DATA] || [];
            // Spousy: reason to remove
            processCurrentDependent(picklistData);
            cy.get('va-button[continue]').click();

            // Spousy: marriage ended details
            processCurrentDependent(picklistData);
            cy.get('va-button[continue]').click();

            // Penny: stepchild question
            processCurrentDependent(picklistData);
            cy.get('va-button[continue]').click();

            // Penny: reason to remove
            processCurrentDependent(picklistData);
            cy.get('va-button[continue]').click();

            // Penny: marriage date
            processCurrentDependent(picklistData);
            cy.get('va-button[continue]').click();

            /*
            // Stacy: stepchild question
            processCurrentDependent(picklistData);
            cy.get('va-button[continue]').click();

            // Stacy: reason to remove
            processCurrentDependent(picklistData);
            cy.get('va-button[continue]').click();

            // Stacy: financial support question
            processCurrentDependent(picklistData);
            cy.get('va-button[continue]').click();

            // Stacy: left household date
            processCurrentDependent(picklistData);
            cy.get('va-button[continue]').click();

            // Jennifer: stepchild question
            processCurrentDependent(picklistData);
            cy.get('va-button[continue]').click();

            // Jennifer: reason to remove
            processCurrentDependent(picklistData);
            cy.get('va-button[continue]').click();

            // Jennifer: financial support question
            processCurrentDependent(picklistData);
            cy.get('va-button[continue]').click();

            // Jennifer: current address
            processCurrentDependent(picklistData);
            cy.get('va-button[continue]').click();

            // Jennifer: lives with
            processCurrentDependent(picklistData);
            cy.get('va-button[continue]').click();

            // Jennifer: left household date
            processCurrentDependent(picklistData);
            cy.get('va-button[continue]').click();
            */

            // Peter: reason to remove
            processCurrentDependent(picklistData);
            cy.get('va-button[continue]').click();

            // Peter: date of death
            processCurrentDependent(picklistData);
            cy.get('va-button[continue]').click();
          });
        });
      },

      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          signAndSubmit();
        });
      },
    },
    // skip: Cypress.env('CI'),
  },

  manifest,
  formConfig,
);

testForm(testConfig);
