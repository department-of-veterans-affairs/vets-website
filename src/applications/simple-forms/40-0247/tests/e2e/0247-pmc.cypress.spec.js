import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import {
  fillAddressWebComponentPattern,
  fillDateWebComponentPattern,
  fillFullNameWebComponentPattern,
  fillTextWebComponent,
  reviewAndSubmitPageFlow,
  selectYesNoWebComponent,
} from '../../../shared/tests/e2e/helpers';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';

formConfig.useCustomScrollAndFocus = false;

const awaitFocusSelectorThenTest = () => {
  return ({ afterHook }) => {
    cy.injectAxeThenAxeCheck();
    afterHook(() => {
      cy.get('va-segmented-progress-bar[uswds][heading-text][header-level="2"]')
        .should('be.visible')
        .then(() => {
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(250);
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
      'veteran-personal-information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const {
              veteranFullName,
              veteranDateOfBirth,
              veteranDateOfDeath,
            } = data;

            cy.get('input[name="root_veteranFullName_first"]')
              .should('not.have.attr', 'disabled')
              .then(() => {
                fillFullNameWebComponentPattern(
                  'veteranFullName',
                  veteranFullName,
                );
                fillDateWebComponentPattern(
                  'veteranDateOfBirth',
                  veteranDateOfBirth,
                );
                fillDateWebComponentPattern(
                  'veteranDateOfDeath',
                  veteranDateOfDeath,
                );

                cy.axeCheck('.form-panel');
                cy.findByText(/continue/i, { selector: 'button' }).click();
              });
          });
        });
      },
      'veteran-identification-information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.get('input[name="root_veteranId_ssn"]')
              .should('not.have.attr', 'disabled')
              .then(() => {
                // eslint-disable-next-line cypress/no-unnecessary-waiting
                cy.wait(250);
                fillTextWebComponent('veteranId_ssn', data.veteranId.ssn);

                cy.axeCheck('.form-panel');
                cy.findByText(/continue/i, { selector: 'button' }).click();
              });
          });
        });
      },
      'request-type': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectYesNoWebComponent('isFirstRequest', data.isFirstRequest);

            cy.axeCheck('.form-panel');
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'applicant-personal-information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.get('input[name="root_applicantFullName_first"]')
              .should('not.have.attr', 'disabled')
              .then(() => {
                // eslint-disable-next-line cypress/no-unnecessary-waiting
                cy.wait(250);
                fillFullNameWebComponentPattern(
                  'applicantFullName',
                  data.applicantFullName,
                );

                cy.axeCheck('.form-panel');
                cy.findByText(/continue/i, { selector: 'button' }).click();
              });
          });
        });
      },
      'applicant-address': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillAddressWebComponentPattern(
              'applicantAddress',
              data.applicantAddress,
            );

            cy.axeCheck('.form-panel');
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'applicant-contact-information': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.get('input[name="root_applicantPhone"]')
              .should('not.have.attr', 'disabled')
              .then(() => {
                // eslint-disable-next-line cypress/no-unnecessary-waiting
                cy.wait(250);
                fillTextWebComponent('applicantPhone', data.applicantPhone);

                cy.axeCheck('.form-panel');
                cy.findByText(/continue/i, { selector: 'button' }).click();
              });
          });
        });
      },
      certificates: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.get('input[name="root_certificates"]')
              .should('not.have.attr', 'disabled')
              .then(() => {
                // eslint-disable-next-line cypress/no-unnecessary-waiting
                cy.wait(250);
                fillTextWebComponent('certificates', data.certificates);

                cy.axeCheck('.form-panel');
                cy.findByText(/continue/i, { selector: 'button' }).click();
              });
          });
        });
      },
      'additional-certificates-request': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { additionalAddress, additionalCopies } = data;

            fillAddressWebComponentPattern(
              'additionalAddress',
              additionalAddress,
            );
            fillTextWebComponent('additionalCopies', additionalCopies);

            cy.axeCheck('.form-panel');
            cy.findByText(/continue/i, { selector: 'button' }).click();
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
      cy.intercept(formConfig.submitUrl, mockSubmit);
      cy.config('includeShadowDom', true);
    },

    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
