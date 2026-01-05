import path from 'path';
import { add, formatISO } from 'date-fns';
import { setStoredSubTask } from '@department-of-veterans-affairs/platform-forms/sub-task';
import manifest from '../../manifest.json';
import formConfig from '../../config/form';
import mockInProgress from '../fixtures/mocks/in-progress-forms.json';
import mockPrefill from '../fixtures/mocks/prefill.json';
import mockSubmit from '../fixtures/mocks/application-submit.json';
import mockUpload from '../fixtures/mocks/mockUpload.json';
import {
  EVIDENCE_UPLOAD_URL,
  EVIDENCE_VA_DETAILS_URL,
  EVIDENCE_VA_PROMPT_URL,
  EVIDENCE_PRIVATE_PROMPT_URL,
  EVIDENCE_PRIVATE_DETAILS_URL,
  HAS_PRIVATE_EVIDENCE,
  HAS_VA_EVIDENCE,
  PRIMARY_PHONE,
} from '../../constants';
import {
  CONTESTABLE_ISSUES_API,
  EVIDENCE_UPLOAD_API,
  ITF_API,
  SUBMIT_URL,
} from '../../constants/apis';
import cypressSetup from '../../../shared/tests/cypress.setup';
import * as h from '../../../shared/tests/cypress.helpers';
import { CONTESTABLE_ISSUES_PATH, SELECTED } from '../../../shared/constants';

const { chapters } = formConfig;

export const VETERAN_INFO_PATH = chapters.infoPages.pages.veteranInfo.path;
export const HOMELESSNESS_PATH = chapters.infoPages.pages.housingRisk.path;
export const LIVING_SITUATION_PATH =
  chapters.infoPages.pages.livingSituation.path;
export const OTHER_HOUSING_RISK_PATH =
  chapters.infoPages.pages.otherHousingRisk.path;
export const HOUSING_CONTACT_PATH = chapters.infoPages.pages.contact.path;
export const PRIMARY_PHONE_PATH =
  chapters.infoPages.pages.choosePrimaryPhone.path;
export const ISSUES_SUMMARY_PATH = chapters.issues.pages.issueSummary.path;
export const OPT_IN_PATH = chapters.issues.pages.optIn.path;
export const NOTICE_5103_PATH = chapters.evidence.pages.notice5103.path;
export const EVIDENCE_SUMMARY_PATH = chapters.evidence.pages.summary.path;
export const FACILITY_TYPES_PATH = chapters.evidence.pages.facilityTypes.path;
export const EVIDENCE_VA_RECORDS_DETAILS_PATH =
  chapters.evidence.pages.vaDetails.path;
export const MST_PATH = chapters.vhaIndicator.pages.optionForMst.path;
export const MST_OPTION_PATH = chapters.vhaIndicator.pages.optionIndicator.path;
export const REVIEW_PATH = '/review-and-submit';

export const OTHER_HOUSING_RISK_INPUT = '[name="root_otherHousingRisks"]';
export const LIVING_SITUATION_SHELTER_CHECKBOX =
  '[name="root_livingSituation_shelter"]';
export const LIVING_SITUATION_OTHER_CHECKBOX =
  '[name="root_livingSituation_other"]';
export const POINT_OF_CONTACT_NAME_INPUT = '[name="root_pointOfContactName"]';
export const POINT_OF_CONTACT_PHONE_INPUT = '[name="root_pointOfContactPhone"]';
export const VA_EVIDENCE_CHECKBOX = '[name="root_facilityTypes_vamc"]';
export const NON_VA_EVIDENCE_CHECKBOX = '[name="root_facilityTypes_nonVa"]';
export const ADDTL_EVIDENCE_RADIO = '[name="root_view:hasOtherEvidence"]';
export const MST_RADIO = '[name="root_mstOption"]';
export const MST_OPTION_RADIO = '[name="root_optionIndicator"]';

// VA location inputs
export const VA_EVIDENCE_FACILITY_NAME_INPUT = '[name="name"]';
export const VA_EVIDENCE_ISSUES_CHECKBOXES = '[name="issues"]';
export const VA_EVIDENCE_TREATMENT_YEAR = '[name="txdateYear"]';

// Non-VA location auth & inputs
export const PRIVACY_MODAL_TRIGGER_1_ID = 'privacy-modal-button-1';
export const PRIVACY_MODAL_TRIGGER_1_BUTTON = `[id="${PRIVACY_MODAL_TRIGGER_1_ID}"]`;
export const PRIVACY_MODAL_TITLE =
  'va-modal[modal-title="Privacy Act Statement"]';
export const PRIVACY_AGREEMENT_CHECKBOX = 'input[name="privacy-agreement"]';
export const LIMITED_CONSENT_RADIOS = '[name="root_view:hasPrivateLimitation"]';
export const LIMITED_CONSENT_TEXTAREA = '[name="root_limitedConsent"]';

export const clickContinue = () =>
  cy.get('va-button[continue]', { selector: 'button' }).click();

const verifyUrl = link => h.verifyCorrectUrl(manifest.rootUrl, link);

export const selectDropdownWithKeyboard = (fieldName, value) => {
  cy.tabToElement(`[name="${fieldName}"]`);
  cy.chooseSelectOptionUsingValue(value);
};

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

// _testData from createTestConfig
export const setupPerTest = (_testData, toggles = []) => {
  cypressSetup();

  setStoredSubTask({ benefitType: 'compensation' });

  cy.intercept('POST', EVIDENCE_UPLOAD_API, mockUpload);
  cy.intercept('GET', ITF_API, h.fetchItf());
  cy.intercept('GET', '/v0/feature_toggles*', {
    data: {
      type: 'feature_toggles',
      features: Array.isArray(toggles) ? toggles : [],
    },
  });

  // Include legacy appeals to mock data for maximal test
  cy.intercept(
    'GET',
    `${CONTESTABLE_ISSUES_API}/compensation`,
    h.mockContestableIssues,
  ).as('getIssues');

  cy.intercept('POST', SUBMIT_URL, mockSubmit);

  cy.get('@testData').then(() => {
    cy.intercept('GET', '/v0/in_progress_forms/20-0995', mockPrefill);
    cy.intercept('PUT', '/v0/in_progress_forms/20-0995', mockInProgress);
  });
};

export const pageHooks = {
  introduction: ({ afterHook }) => {
    afterHook(() => {
      h.startApp();
    });
  },
  'veteran-information': () => {
    h.getPastItf(cy);
    clickContinue();
  },
  'primary-phone-number': ({ afterHook }) => {
    afterHook(() => {
      cy.get('@testData').then(testData => {
        cy.selectRadio('primary', testData[PRIMARY_PHONE] || 'home');
        clickContinue();
      });
    });
  },
  [CONTESTABLE_ISSUES_PATH]: ({ afterHook }) => {
    cy.injectAxeThenAxeCheck();
    afterHook(() => {
      cy.get('@testData').then(async testData => {
        clickContinue();
        // prevent continuing without any issues selected
        verifyUrl(CONTESTABLE_ISSUES_PATH);
        cy.get('va-alert[status="error"] h3').should(
          'contain',
          'You’ll need to select an issue',
        );

        testData.additionalIssues?.forEach(additionalIssue => {
          if (additionalIssue.issue && additionalIssue[SELECTED]) {
            cy.get('.add-new-issue').click();

            verifyUrl('/add-issue');
            cy.injectAxeThenAxeCheck();

            cy.fillVaTextInput('issue-name', additionalIssue.issue);
            cy.fillVaMemorableDate('decision-date', h.getRandomDate(), false);
            cy.get('#submit').click();
          }
        });
        testData.contestedIssues.forEach(issue => {
          if (issue[SELECTED]) {
            cy.get(
              `label:contains("${issue.attributes.ratingIssueSubjectText}")`,
            )
              .closest('li')
              .find('input[type="checkbox"]')
              .click({ force: true });
          }
        });

        clickContinue();
      });
    });
  },
  'notice-of-evidence-needed': ({ afterHook }) => {
    cy.injectAxeThenAxeCheck();
    afterHook(() => {
      cy.get('@testData').then(({ form5103Acknowledged }) => {
        cy.selectVaCheckbox('5103', form5103Acknowledged);
        clickContinue();
      });
    });
  },
  'facility-types': ({ afterHook }) => {
    afterHook(() => {
      cy.injectAxeThenAxeCheck();

      cy.selectVaCheckbox('root_facilityTypes_vamc', true);
      cy.selectVaCheckbox('root_facilityTypes_nonVa', true);
      clickContinue();
    });
  },
  [EVIDENCE_VA_PROMPT_URL]: ({ afterHook }) => {
    cy.injectAxeThenAxeCheck();

    afterHook(() => {
      cy.get('@testData').then(data => {
        const hasVa = data[HAS_VA_EVIDENCE];

        cy.get(`va-radio-option[value="${hasVa ? 'y' : 'n'}"]`).click();
        clickContinue();
      });
    });
  },
  [EVIDENCE_VA_DETAILS_URL]: ({ afterHook }) => {
    cy.injectAxeThenAxeCheck();

    afterHook(() => {
      cy.get('@testData').then(({ locations = [] }) => {
        locations.forEach((location, index) => {
          if (location) {
            if (index > 0) {
              verifyUrl(`${EVIDENCE_VA_DETAILS_URL}?index=${index}`);
            }

            cy.fillVaTextInput('name', location.locationAndName);

            location?.issues.forEach(issue => {
              cy.get(`va-checkbox[value="${issue}"]`)
                .shadow()
                .find('input')
                .check({ force: true });
            });

            cy.fillVaDate('txdate', location.treatmentDate, true);
            cy.selectVaCheckbox('nodate', location.noDate);
            cy.injectAxeThenAxeCheck();

            // Add another
            if (index + 1 < locations.length) {
              cy.get('va-link-action').click();
            }
          }
        });

        clickContinue();
      });
    });
  },
  [EVIDENCE_PRIVATE_PROMPT_URL]: ({ afterHook }) => {
    cy.injectAxeThenAxeCheck();
    afterHook(() => {
      cy.get('@testData').then(data => {
        const hasPrivate = data[HAS_PRIVATE_EVIDENCE];

        cy.get(`va-radio-option[value="${hasPrivate ? 'y' : 'n'}"]`).click();
        clickContinue();
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

        clickContinue();
      });
    });
  },
  [EVIDENCE_PRIVATE_DETAILS_URL]: ({ afterHook }) => {
    cy.injectAxeThenAxeCheck();
    afterHook(() => {
      cy.get('@testData').then(({ providerFacility = [] }) => {
        providerFacility.forEach((facility, index) => {
          if (facility) {
            if (index > 0) {
              verifyUrl(`${EVIDENCE_PRIVATE_DETAILS_URL}?index=${index}`);
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

            cy.injectAxeThenAxeCheck();

            // Add another
            if (index + 1 < providerFacility.length) {
              cy.get('va-link-action').click();
            }
          }
        });

        clickContinue();
      });
    });
  },

  [EVIDENCE_UPLOAD_URL]: () => {
    cy.get('input[type="file"]').upload(
      path.join(__dirname, '..', 'fixtures/data/example-upload.pdf'),
      'testing',
    );

    cy.get('.schemaform-file-uploading').should('not.exist');
    cy.get('va-select')
      .shadow()
      .find('select')
      .select('Buddy/Lay Statement', { force: true });
  },
};
