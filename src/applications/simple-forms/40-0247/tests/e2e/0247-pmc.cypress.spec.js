import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import {
  fillAddressWebComponentPattern,
  fillTextWebComponent,
  reviewAndSubmitPageFlow,
} from '../../../shared/tests/e2e/helpers';
import featureToggles from '../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';

// disable custom scroll-n-focus to minimize interference with input-fills
formConfig.useCustomScrollAndFocus = false;

const v3StepHeaderSelector =
  'va-segmented-progress-bar[uswds][heading-text][header-level="2"]';
const awaitFocusSelectorThenTest = () => {
  // handle other scroll/focus interferences besides customScrollAndFocus
  return ({ afterHook }) => {
    cy.injectAxeThenAxeCheck();
    afterHook(() => {
      cy.get(v3StepHeaderSelector)
        .should('be.visible')
        .then(() => {
          // callback to prevent scroll/focus interferences, but
          // even now field-disabled errors still occur, so must wait a bit.
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(1000);
          cy.fillPage();
          cy.axeCheck();
          cy.findByText(/continue/i, { selector: 'button' }).click();
        });
    });
  };
};

const pagePaths = [
  'veteran-personal-information',
  'veteran-identification-information',
  'veteran-supporting-documentation',
  'request-type',
  'applicant-personal-information',
  'applicant-address',
  'applicant-contact-information',
  'certificates',
  'additional-certificates-yes-no',
  'additional-certificates-request',
];

const pageTestConfigs = pagePaths.reduce((obj, pagePath) => {
  return {
    ...obj,
    [pagePath]: awaitFocusSelectorThenTest(),
  };
}, {});

const testConfig = createTestConfig(
  {
    // automate all v3-web-component page-flows except
    // where addressUIs are used
    useWebComponentFields: true,
    dataPrefix: 'data',

    dataDir: path.join(__dirname, 'fixtures', 'data'),

    dataSets: ['test-data'],

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/start/i, { selector: 'a' })
            .first()
            .click();
        });
      },
      ...pageTestConfigs,
      'applicant-address': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.get(v3StepHeaderSelector)
              .should('be.visible')
              .then(() => {
                cy.get('[name="root_applicantAddress_state"]')
                  .should('not.have.attr', 'disabled')
                  .then(() => {
                    // callback to avoid field-disabled errors, but
                    // even now we must wait a bit!
                    // eslint-disable-next-line cypress/no-unnecessary-waiting
                    cy.wait(1000);
                    fillAddressWebComponentPattern(
                      'applicantAddress',
                      data.applicantAddress,
                    );

                    cy.axeCheck('.form-panel');
                    cy.findByText(/continue/i, { selector: 'button' }).click();
                  });
              });
          });
        });
      },
      'additional-certificates-request': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { additionalAddress, additionalCopies } = data;

            cy.get(v3StepHeaderSelector)
              .should('be.visible')
              .then(() => {
                cy.get('input[name="root_additionalAddress_state"]')
                  .should('not.be.disabled')
                  .then(() => {
                    // callback to avoid field-disabled errors, but
                    // even now we must wait a bit!
                    // eslint-disable-next-line cypress/no-unnecessary-waiting
                    cy.wait(1000);
                    fillAddressWebComponentPattern(
                      'additionalAddress',
                      additionalAddress,
                    );
                    fillTextWebComponent('additionalCopies', additionalCopies);

                    cy.axeCheck('.form-panel');
                    cy.findByText(/continue/i, { selector: 'button' }).click();
                  });
              });
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { applicantFullName } = data;

            reviewAndSubmitPageFlow(applicantFullName, 'Submit request');
          });
        });
      },
    },

    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept(formConfig.submitUrl, mockSubmit);
      cy.config('includeShadowDom', true);
    },
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
