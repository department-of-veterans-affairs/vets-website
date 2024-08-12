import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import {
  fillAddressWebComponentPattern,
  fillDateWebComponentPattern,
  fillTextWebComponent,
  reviewAndSubmitPageFlow,
  selectYesNoWebComponent,
} from '../../../shared/tests/e2e/helpers';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import featureToggles from './fixtures/mocks/featureToggles.json';
import user from './fixtures/mocks/user.json';
import sipPut from './fixtures/mocks/sip-put.json';
import sipGet from './fixtures/mocks/sip-get.json';
import { statementOfTruthFullNamePath } from '../../helpers';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';

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

// tracks if already added list and loop item
let addedListAndLoopItem = false;

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
      'veteran-mailing-address': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillAddressWebComponentPattern(
              'veteranMailingAddress',
              data.veteranMailingAddress,
            );
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'other-reasons': ({ afterHook }) => {
        afterHook(() => {
          cy.selectVaCheckbox('root_otherReasons_FINANCIAL_HARDSHIP', true);
          cy.axeCheck('.form-panel');
          cy.findAllByText(/^Continue/, { selector: 'button' })
            .last()
            .click();
        });
      },
      'medical-treatments': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            let hasReceivedMedicalTreatment =
              data['view:hasReceivedMedicalTreatment'];
            if (addedListAndLoopItem) {
              hasReceivedMedicalTreatment = false;
              addedListAndLoopItem = false;
            }

            selectYesNoWebComponent(
              'view:hasReceivedMedicalTreatment',
              hasReceivedMedicalTreatment,
            );

            cy.findAllByText(/^Continue/, { selector: 'button' })
              .last()
              .click();
          });
        });
      },
      'medical-treatments/0/name-and-address': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { medicalTreatments } = data;
            const { facilityName, facilityAddress } = medicalTreatments[0];

            fillTextWebComponent('facilityName', facilityName);
            fillAddressWebComponentPattern('facilityAddress', facilityAddress);

            cy.findAllByText(/^Continue/, { selector: 'button' })
              .last()
              .click();
          });
        });
      },
      'medical-treatments/0/treatment-date': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { medicalTreatments } = data;
            const { startDate } = medicalTreatments[0];

            fillDateWebComponentPattern('startDate', startDate);

            addedListAndLoopItem = true;

            cy.findAllByText(/^Continue/, { selector: 'button' })
              .last()
              .click();
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const fullNamePath = statementOfTruthFullNamePath({
              formData: data,
            });
            reviewAndSubmitPageFlow(data[fullNamePath], 'Submit application');
          });
        });
      },
    },

    setupPerTest: () => {
      cy.intercept('/v0/api', { status: 200 });
      cy.intercept('/v0/feature_toggles*', featureToggles);
      cy.intercept('PUT', '/v0/in_progress_forms/20-10207', sipPut);
      cy.intercept('GET', '/v0/in_progress_forms/20-10207', sipGet);
      cy.intercept(formConfig.submitUrl, mockSubmit);
      cy.login(userLOA3);
    },

    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    // skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
