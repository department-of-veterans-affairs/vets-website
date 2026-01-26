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

export const clickStartClaim = () =>
  cy
    .get('va-link-action[text="Start your claim"]')
    .eq(0)
    .click();

const verifyUrl = link => h.verifyCorrectUrl(manifest.rootUrl, link);

export const selectDropdownWithKeyboard = (fieldName, value) => {
  cy.tabToElement(`[name="${fieldName}"]`);
  cy.chooseSelectOptionUsingValue(value);
};

export const checkVaFacilityBox = () =>
  cy
    .get('[name="root_facilityTypes_vamc"]')
    .eq(0)
    .click();

export const selectVaPromptResponse = response => {
  cy.get(
    `va-radio-option[name="root_hasVaEvidence"][value="${response}"]`,
  ).click();
  clickContinue();
};

export const selectPrivatePromptResponse = response => {
  cy.get(
    `va-radio-option[name="root_hasPrivateEvidence"][value="${response}"]`,
  ).click();
  clickContinue();
};

export const addVaLocation = location => {
  cy.fillVaTextInput('root_treatmentLocation', location);
  clickContinue();
};

export const addVaTreatmentAfter2005 = () => {
  cy.selectRadio('root_treatmentBefore2005', 'N');
  clickContinue();
};

export const addVaTreatmentBefore2005 = () => {
  cy.selectRadio('root_treatmentBefore2005', 'Y');
  clickContinue();
};

export const addVaTreatmentDate = (monthIndex, year) => {
  cy.get('.select-month')
    .shadow()
    .find('select')
    .select(monthIndex, { force: true });
  cy.realPress('Tab');
  cy.realType(year);
  clickContinue();
};

export const addPrivateLocationData = (
  name,
  addressLine1,
  city,
  stateCode,
  zip,
  addressLine2 = null,
) => {
  cy.fillVaTextInput('root_treatmentLocation', name);
  cy.selectVaSelect('root_address_country', 'USA');
  cy.fillVaTextInput('root_address_street', addressLine1);

  if (addressLine2) {
    cy.fillVaTextInput('root_address_street2', addressLine2);
  }

  cy.fillVaTextInput('root_address_city', city);

  cy.get('.usa-select')
    .eq(1)
    .scrollIntoView();
  cy.selectVaSelect('root_address_state', stateCode);
  cy.fillVaTextInput('root_address_postalCode', zip);

  clickContinue();
};

export const fillVaTextInputWithoutName = (selector, value) => {
  cy.get('va-text-input')
    .shadow()
    .find(`input[name="${selector}"]`)
    .focus()
    .type(value);
};

export const addPrivateTreatmentDates = (
  treatmentStartDate,
  treatmentEndDate,
) => {
  const [startYear, startMonth, startDay] = treatmentStartDate.split('-');
  const [endYear, endMonth, endDay] = treatmentEndDate.split('-');

  fillVaTextInputWithoutName('root_treatmentStartMonth', startMonth);
  fillVaTextInputWithoutName('root_treatmentStartDay', startDay);
  fillVaTextInputWithoutName('root_treatmentStartYear', startYear);

  fillVaTextInputWithoutName('root_treatmentEndMonth', endMonth);
  fillVaTextInputWithoutName('root_treatmentEndDay', endDay);
  fillVaTextInputWithoutName('root_treatmentEndYear', endYear);
  clickContinue();
};

export const getToEvidenceFlow = () => {
  // Start
  cy.selectRadio('benefitType', 'compensation');
  clickContinue();

  // Intro
  clickStartClaim();

  // ITF
  clickContinue();

  // Confirm Personal Info
  clickContinue();

  // Homelessness
  cy.selectRadio('root_housingRisk', 'N');
  clickContinue();

  // Confirm Contact Info
  clickContinue();

  // Primary Phone
  cy.get('va-radio-option[name="primary"][value="home"]').click();
  clickContinue();

  // Contestable Issues
  cy.get('va-link-action[text="Add a new issue"]')
    .eq(0)
    .click();
  cy.fillVaTextInput('issue-name', 'Hypertension');
  cy.fillDate('decision-date', '2020-01-01');
  cy.get('#submit').click();

  cy.get('va-link-action[text="Add a new issue"]')
    .eq(0)
    .click();
  cy.fillVaTextInput('issue-name', `Tendonitis, left ankle`);
  cy.fillDate('decision-date', '2023-07-14');
  cy.get('#submit').click();

  cy.get('va-link-action[text="Add a new issue"]')
    .eq(0)
    .click();
  cy.fillVaTextInput('issue-name', `Sleep apnea`);
  cy.fillDate('decision-date', '2007-06-29');
  cy.get('#submit').click();

  clickContinue();

  // Issues Review
  clickContinue();

  // DR Process Review
  clickContinue();

  // 5103 Review
  cy.get('[name="5103"]')
    .eq(0)
    .click();
  clickContinue();
};

export const verifyH3 = (expectedText, index = 0) =>
  cy
    .get('form h3')
    .eq(index)
    .should('exist')
    .and('be.visible')
    .and('have.text', expectedText);

// Forms Pattern Single has a nested h3 structure for the header, it's inside the va-radio
export const verifyFPSH3 = expectedText =>
  cy
    .get('va-radio')
    .shadow()
    .find('h3')
    .should('exist')
    .and('be.visible')
    .and('have.text', expectedText);

export const verifyFPSDesc = expectedSnippet =>
  cy
    .get('va-radio div[slot="form-description"] p')
    .eq(0)
    .should('exist')
    .and('be.visible')
    .and('contain.text', expectedSnippet);

export const verifyParagraph = (expectedText, index = 0) =>
  cy
    .get('p')
    .eq(index)
    .should('exist')
    .and('be.visible')
    .and('have.text', expectedText);

export const check4142Auth = () => {
  cy.get('#privacy-agreement')
    .shadow()
    .find('div input')
    .eq(0)
    .scrollIntoView()
    .click();
  clickContinue();
};

export const verifyArrayBuilderReviewVACard = (
  index,
  location,
  header,
  subHeader,
  conditionsCount,
  conditions,
  treatmentDate,
) => {
  verifyH3(header, 0);

  cy.get('span h4')
    .eq(0)
    .should('exist')
    .and('be.visible')
    .and('have.text', subHeader);

  cy.get('va-card')
    .eq(index)
    .within(() => {
      cy.get('h3')
        .should('exist')
        .and('be.visible')
        .and('have.text', location);

      if (conditionsCount > 1) {
        verifyParagraph(`Conditions: ${conditions}`, 0);
      } else {
        verifyParagraph(`Condition: ${conditions}`, 0);
      }

      if (treatmentDate) {
        cy.get('p')
          .eq(1)
          .should('exist')
          .and('be.visible')
          .and('contain.text', 'Treatment start date')
          .and('contain.text', treatmentDate);
      } else {
        cy.get('p')
          .eq(1)
          .should('exist')
          .and('be.visible')
          .and('contain.text', 'Treatment start date')
          .and('contain.text', '2005 or later');
      }
    });

  cy.get('h4')
    .eq(0)
    .should('exist')
    .and('be.visible')
    .and(
      'have.text',
      'Do you want us to request records from another VA provider?',
    );
};

export const verifyArrayBuilderReviewPrivateCard = (
  index,
  location,
  header,
  subHeader,
  conditionsCount,
  conditions,
  treatmentDateRange,
) => {
  verifyH3(header, 0);

  cy.get('span h4')
    .eq(0)
    .should('exist')
    .and('be.visible')
    .and('have.text', subHeader);

  cy.get('va-card')
    .eq(index)
    .within(() => {
      cy.get('h3')
        .should('exist')
        .and('be.visible')
        .and('have.text', location);

      if (conditionsCount > 1) {
        verifyParagraph(`Conditions: ${conditions}`, 0);
      } else {
        verifyParagraph(`Condition: ${conditions}`, 0);
      }

      cy.get('p')
        .eq(1)
        .should('exist')
        .and('be.visible')
        .and('contain.text', 'Treatment')
        .and('contain.text', treatmentDateRange);
    });

  cy.get('h4')
    .eq(0)
    .should('exist')
    .and('be.visible')
    .and(
      'have.text',
      'Do you want us to request records from another private provider or VA Vet Center?',
    );
};

export const checkError = (parentSelector, expectedErrorMessage) =>
  cy
    .get(parentSelector)
    .shadow()
    .find('.usa-error-message')
    .should('be.visible')
    .and('have.text', expectedErrorMessage);

export const checkErrorHandlingWithClass = (
  parentSelector,
  expectedErrorMessage,
) => {
  clickContinue();

  checkError(parentSelector, expectedErrorMessage);
};

export const checkErrorHandlingWithId = (
  parentSelector,
  expectedErrorMessage,
) => {
  clickContinue();

  cy.get(parentSelector)
    .shadow()
    .find('#error-message')
    .should('be.visible')
    .and('have.text', `Error ${expectedErrorMessage}`);
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
