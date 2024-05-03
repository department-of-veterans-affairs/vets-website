import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../config/form';
import manifest from '../manifest.json';

import {
  selectYesNoWebComponent,
  selectRadioWebComponent,
  fillTextWebComponent,
  fillFullNameWebComponentPattern,
  reviewAndSubmitPageFlow,
  fillDateWebComponentPattern,
  fillAddressWebComponentPattern,
} from '../../shared/tests/helpers';

// disable custom scroll-n-focus to minimize interference with input-fills
formConfig.useCustomScrollAndFocus = false;

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'e2e', 'fixtures', 'data'),
    // Rename and modify the test data as needed.
    dataSets: ['test-data'],
    arrayPages: [{ arrayPath: 'applicants', regex: /.*applicant.*/g }],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/start/i, { selector: 'a' })
            .first()
            .click();
        });
      },
      'sponsor-information': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillFullNameWebComponentPattern(
              'veteransFullName',
              data.veteransFullName,
            );
            fillDateWebComponentPattern('sponsorDOB', data.sponsorDOB);
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'sponsor-identification-information': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextWebComponent('ssn_ssn', data.ssn.ssn);
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'sponsor-status-date': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillDateWebComponentPattern('sponsorDOD', data.sponsorDOD);
            selectYesNoWebComponent(
              'sponsorDeathConditions',
              data.sponsorDeathConditions,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'applicant-information': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillFullNameWebComponentPattern(
              'applicants_0_applicantName',
              data.applicants[0].applicantName,
            );
            fillDateWebComponentPattern(
              'applicants_0_applicantDOB',
              data.applicants[0].applicantDOB,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'applicant-identification-information/:index': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextWebComponent(
              'applicantSSN_ssn',
              data.applicants[0].applicantSSN.ssn,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'applicant-mailing-address/:index': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillAddressWebComponentPattern(
              'applicantAddress',
              data.applicants[0].applicantAddress,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'applicant-contact-information/:index': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextWebComponent(
              'applicantPhone',
              data.applicants[0].applicantPhone,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'applicant-gender/:index': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectRadioWebComponent(
              'applicantGender',
              data.applicants[0].applicantGender.gender,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'applicant-sponsor-relationship/:index': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectRadioWebComponent(
              'applicantRelationshipToSponsor',
              data.applicants[0].applicantRelationshipToSponsor
                .relationshipToVeteran,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'applicant-child-relationship/:index': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectRadioWebComponent(
              'applicantRelationshipOrigin',
              data.applicants[0].applicantRelationshipOrigin
                .relationshipToVeteran,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'applicant-child-age/:index': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectRadioWebComponent(
              'applicantDependentStatus',
              data.applicants[0].applicantDependentStatus.status,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'applicant-medicare/:index': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectRadioWebComponent(
              'applicantMedicareStatus',
              data.applicants[0].applicantMedicareStatus.eligibility,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'applicant-medicare-continued/:index': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectRadioWebComponent(
              'applicantMedicarePartD',
              data.applicants[0].applicantMedicarePartD.enrollment,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'applicant-other-insurance-status/:index': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectRadioWebComponent(
              'applicantHasOhi',
              data.applicants[0].applicantHasOhi.hasOhi,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'consent-mail': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.selectVaCheckbox(
              `consent-checkbox`,
              data.consentToMailMissingRequiredFiles,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            reviewAndSubmitPageFlow(data.applicants[0].applicantName);
          });
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('POST', formConfig.submitUrl, { status: 200 });
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
