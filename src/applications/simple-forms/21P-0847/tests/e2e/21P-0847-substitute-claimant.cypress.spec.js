import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import featureToggles from '../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';
import user from './fixtures/mocks/user.json';
import {
  fillDateWebComponentPattern,
  fillFullNameWebComponentPattern,
  fillTextAreaWebComponent,
  fillTextWebComponent,
  reviewAndSubmitPageFlow,
  selectRelationshipToVeteranPattern,
} from '../../../shared/tests/e2e/helpers';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';

import pagePaths from './pagePaths';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['minimal-test', 'maximal-test'],
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          // User is logged in, so we can start the form directly
          cy.findAllByText(/start/i, { selector: 'a' })
            .first()
            .click();
        });
      },
      [pagePaths.preparerPersonalInfo]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillFullNameWebComponentPattern('preparerName', data.preparerName);

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [pagePaths.preparerIdentificationInformation]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextWebComponent('preparerSsn', data.preparerSsn);

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [pagePaths.preparerAddress]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillAddressWebComponentPattern(
              'preparerAddress',
              data.preparerAddress,
            );

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [pagePaths.preparerContactInformation]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextWebComponent('preparerHomePhone', data.preparerHomePhone);
            fillTextWebComponent(
              'preparerMobilePhone',
              data.preparerMobilePhone,
            );
            fillTextWebComponent('preparerEmail', data.preparerEmail);

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [pagePaths.deceasedClaimantPersonalInformation]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillFullNameWebComponentPattern(
              'deceasedClaimantFullName',
              data.deceasedClaimantFullName,
            );
            fillDateWebComponentPattern(
              'deceasedClaimantDateOfDeath',
              data.deceasedClaimantDateOfDeath,
            );

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [pagePaths.relationshipToDeceasedClaimant]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectRelationshipToVeteranPattern(
              'relationshipToDeceasedClaimant',
              data.relationshipToDeceasedClaimant,
            );

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [pagePaths.veteranIdentificationInformation]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextWebComponent('veteranSsn', data.veteranSsn);
            fillDateWebComponentPattern(
              'veteranDateOfBirth',
              data.veteranDateOfBirth,
            );
            fillTextWebComponent(
              'veteranVaFileNumber',
              data.veteranVaFileNumber,
            );

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [pagePaths.additionalInformation]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextAreaWebComponent(
              'additionalInformation',
              data.additionalInformation,
            );

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const signerName = data.preparerName;
            reviewAndSubmitPageFlow(signerName);
          });
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept('GET', '/v0/user', user);
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);
      cy.login(user);
    },
    skip: false,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
