import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import featureToggles from '../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import {
  conditionallySelectCheckboxWebComponent,
  fillDateWebComponent,
  fillTextAreaWebComponent,
  fillTextWebComponent,
  selectDropdownWebComponent,
  selectRadioWebComponent,
} from './helpers';

const formChapters = formConfig.chapters;

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    // dataSets: ['minimal-test', 'maximal-test'],
    dataSets: ['minimal-test'],
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/start/i, { selector: 'button' });
          cy.findAllByText(/without signing in/i)
            .first()
            .click({ force: true });
        });
      },
      [formChapters.preparerPersonalInformationChapter.pages
        .preparerPersonalInformation.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextWebComponent(
              'root_preparerName_first',
              data.preparerName.first,
            );
            fillTextWebComponent(
              'root_preparerName_middle',
              data.preparerName?.middle,
            );
            fillTextWebComponent(
              'root_preparerName_last',
              data.preparerName.last,
            );

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [formChapters.relationshipToDeceasedClaimantChapter.pages
        .relationshipToDeceasedClaimant.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectRadioWebComponent(
              'root_relationshipToDeceasedClaimant',
              data.relationshipToDeceasedClaimant,
            );

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [formChapters.relationshipToDeceasedClaimantChapter.pages
        .otherRelationshipToDeceasedClaimant.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextWebComponent(
              'root_otherRelationshipToDeceasedClaimant',
              data.otherRelationshipToDeceasedClaimant,
            );

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [formChapters.preparerIdentificationInformationChapter.pages
        .preparerIdentificationInformation.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextWebComponent('root_preparerSsn', data.preparerSsn);

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [formChapters.preparerAddressChapter.pages.preparerAddress.path]: ({
        afterHook,
      }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            conditionallySelectCheckboxWebComponent(
              'root_preparerAddress_isMilitary',
              data.preparerAddress.isMilitary,
            );

            selectDropdownWebComponent(
              'root_preparerAddress_country',
              data.preparerAddress.country,
            );
            fillTextWebComponent(
              'root_preparerAddress_street',
              data.preparerAddress.street,
            );
            fillTextWebComponent(
              'root_preparerAddress_street2',
              data.preparerAddress.street2,
            );
            fillTextWebComponent(
              'root_preparerAddress_street3',
              data.preparerAddress.street3,
            );
            fillTextWebComponent(
              'root_preparerAddress_city',
              data.preparerAddress.city,
            );
            selectDropdownWebComponent(
              'root_preparerAddress_state',
              data.preparerAddress.state,
            );
            fillTextWebComponent(
              'root_preparerAddress_postalCode',
              data.preparerAddress.postalCode,
            );

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [formChapters.preparerContactInformationChapter.pages
        .preparerContactInformation.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextWebComponent(
              'root_preparerHomePhone',
              data.preparerHomePhone,
            );
            fillTextWebComponent(
              'root_preparerMobilePhone',
              data.preparerMobilePhone,
            );
            fillTextWebComponent('root_preparerEmail', data.preparerEmail);

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [formChapters.veteranPersonalInformationChapter.pages
        .veteranPersonalInformation.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextWebComponent(
              'root_veteranFullName_first',
              data.veteranFullName.first,
            );
            fillTextWebComponent(
              'root_veteranFullName_middle',
              data.veteranFullName.middle,
            );
            fillTextWebComponent(
              'root_veteranFullName_last',
              data.veteranFullName.last,
            );
            fillDateWebComponent(
              'root_veteranDateOfBirth',
              data.veteranDateOfBirth,
            );
            fillDateWebComponent(
              'root_veteranDateOfDeath',
              data.veteranDateOfDeath,
            );

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [formChapters.veteranIdentificationInformationChapter.pages
        .veteranIdentificationInformation.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextWebComponent('root_veteranSsn', data.veteranSsn);
            fillTextWebComponent(
              'root_veteranVaFileNumber',
              data.veteranVaFileNumber,
            );

            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [formChapters.additionalInformationChapter.pages.additionalInformation
        .path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextAreaWebComponent(
              'root_additionalInformation',
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
            cy.get('#veteran-signature')
              .shadow()
              .find('input')
              .first()
              .type(
                signerName.middle
                  ? `${signerName.first} ${signerName.middle} ${
                      signerName.last
                    }`
                  : `${signerName.first} ${signerName.last}`,
              );
            cy.get(`input[name="veteran-certify"]`).check();
            cy.findAllByText(/Submit application/i, {
              selector: 'button',
            }).click();
          });
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);
    },
    skip: false,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
