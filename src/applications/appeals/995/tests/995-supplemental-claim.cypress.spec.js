import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import { setStoredSubTask } from 'platform/forms/sub-task';

import formConfig from '../config/form';
import manifest from '../manifest.json';
import { getPastItf, fetchItf } from './995.cypress.helpers';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockPrefill from './fixtures/mocks/prefill.json';
import mockSubmit from './fixtures/mocks/application-submit.json';
import mockUpload from './fixtures/mocks/mockUpload.json';

import {
  CONTESTABLE_ISSUES_API,
  EVIDENCE_UPLOAD_API,
  PRIMARY_PHONE,
  BASE_URL,
  EVIDENCE_VA_PATH,
  EVIDENCE_PRIVATE_REQUEST,
  EVIDENCE_PRIVATE_PATH,
  EVIDENCE_LIMITATION_PATH,
  EVIDENCE_PRIVATE,
  EVIDENCE_UPLOAD_PATH,
} from '../constants';

import cypressSetup from '../../shared/tests/cypress.setup';
import {
  mockContestableIssues,
  mockContestableIssuesWithLegacyAppeals,
  getRandomDate,
} from '../../shared/tests/cypress.helpers';
import { CONTESTABLE_ISSUES_PATH, SELECTED } from '../../shared/constants';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    // dataDir: path.join(__dirname, 'data'),

    // Rename and modify the test data as needed.
    dataSets: ['no-evidence-test', 'minimal-test', 'maximal-test'],

    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
      mocks: path.join(__dirname, 'fixtures', 'mocks'),
    },

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          // Hit the start action link
          cy.findAllByText(/start your claim/i, { selector: 'a' })
            .first()
            .click();
        });
      },
      'veteran-information': () => {
        getPastItf(cy);
        cy.findByText('Continue', { selector: 'button' }).click();
      },
      'primary-phone-number': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(testData => {
            cy.selectRadio('primary', testData[PRIMARY_PHONE] || 'home');
            cy.findByText('Continue', { selector: 'button' }).click();
          });
        });
      },
      [CONTESTABLE_ISSUES_PATH]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(testData => {
            cy.findByText('Continue', { selector: 'button' }).click();
            // prevent continuing without any issues selected
            cy.location('pathname').should(
              'eq',
              `${BASE_URL}/${CONTESTABLE_ISSUES_PATH}`,
            );
            cy.get('va-alert[status="error"] h3').should(
              'contain',
              'You’ll need to select an issue',
            );

            testData.additionalIssues?.forEach(additionalIssue => {
              if (additionalIssue.issue && additionalIssue[SELECTED]) {
                cy.get('.add-new-issue').click();
                cy.url().should('include', `${BASE_URL}/add-issue?index=`);
                cy.axeCheck();
                if (navigator.userAgent.includes('Chrome')) {
                  cy.get('#issue-name')
                    .shadow()
                    .find('input')
                    .focus()
                    .realType(additionalIssue.issue);
                } else {
                  cy.get('#issue-name')
                    .shadow()
                    .find('input')
                    .type(additionalIssue.issue);
                }
                cy.fillDate('decision-date', getRandomDate());
                cy.get('#submit').click();
              }
            });
            testData.contestedIssues.forEach(issue => {
              if (issue[SELECTED]) {
                cy.get(
                  `h4:contains("${issue.attributes.ratingIssueSubjectText}")`,
                )
                  .closest('li')
                  .find('input[type="checkbox"]')
                  .click({ force: true });
              }
            });
            cy.findByText('Continue', { selector: 'button' }).click();
          });
        });
      },
      'notice-of-evidence-needed': ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(({ form5103Acknowledged }) => {
            if (form5103Acknowledged) {
              cy.get('va-checkbox')
                .shadow()
                .find('input')
                .click({ force: true });
            }
            cy.findByText('Continue', { selector: 'button' }).click();
          });
        });
      },
      [EVIDENCE_VA_PATH]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(({ locations = [] }) => {
            locations.forEach((location, index) => {
              if (location) {
                if (index > 0) {
                  cy.url().should('include', `index=${index}`);
                }
                if (navigator.userAgent.includes('Chrome')) {
                  // using realType to hopefully fix the input fields appear to
                  // be disabled in CI causing the stress test to fail
                  cy.get('#add-location-name')
                    .shadow()
                    .find('input')
                    .focus()
                    .realType(location.locationAndName);
                } else {
                  cy.get('#add-location-name')
                    .shadow()
                    .find('input')
                    .type(location.locationAndName);
                }
                location?.issues.forEach(issue => {
                  cy.get(`va-checkbox[value="${issue}"]`)
                    .shadow()
                    .find('input')
                    .check({ force: true });
                });
                cy.fillDate('from', location.evidenceDates?.from);
                cy.fillDate('to', location.evidenceDates?.to);
                cy.axeCheck();

                // Add another
                if (index + 1 < locations.length) {
                  cy.get('.vads-c-action-link--green').click();
                }
              }
            });
            cy.get('va-button-pair')
              .shadow()
              .find('va-button[continue]')
              .click();
          });
        });
      },
      [EVIDENCE_PRIVATE_REQUEST]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            const hasPrivate = data[EVIDENCE_PRIVATE];
            cy.get(
              `va-radio-option[value="${hasPrivate ? 'y' : 'n'}"]`,
            ).click();
            cy.findByText('Continue', { selector: 'button' }).click();
          });
        });
      },
      'supporting-evidence/private-medical-records-authorization': ({
        afterHook,
      }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            if (data.privacyAgreementAccepted) {
              cy.get('va-checkbox')
                .shadow()
                .find('input')
                .click({ force: true });
            }
            cy.findByText('Continue', { selector: 'button' }).click();
          });
        });
      },
      [EVIDENCE_PRIVATE_PATH]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(({ providerFacility = [] }) => {
            providerFacility.forEach((facility, index) => {
              if (facility) {
                if (index > 0) {
                  cy.url().should('include', `index=${index}`);
                }
                cy.get('#add-facility-name')
                  .shadow()
                  .find('input')
                  .focus(); // Try focusing first

                cy.get('#add-facility-name')
                  .shadow()
                  .find('input')
                  .type(facility.providerFacilityName);

                cy.get('#country')
                  .shadow()
                  .find('select')
                  .select(facility.providerFacilityAddress.country);
                cy.get('#street')
                  .shadow()
                  .find('input')
                  .type(facility.providerFacilityAddress.street);
                if (facility.street2) {
                  cy.get('#street2')
                    .shadow()
                    .find('input')
                    .type(facility.providerFacilityAddress.street2);
                }
                cy.get('#city')
                  .shadow()
                  .find('input')
                  .type(facility.providerFacilityAddress.city);
                if (facility.providerFacilityAddress.country === 'USA') {
                  cy.get('#state')
                    .shadow()
                    .find('select')
                    .select(facility.providerFacilityAddress.state);
                } else {
                  cy.get('#state')
                    .shadow()
                    .find('input')
                    .type(facility.providerFacilityAddress.state);
                }
                cy.get('#postal')
                  .shadow()
                  .find('input')
                  .type(facility.providerFacilityAddress.postalCode);

                facility?.issues.forEach(issue => {
                  cy.get(`va-checkbox[value="${issue}"]`)
                    .shadow()
                    .find('input')
                    .check({ force: true });
                });
                cy.fillDate('from', facility.treatmentDateRange?.from);
                cy.fillDate('to', facility.treatmentDateRange?.to);
                cy.axeCheck();

                // Add another
                if (index + 1 < providerFacility.length) {
                  cy.get('.vads-c-action-link--green').click();
                }
              }
            });
            cy.findByText('Continue', { selector: 'button' }).click();
          });
        });
      },
      [EVIDENCE_LIMITATION_PATH]: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.injectAxeThenAxeCheck();
            if (data.limitedConsent) {
              cy.get('va-textarea')
                .shadow()
                .find('textarea')
                .type(data.limitedConsent);
            }
            cy.findByText('Continue', { selector: 'button' }).click();
          });
        });
      },
      [EVIDENCE_UPLOAD_PATH]: () => {
        cy.get('input[type="file"]')
          .upload(
            path.join(__dirname, 'fixtures/data/example-upload.pdf'),
            'testing',
          )
          .get('.schemaform-file-uploading')
          .should('not.exist');
        cy.get('select').select('Buddy/Lay Statement');
      },
    },

    setupPerTest: () => {
      cypressSetup();

      setStoredSubTask({ benefitType: 'compensation' });

      cy.intercept('POST', EVIDENCE_UPLOAD_API, mockUpload);
      cy.intercept('GET', '/v0/intent_to_file', fetchItf());

      // Include legacy appeals to mock data for maximal test
      const dataSet = Cypress.currentTest.titlePath[1];
      cy.intercept(
        'GET',
        `/v1${CONTESTABLE_ISSUES_API}compensation`,
        dataSet === 'maximal-test'
          ? mockContestableIssuesWithLegacyAppeals
          : mockContestableIssues,
      );

      cy.intercept('POST', '/v1/supplemental_claims', mockSubmit);

      cy.get('@testData').then(() => {
        cy.intercept('GET', '/v0/in_progress_forms/20-0995', mockPrefill);
        cy.intercept('PUT', '/v0/in_progress_forms/20-0995', mockInProgress);
      });
    },

    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    // skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
