import path from 'path';
import { add, formatISO } from 'date-fns';

import { setStoredSubTask } from '@department-of-veterans-affairs/platform-forms/sub-task';

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

export const fetchItf = (
  offset = { months: 3 },
  status = 'active',
  type = 'compensation',
) => ({
  data: {
    id: '',
    type: 'evss_intent_to_file_intent_to_files_responses',
    attributes: {
      intentToFile: [
        {
          id: '1',
          creationDate: '2022-07-28T19:53:45.810+00:00',
          // pattern null = ISO8601 format
          expirationDate: formatISO(add(new Date(), offset)),
          participantId: 1,
          source: 'EBN',
          status,
          type,
        },
        {
          id: '2',
          creationDate: '2014-07-28T19:53:45.810+00:00',
          expirationDate: '2015-08-28T19:47:52.788+00:00',
          participantId: 1,
          source: 'EBN',
          status: 'claim_recieved',
          type: 'compensation',
        },
        {
          id: '3',
          creationDate: '2014-07-28T19:53:45.810+00:00',
          expirationDate: '2015-08-28T19:47:52.789+00:00',
          participantId: 1,
          source: 'EBN',
          status: 'claim_recieved',
          type: 'compensation',
        },
        {
          id: '4',
          creationDate: '2014-07-28T19:53:45.810+00:00',
          expirationDate: '2015-08-28T19:47:52.789+00:00',
          participantId: 1,
          source: 'EBN',
          status: 'expired',
          type: 'compensation',
        },
        {
          id: '5',
          creationDate: '2014-07-28T19:53:45.810+00:00',
          expirationDate: '2015-08-28T19:47:52.790+00:00',
          participantId: 1,
          source: 'EBN',
          status: 'incomplete',
          type: 'compensation',
        },
      ],
    },
  },
});

export const errorItf = () => ({
  errors: [
    {
      title: 'Bad Request',
      detail: 'Received a bad request response from the upstream server',
      code: 'EVSS400',
      source: 'EVSS::DisabilityCompensationForm::Service',
      status: '400',
      meta: {},
    },
  ],
});

export const postItf = () => ({
  data: {
    attributes: {
      intentToFile: {
        id: '1',
        creationDate: '2018-01-21T19:53:45.810+00:00',
        expirationDate: formatISO(add(new Date(), { years: 1 })),
        participantId: 1,
        source: 'EBN',
        status: 'active',
        type: 'compensation',
      },
    },
    id: {},
    type: 'evss_intent_to_file_intent_to_files_responses',
  },
});

export const getPastItf = cy => {
  cy.wait('@getIssues');
  cy.get('va-alert')
    .should('be.visible')
    .then(() => {
      // Click past the ITF message
      cy.selectVaButtonPairPrimary();
    });
};

export const setupPerTest = () => {
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
  ).as('getIssues');

  cy.intercept('POST', '/v1/supplemental_claims', mockSubmit);

  cy.get('@testData').then(() => {
    cy.intercept('GET', '/v0/in_progress_forms/20-0995', mockPrefill);
    cy.intercept('PUT', '/v0/in_progress_forms/20-0995', mockInProgress);
  });
};

export const pageHooks = {
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
      cy.get('@testData').then(async testData => {
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

            cy.url().should('include', '/add-issue');
            cy.axeCheck();

            cy.fillVaTextInput('issue-name', additionalIssue.issue);
            cy.fillVaMemorableDate('decision-date', getRandomDate(), false);
            cy.get('#submit').click();
          }
        });
        testData.contestedIssues.forEach(issue => {
          if (issue[SELECTED]) {
            cy.get(`h4:contains("${issue.attributes.ratingIssueSubjectText}")`)
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
        cy.selectVaCheckbox('5103', form5103Acknowledged);
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
            cy.fillVaTextInput('name', location.locationAndName);
            location?.issues.forEach(issue => {
              cy.get(`va-checkbox[value="${issue}"]`)
                .shadow()
                .find('input')
                .check({ force: true });
            });
            cy.fillVaMemorableDate('from', location.evidenceDates?.from, false);
            cy.fillVaMemorableDate('to', location.evidenceDates?.to, false);
            cy.axeCheck();

            // Add another
            if (index + 1 < locations.length) {
              cy.get('.vads-c-action-link--green').click();
            }
          }
        });
        cy.findByText('Continue', { selector: 'button' }).click();
      });
    });
  },

  [EVIDENCE_PRIVATE_REQUEST]: ({ afterHook }) => {
    cy.injectAxeThenAxeCheck();
    afterHook(() => {
      cy.get('@testData').then(data => {
        const hasPrivate = data[EVIDENCE_PRIVATE];
        cy.get(`va-radio-option[value="${hasPrivate ? 'y' : 'n'}"]`).click();
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
            cy.fillVaTextInput('name', facility.providerFacilityName);

            cy.selectVaSelect(
              'country',
              facility.providerFacilityAddress.country,
            );
            cy.fillVaTextInput(
              'street',
              facility.providerFacilityAddress.street,
            );
            cy.fillVaTextInput(
              'street2',
              facility.providerFacilityAddress.street2,
            );
            cy.fillVaTextInput('city', facility.providerFacilityAddress.city);

            if (facility.providerFacilityAddress.country === 'USA') {
              cy.selectVaSelect(
                'state',
                facility.providerFacilityAddress.state,
              );
            } else {
              cy.fillVaTextInput(
                'state',
                facility.providerFacilityAddress.state,
              );
            }
            cy.fillVaTextInput(
              'postal',
              facility.providerFacilityAddress.postalCode,
            );

            facility?.issues.forEach(issue => {
              cy.get(`va-checkbox[value="${issue}"]`)
                .shadow()
                .find('input')
                .check({ force: true });
            });

            cy.fillVaMemorableDate(
              'from',
              facility.treatmentDateRange?.from,
              false,
            );
            cy.fillVaMemorableDate(
              'to',
              facility.treatmentDateRange?.to,
              false,
            );
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
          cy.fillVaTextarea('limitation', data.limitedConsent);
        }
        cy.findByText('Continue', { selector: 'button' }).click();
      });
    });
  },

  [EVIDENCE_UPLOAD_PATH]: () => {
    cy.get('input[type="file"]').upload(
      path.join(__dirname, 'fixtures/data/example-upload.pdf'),
      'testing',
    );

    cy.get('.schemaform-file-uploading').should('not.exist');
    cy.get('va-select')
      .shadow()
      .find('select')
      .select('Buddy/Lay Statement', { force: true });
  },
};
