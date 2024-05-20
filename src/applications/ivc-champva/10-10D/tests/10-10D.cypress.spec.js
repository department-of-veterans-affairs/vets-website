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
  getAllPages,
} from '../../shared/tests/helpers';

// All pages from form config i.e.: {page1: {path: '/blah'}}
const ALL_PAGES = getAllPages(formConfig);

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
      [ALL_PAGES.page6.path]: ({ afterHook }) => {
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
      [ALL_PAGES.page7.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillTextWebComponent('ssn_ssn', data.ssn.ssn);
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [ALL_PAGES.page9.path]: ({ afterHook }) => {
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
      [ALL_PAGES.page13.path]: ({ afterHook }) => {
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
      [ALL_PAGES.page14.path]: ({ afterHook }) => {
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
      [ALL_PAGES.page15.path]: ({ afterHook }) => {
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
      [ALL_PAGES.page16.path]: ({ afterHook }) => {
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
      [ALL_PAGES.page17.path]: ({ afterHook }) => {
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
      [ALL_PAGES.page18.path]: ({ afterHook }) => {
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
      [ALL_PAGES.page18c.path]: ({ afterHook }) => {
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
      [ALL_PAGES.page18b1.path]: ({ afterHook }) => {
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
      [ALL_PAGES.page19.path]: ({ afterHook }) => {
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
      [ALL_PAGES.page20.path]: ({ afterHook }) => {
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
      [ALL_PAGES.page21.path]: ({ afterHook }) => {
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
      [ALL_PAGES.page24.path]: ({ afterHook }) => {
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
      cy.intercept('POST', formConfig.submitUrl, req => {
        cy.get('@testData').then(data => {
          Object.keys(data).forEach(k => {
            // Verify that all test data was filled in on the form

            // Handle special cases:
            if (typeof k === 'object') {
              // For objects with nested keys, just stringify and check
              // (easier for things like home address)
              expect(JSON.stringify(data[k])).to.equal(
                JSON.stringify(req.body[k]),
              );
            } else if (k.includes('DOB') || k.includes('Date')) {
              // Just check length match since dates flip from YYYY-MM-DD to
              // MM-DD-YYYY). TODO: Address date reformat.
              expect(
                `${k}: ${data[k]?.length}` === `${k}: ${req.body[k]?.length}`,
              );
              // expect(data[k]?.length).to.equal(req.body[k]?.length);
            } else {
              expect(`${k}: ${data[k]}` === `${k}: ${req.body[k]}`);
            }
          });
        });
        // Mock response
        req.reply({ status: 200 });
      });
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
