import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import {
  fillAddressWebComponentPattern,
  fillDateWebComponentPattern,
  selectYesNoWebComponent,
} from '../../../shared/tests/e2e/helpers';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import featureToggles from './fixtures/mocks/featureToggles.json';
import user from './fixtures/mocks/user.json';

// mock logged in LOA3 user
const userLOA3 = {
  ...user,
  data: {
    ...user.data,
    attributes: {
      ...user.data.attributes,
      login: {
        currentlyLoggedIn: true,
      },
      profile: {
        ...user.data.attributes.profile,
        loa: {
          current: 3,
        },
      },
    },
  },
};

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,

    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    dataSets: ['veteran'],

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/^Start/, { selector: 'a[href="#start"]' })
            .last()
            .click();
        });
      },
      'living-situation': ({ afterHook }) => {
        afterHook(() => {
          cy.selectVaCheckbox('root_livingSituation_NONE', true);
          cy.findAllByText(/^Continue/, { selector: 'button' })
            .last()
            .click();
        });
      },
      'mailing-address': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.get(
              'va-segmented-progress-bar[uswds][heading-text][header-level="2"]',
            )
              .should('be.visible')
              .then(() => {
                cy.get('[name="root_mailingAddress_state"]')
                  .should('not.have.attr', 'disabled')
                  .then(() => {
                    // callback to avoid field-disabled errors, but
                    // even now we must wait a bit!
                    // eslint-disable-next-line cypress/no-unnecessary-waiting
                    cy.wait(1000);
                    fillAddressWebComponentPattern(
                      'mailingAddress',
                      data.mailingAddress,
                    );

                    cy.axeCheck('.form-panel');
                    cy.findByText(/continue/i, { selector: 'button' }).click();
                  });
              });
          });
        });
      },
      'other-reasons': ({ afterHook }) => {
        afterHook(() => {
          cy.selectVaCheckbox('root_otherReasons_FINANCIAL_HARDSHIP', true);
          cy.findAllByText(/^Continue/, { selector: 'button' })
            .last()
            .click();
        });
      },
      'evidence-pow': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const {
              powConfinementStartDate,
              powConfinementEndDate,
              powMultipleConfinements,
            } = data;
            fillDateWebComponentPattern(
              'powConfinementStartDate',
              powConfinementStartDate,
            );
            fillDateWebComponentPattern(
              'powConfinementEndDate',
              powConfinementEndDate,
            );
            selectYesNoWebComponent(
              'powMultipleConfinements',
              powMultipleConfinements,
            );
          });
        });
      },
    },

    setupPerTest: () => {
      cy.intercept('/v0/api', { status: 200 });
      cy.intercept('/v0/feature_toggles', featureToggles);
      cy.login(userLOA3);
    },

    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
