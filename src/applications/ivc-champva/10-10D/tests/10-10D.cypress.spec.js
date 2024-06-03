import path from 'path';
import _ from 'lodash';

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
  verifyAllDataWasSubmitted,
} from '../../shared/tests/helpers';

// All pages from form config i.e.: {page1: {path: '/blah'}}
const ALL_PAGES = getAllPages(formConfig);

// disable custom scroll-n-focus to minimize interference with input-fills
formConfig.useCustomScrollAndFocus = false;

// Get current applicant index from URL (last value in URL is the index)
function getIdx(url) {
  const idx = Number(url.slice(-1));
  expect(Number.isNaN(idx)).to.be.false;
  return idx;
}

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'e2e', 'fixtures', 'data'),
    // Each dataset contains a `description` property that elaborates on what
    // is contained within.
    dataSets: [
      'maximal-test',
      'app-sa-cs-medab',
      'app-sd-cb-ohi',
      'cert-sd-spoused',
      'vet-2a-spouse-child-medabd-ohi',
      'test-data',
    ],
    arrayPages: [{ arrayPath: 'applicants', regex: /.*applicant.*/g }],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/start/i, { selector: 'a' })
            .first()
            .click();
        });
      },
      [ALL_PAGES.page3.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillAddressWebComponentPattern(
              'certifierAddress',
              data.certifierAddress,
            );
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
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
      [ALL_PAGES.page10b1.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillAddressWebComponentPattern(
              'sponsorAddress',
              data.sponsorAddress,
            );
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
            const numApps = data.applicants.length;
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < numApps; i++) {
              fillFullNameWebComponentPattern(
                `applicants_${i}_applicantName`,
                data.applicants[i].applicantName,
              );
              fillDateWebComponentPattern(
                `applicants_${i}_applicantDOB`,
                data.applicants[i].applicantDOB,
              );
              // Add another if we're not out of applicants:
              if (i < numApps - 1)
                cy.findByText(/Add another applicant/i, {
                  selector: 'button',
                }).click();
            }
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [ALL_PAGES.page14.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.url().then(url => {
              fillTextWebComponent(
                'applicantSSN_ssn',
                data.applicants[getIdx(url)].applicantSSN.ssn,
              );
            });
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [ALL_PAGES.page15a.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(() => {
            cy.get('select').select(1);
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [ALL_PAGES.page15.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.url().then(url => {
              fillAddressWebComponentPattern(
                'applicantAddress',
                data.applicants[getIdx(url)].applicantAddress,
              );
            });
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [ALL_PAGES.page16.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.url().then(url => {
              fillTextWebComponent(
                'applicantPhone',
                data.applicants[getIdx(url)].applicantPhone,
              );
            });
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [ALL_PAGES.page17.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.url().then(url => {
              selectRadioWebComponent(
                'applicantGender',
                data.applicants[getIdx(url)].applicantGender.gender,
              );
            });
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [ALL_PAGES.page18.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.url().then(url => {
              selectRadioWebComponent(
                'applicantRelationshipToSponsor',
                data.applicants[getIdx(url)].applicantRelationshipToSponsor
                  .relationshipToVeteran,
              );
              cy.fillVaTextInput(
                `other-relationship-description`,
                data.applicants[getIdx(url)].applicantRelationshipToSponsor
                  .otherRelationshipToVeteran,
              );
            });
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [ALL_PAGES.page18c.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.url().then(url => {
              selectRadioWebComponent(
                'applicantRelationshipOrigin',
                data.applicants[getIdx(url)].applicantRelationshipOrigin
                  .relationshipToVeteran,
              );
            });
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [ALL_PAGES.page18b1.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.url().then(url => {
              selectRadioWebComponent(
                'applicantDependentStatus',
                data.applicants[getIdx(url)].applicantDependentStatus.status,
              );
            });
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [ALL_PAGES.page18f1.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.url().then(url => {
              selectRadioWebComponent(
                'applicantSponsorMarriageDetails',
                data.applicants[getIdx(url)].applicantSponsorMarriageDetails
                  .relationshipToVeteran,
              );
            });
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [ALL_PAGES.page18f3.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.url().then(url => {
              fillDateWebComponentPattern(
                'dateOfMarriageToSponsor',
                data.applicants[getIdx(url)].dateOfMarriageToSponsor,
              );
            });
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [ALL_PAGES.page18f6.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.url().then(url => {
              fillDateWebComponentPattern(
                'dateOfMarriageToSponsor',
                data.applicants[getIdx(url)].dateOfMarriageToSponsor,
              );
              fillDateWebComponentPattern(
                'dateOfSeparationFromSponsor',
                data.applicants[getIdx(url)].dateOfSeparationFromSponsor,
              );
            });
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [ALL_PAGES.page19.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.url().then(url => {
              selectRadioWebComponent(
                'applicantMedicareStatus',
                data.applicants[getIdx(url)].applicantMedicareStatus
                  .eligibility,
              );
            });
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [ALL_PAGES.page20.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.url().then(url => {
              selectRadioWebComponent(
                'applicantMedicarePartD',
                data.applicants[getIdx(url)].applicantMedicarePartD.enrollment,
              );
            });
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [ALL_PAGES.page21.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.url().then(url => {
              selectRadioWebComponent(
                'applicantHasOhi',
                data.applicants[getIdx(url)].applicantHasOhi.hasOhi,
              );
            });
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
            const sig = _.get(
              data,
              formConfig.preSubmitInfo.statementOfTruth.fullNamePath(data),
            );
            reviewAndSubmitPageFlow(sig);
          });
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('POST', formConfig.submitUrl, req => {
        cy.get('@testData').then(data => {
          verifyAllDataWasSubmitted(data, req.body.raw_data);
        });
        // Mock response
        req.reply({ status: 200 });
      });
      cy.config('includeShadowDom', true);
      cy.config('retries', { runMode: 0 });
    },
    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
