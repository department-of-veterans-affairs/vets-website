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
  getAllPages,
  verifyAllDataWasSubmitted,
} from '../../shared/tests/helpers';

import mockFeatureToggles from './e2e/fixtures/mocks/featureToggles.json';

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
            cy.fillAddressWebComponentPattern(
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
            fillDateWebComponentPattern('sponsorDob', data.sponsorDob);
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [ALL_PAGES.page10b1.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillAddressWebComponentPattern(
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
      [ALL_PAGES.page10b0.path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(() => {
            cy.get('select').select(1);
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
                `applicants_${i}_applicantDob`,
                data.applicants[i].applicantDob,
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
                'applicantSSN',
                data.applicants[getIdx(url)].applicantSSN,
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
              cy.fillAddressWebComponentPattern(
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
      cy.intercept('GET', '/v0/feature_toggles?*', mockFeatureToggles);

      cy.intercept('POST', formConfig.submitUrl, req => {
        cy.get('@testData').then(data => {
          verifyAllDataWasSubmitted(data, req.body.rawData);
        });
        // Mock response
        req.reply({ status: 200 });
      });
      cy.config('includeShadowDom', true);
      cy.config('retries', { runMode: 0 });
    },
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
