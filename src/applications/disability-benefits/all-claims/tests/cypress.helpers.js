// tests/cypress.helpers.js (full file)

import { add, format } from 'date-fns';

import { expect } from 'chai';
import { genderLabels } from '@department-of-veterans-affairs/platform-static-data/labels';
import { formatDate } from '../utils/dates/formatting';
import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockPrefill from './fixtures/mocks/prefill.json';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockLocations from './fixtures/mocks/separation-locations.json';
import mockPayment from './fixtures/mocks/payment-information.json';
import mockSubmit from './fixtures/mocks/application-submit.json';
import mockUpload from './fixtures/mocks/document-upload.json';
import mockServiceBranches from './fixtures/mocks/service-branches.json';
import mockUser from './fixtures/mocks/user.json';
import {
  capitalizeEachWord,
  showSeparationLocation,
  isBDD,
  hasRatedDisabilities,
} from '../utils';

import {
  MOCK_SIPS_API,
  WIZARD_STATUS,
  FORM_STATUS_BDD,
  SHOW_8940_4192,
  SAVED_SEPARATION_DATE,
} from '../constants';

// Helper: format to EVSS-like "YYYY-MM-DDTHH:mm:ss.SSSZ" with colon in offset
// date-fns token "xxx" => ±HH:MM, which Moment "Z" accepts.
// The key part is ensuring .SSS exists.
const evssFormat = date => format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

export const mockItf = (
  offset = { days: 1 },
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
          creationDate: '2014-07-28T19:53:45.810+00:00',
          expirationDate: evssFormat(add(new Date(), offset)),
          participantId: 1,
          source: 'EBN',
          status,
          type,
        },
        {
          id: '1',
          creationDate: '2014-07-28T19:53:45.810+00:00',
          expirationDate: '2015-08-28T19:47:52.788+00:00',
          participantId: 1,
          source: 'EBN',
          status: 'claim_recieved',
          type: 'compensation',
        },
        {
          id: '1',
          creationDate: '2014-07-28T19:53:45.810+00:00',
          expirationDate: '2015-08-28T19:47:52.789+00:00',
          participantId: 1,
          source: 'EBN',
          status: 'claim_recieved',
          type: 'compensation',
        },
        {
          id: '1',
          creationDate: '2014-07-28T19:53:45.810+00:00',
          expirationDate: '2015-08-28T19:47:52.790+00:00',
          participantId: 1,
          source: 'EBN',
          status: 'expired',
          type: 'compensation',
        },
        {
          id: '1',
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
        expirationDate: evssFormat(add(new Date(), { years: 1 })),
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

const regexNonWord = /[^\w]/g;
export const sippableId = str =>
  (str || 'blank').replace(regexNonWord, '').toLowerCase();
/**
 * Setup for the e2e test, including any cleanup and mocking api responses
 * @param {object} cy
 * @param {object} testOptions - object with optional prefill data or toggles
 */
export const setup = (cy, testOptions = {}) => {
  window.sessionStorage.setItem(SHOW_8940_4192, 'true');
  window.sessionStorage.removeItem(WIZARD_STATUS);
  window.sessionStorage.removeItem(FORM_STATUS_BDD);

  if (testOptions?.prefillData?.disability526Enable2024Form4142 === true) {
    cy.intercept('GET', '/v0/feature_toggles*', {
      statusCode: 200,
      body: {
        data: {
          features: [
            {
              name: 'disability_526_form4142_use_2024_version',
              value: true,
            },
            {
              name: 'show526Wizard',
              value: true,
            },
            {
              name: 'form526_confirmation_email',
              value: true,
            },
            {
              name: 'form526_confirmation_email_show_copy',
              value: true,
            },
            {
              name: 'subform_8940_4192',
              value: true,
            },
            {
              name: 'allowEncryptedFiles',
              value: true,
            },
          ],
        },
      },
    });
  } else {
    cy.intercept(
      'GET',
      '/v0/feature_toggles*',
      testOptions?.toggles || mockFeatureToggles,
    );
  }

  cy.intercept('GET', '/v0/user', mockUser).as('get mockUser');
  // `mockItf` is not a fixture; it can't be loaded as a fixture
  // because fixtures don't evaluate JS.
  cy.intercept('GET', '/v0/intent_to_file', mockItf);

  cy.intercept('PUT', `${MOCK_SIPS_API}*`, mockInProgress).as(
    'saveInProgressForm',
  );

  cy.intercept(
    'GET',
    '/v0/disability_compensation_form/separation_locations',
    mockLocations,
  );

  cy.intercept('GET', '/v0/ppiu/payment_information', mockPayment);

  cy.intercept('POST', '/v0/upload_supporting_evidence', mockUpload).as(
    'uploadFile',
  );

  cy.intercept(
    'POST',
    '/v0/disability_compensation_form/submit_all_claim',
    mockSubmit,
  );

  // Stub submission status for immediate transition to confirmation page.
  cy.intercept(
    'GET',
    '/v0/disability_compensation_form/submission_status/*',
    '',
  );

  cy.intercept(
    'GET',
    '/v0/benefits_reference_data/service-branches',
    mockServiceBranches,
  );

  // Pre-fill with the expected ratedDisabilities,
  // but without view:selected, since that's not pre-filled
  cy.get('@testData').then(data => {
    const sanitizedRatedDisabilities = (data.ratedDisabilities || []).map(
      ({ 'view:selected': _, ...obj }) => obj,
    );

    const formData = {
      ...mockPrefill.formData,
      disabilities: sanitizedRatedDisabilities,
      servicePeriods: data.serviceInformation.servicePeriods,
      reservesNationalGuardService:
        data.serviceInformation.reservesNationalGuardService,
    };

    if (data.toxicExposure) {
      formData.toxicExposure = data.toxicExposure;
    }

    if (testOptions?.prefillData?.startedFormVersion) {
      formData.startedFormVersion = testOptions.prefillData.startedFormVersion;
    }
    if (testOptions?.prefillData?.syncModern0781Flow) {
      formData.syncModern0781Flow = testOptions.prefillData.syncModern0781Flow;
    }

    if (testOptions?.prefillData?.disability526Enable2024Form4142) {
      formData.disability526Enable2024Form4142 =
        testOptions.prefillData.disability526Enable2024Form4142;
    }
    cy.intercept('GET', `${MOCK_SIPS_API}*`, {
      formData,
      metadata: mockPrefill.metadata,
    });
  });
};

export const reviewAndSubmitPageFlow = (
  cy,
  submitButtonText = 'Submit application',
) => {
  const first = mockUser.data.attributes.profile.firstName;
  const middle = mockUser.data.attributes.profile.middleName;
  const last = mockUser.data.attributes.profile.lastName;

  const veteranSignature = middle
    ? `${first} ${middle} ${last}`
    : `${first} ${last}`;

  cy.get('#veteran-signature')
    .shadow()
    .get('#inputField')
    .type(veteranSignature);

  cy.get(`va-checkbox[id="veteran-certify"]`)
    .shadow()
    .find('input')
    .click({ force: true });
  cy.findByText(submitButtonText, {
    selector: 'button',
  }).click();
};

Cypress.Commands.add('verifyVeteranDetails', data => {
  cy.get('.confirmation-chapter-section-collection').within(() => {
    cy.get('h3')
      .contains(/veteran details/i)
      .should('exist');
    // Veteran name, DOB, and gender come from mockUser, not mockPrefill
    const {
      firstName,
      middleName,
      lastName,
      suffix,
    } = mockUser.data.attributes.profile;
    cy.contains(
      [firstName, middleName, lastName, suffix].filter(Boolean).join(' '),
    ).should('exist');

    const formattedDob = formatDate(mockUser.data.attributes.profile.birthDate);
    cy.contains('Date of birth').should('exist');
    cy.contains(`${formattedDob}`).should('exist');
    cy.contains(genderLabels[mockUser.data.attributes.profile.gender]).should(
      'exist',
    );
    // Contact data comes from mockPrefill, not test data
    if (mockPrefill.formData.veteran.primaryPhone) {
      const phone = mockPrefill.formData.veteran.primaryPhone.replace(
        /\D/g,
        '',
      );
      const formattedPhone = `${phone.slice(0, 3)}-${phone.slice(
        3,
        6,
      )}-${phone.slice(6)}`;
      cy.contains(formattedPhone).should('exist');
    }

    if (mockPrefill.formData.veteran.emailAddress) {
      cy.contains(mockPrefill.formData.veteran.emailAddress).should('exist');
    }

    if (mockPrefill.formData.veteran.mailingAddress) {
      const address = mockPrefill.formData.veteran.mailingAddress;

      if (address.country) {
        cy.contains(address.country).should('exist');
      }
      if (address.addressLine1) {
        cy.contains(address.addressLine1.toUpperCase()).should('exist');
      }
      if (address.state) {
        cy.contains(address.state.toUpperCase()).should('exist');
      }
      if (address.zipCode) {
        cy.contains(address.zipCode).should('exist');
      }
    }

    if (
      data.homelessOrAtRisk &&
      (data.disability526ExtraBDDPagesEnabled ||
        data['view:isBddData'] !== true)
    ) {
      cy.contains(/are you homeless or at risk of becoming homeless/i).should(
        'exist',
      );

      if (data.homelessOrAtRisk === 'no') {
        cy.contains(/^No$/i).should('exist');
      } else if (data.homelessOrAtRisk === 'homeless') {
        cy.contains(/homeless/i).should('exist');
      } else if (data.homelessOrAtRisk === 'atRisk') {
        cy.contains(/at risk/i).should('exist');
      }
    }

    if (data.serviceInformation?.servicePeriods?.length > 0) {
      data.serviceInformation.servicePeriods.forEach(period => {
        cy.contains(period.serviceBranch).should('exist');
      });
    }

    if (showSeparationLocation(data) === true) {
      cy.contains(/separation location/i).should('exist');
      cy.contains(data.serviceInformation.separationLocation.label).should(
        'exist',
      );
    }

    if (
      !hasRatedDisabilities(data) &&
      (data.disability526ExtraBDDPagesEnabled ||
        (!isBDD(data) && data['view:isBddData'] !== true))
    ) {
      cy.contains(/have you ever received military retirement pay/i).should(
        'exist',
      );
    }
  });
});

Cypress.Commands.add('verifyConditions', data => {
  const hasDisabilities =
    data.ratedDisabilities?.length > 0 || data.newDisabilities?.length > 0;

  if (hasDisabilities) {
    cy.get('.confirmation-chapter-section-collection').within(() => {
      cy.get('h3')
        .contains(/conditions/i)
        .should('exist');
      cy.get('ul').should('exist');
      cy.get('li').should('exist');
    });

    const hasSelectedRated = data.ratedDisabilities?.some(
      disability => disability['view:selected'],
    );
    if (hasSelectedRated) {
      data.ratedDisabilities
        .filter(disability => disability['view:selected'])
        .forEach(disability => {
          const name = disability.name || disability.diagnosticText;
          const capitalizedName = capitalizeEachWord(name);
          cy.contains(capitalizedName).should('exist');
        });
    }

    if (data.newDisabilities?.length > 0) {
      data.newDisabilities.forEach(disability => {
        const capitalizedCondition = capitalizeEachWord(disability.condition);
        cy.contains(capitalizedCondition).should('exist');
      });
    }
  }
});

Cypress.Commands.add('verifyToxicExposure', data => {
  if (data.toxicExposure?.conditions) {
    const { conditions } = data.toxicExposure;

    cy.get('.confirmation-chapter-section-collection').within(() => {
      cy.get('h4')
        .contains(/toxic exposure/i)
        .should('exist');

      const claimedConditions = data.newDisabilities?.filter(disability => {
        const sippableCondition = disability.condition
          .toLowerCase()
          .replace(/\s+/g, '');
        return (
          conditions[sippableCondition] === true ||
          Object.keys(conditions).some(
            key =>
              key !== 'none' &&
              conditions[key] === true &&
              key === sippableCondition,
          )
        );
      });

      if (claimedConditions && claimedConditions.length > 0) {
        claimedConditions.forEach(disability => {
          const capitalizedCondition = capitalizeEachWord(disability.condition);
          cy.contains(capitalizedCondition).should('exist');
          cy.contains(/claimed/i).should('exist');
        });
      }

      if (data.toxicExposure.gulfWar1990) {
        const gulfWar = data.toxicExposure.gulfWar1990;

        cy.contains(/service after august 2, 1990/i).should('exist');
        cy.contains(/did you serve in any of these gulf war locations/i).should(
          'exist',
        );

        Object.keys(gulfWar).forEach(location => {
          if (gulfWar[location] === true) {
            cy.contains(new RegExp(location, 'i')).should('exist');
          }
        });
      }

      if (data.toxicExposure.herbicide) {
        const { herbicide } = data.toxicExposure;

        cy.contains(/agent orange locations/i).should('exist');
        cy.contains(
          /did you serve in any of these locations where the military used the herbicide agent orange/i,
        ).should('exist');

        Object.keys(herbicide).forEach(location => {
          if (herbicide[location] === true) {
            cy.get('h4')
              .contains(new RegExp(location, 'i'))
              .should('exist');
          }
        });
      }

      if (data.toxicExposure.otherExposures) {
        const { otherExposures } = data.toxicExposure;

        cy.contains(/other toxic exposures/i).should('exist');
        cy.contains(/have you been exposed to any of these hazards/i).should(
          'exist',
        );

        Object.keys(otherExposures).forEach(exposure => {
          if (otherExposures[exposure] === true) {
            cy.get('h4')
              .contains(new RegExp(exposure, 'i'))
              .should('exist');
          }
        });
      }
    });
  }
});

Cypress.Commands.add('verifyVaTreatmentFacility', facility => {
  cy.contains(facility.treatmentCenterName).should('exist');

  if (facility.treatmentCenterAddress) {
    const addr = facility.treatmentCenterAddress;
    if (addr.city) {
      cy.contains(addr.city).should('exist');
    }
    if (addr.state) {
      cy.contains(/state/i).should('exist');
    }
  }
});

Cypress.Commands.add('verifyPrivateProviderFacility', facility => {
  cy.contains(/name of private provider or hospital/i).should('exist');
  cy.contains(facility.providerFacilityName).should('exist');

  if (facility.treatmentDateRange) {
    cy.contains(/when did your treatment start/i).should('exist');
    cy.contains(/when did your treatment end/i).should('exist');
  }

  if (facility.providerFacilityAddress) {
    const addr = facility.providerFacilityAddress;
    if (addr.country) {
      cy.contains(/country/i).should('exist');
      cy.contains(addr.country).should('exist');
    }
    if (addr.street) {
      cy.contains(/street/i).should('exist');
      cy.contains(addr.street).should('exist');
    }
    if (addr.city) {
      cy.contains(/city/i).should('exist');
      cy.contains(addr.city).should('exist');
    }
    if (addr.state) {
      cy.contains(/state/i).should('exist');
    }
    if (addr.postalCode) {
      cy.contains(/postal code/i).should('exist');
      cy.contains(addr.postalCode).should('exist');
    }
  }
});

Cypress.Commands.add('verifySupportingEvidence', data => {
  if (data['view:hasEvidence'] === true) {
    cy.get('.confirmation-chapter-section-collection').within(() => {
      cy.get('h3')
        .contains(/supporting evidence/i)
        .should('exist');
    });

    if (
      data['view:selectableEvidenceTypes']?.['view:hasVaMedicalRecords'] &&
      data.vaTreatmentFacilities?.length > 0
    ) {
      cy.get('.confirmation-chapter-section-collection').then($section => {
        if ($section.text().match(/va medical records/i)) {
          cy.get('.confirmation-chapter-section-collection').within(() => {
            cy.contains(/va medical records/i).should('exist');
            data.vaTreatmentFacilities.forEach(facility => {
              cy.verifyVaTreatmentFacility(facility);
            });
          });
        }
      });
    }

    if (
      data['view:selectableEvidenceTypes']?.['view:hasPrivateMedicalRecords'] &&
      data.providerFacility?.length > 0
    ) {
      cy.get('.confirmation-chapter-section-collection').then($section => {
        if ($section.text().match(/non-va treatment records/i)) {
          cy.get('.confirmation-chapter-section-collection').within(() => {
            cy.contains(/non-va treatment records/i).should('exist');
            data.providerFacility.forEach(facility => {
              cy.verifyPrivateProviderFacility(facility);
            });
          });
        }
      });
    }

    if (data['view:selectableEvidenceTypes']?.['view:hasOtherEvidence']) {
      cy.get('.confirmation-chapter-section-collection').within(() => {
        // Check for the actual auto-uploaded file (platform/testing/example-upload.png) from cy.fillPage()
        cy.contains('example-upload.png').should('exist');
      });
    }
  }
});

Cypress.Commands.add('verifyAdditionalInformation', data => {
  cy.get('.confirmation-chapter-section-collection').within(() => {
    cy.get('h3')
      .contains(/additional information/i)
      .should('exist');
  });

  if (data['view:bankAccount']) {
    cy.get('.confirmation-chapter-section-collection').within(() => {
      cy.get('h4')
        .contains(/payment information/i)
        .should('exist');

      const bankAccount = data['view:bankAccount'];

      if (bankAccount.bankAccountType) {
        cy.contains(bankAccount.bankAccountType).should('exist');
      }

      if (bankAccount.bankName) {
        cy.contains(bankAccount.bankName).should('exist');
      }

      if (bankAccount.bankAccountNumber) {
        const lastFour = bankAccount.bankAccountNumber.slice(-4);
        cy.contains(lastFour).should('exist');
      }

      if (bankAccount.bankRoutingNumber) {
        const lastFour = bankAccount.bankRoutingNumber.slice(-4);
        cy.contains(lastFour).should('exist');
      }
    });
  }

  if (data.isVaEmployee !== undefined) {
    cy.get('h4')
      .contains(/va employee/i)
      .should('exist');
    cy.contains(/are you currently a va employee/i).should('exist');
    if (data.isVaEmployee === true) {
      cy.contains(/^Yes$/i).should('exist');
    } else {
      cy.contains(/^No$/i).should('exist');
    }
  }

  if (data.standardClaim === true) {
    cy.get('h4')
      .contains(/fully developed claim program/i)
      .should('exist');
    cy.contains(
      /do you want to apply using the fully developed claim program/i,
    ).should('exist');
  }
});

export const pageHooks = (cy, testOptions) => ({
  start: () => {
    // skip wizard
    cy.findByText(/apply now/i).click();
  },

  introduction: () => {
    cy.get('@testData').then(data => {
      if (data['view:isBddData']) {
        const separationDate = format(
          add(new Date(), { days: 120 }),
          'yyyy-MM-dd',
        );

        window.sessionStorage.setItem(SAVED_SEPARATION_DATE, separationDate);
      } else {
        window.sessionStorage.removeItem(SAVED_SEPARATION_DATE);
      }
      // Start form
      cy.findAllByText(/start the/i, { selector: 'a' })
        .first()
        .click();
    });
  },

  'veteran-information': () => {
    cy.get('.itf-wrapper')
      .should('be.visible')
      .then(() => {
        // Click past the ITF message
        cy.findByText(/continue/i, { selector: 'button' }).click();
      });

    // veteran info page continue button
    cy.findByText(/continue/i, { selector: 'button' })
      .should('be.visible')
      .click();
  },

  'review-veteran-details/military-service-history/federal-orders': () => {
    cy.get('@testData').then(data => {
      cy.fillPage();
      if (
        data.serviceInformation.reservesNationalGuardService[
          'view:isTitle10Activated'
        ]
      ) {
        const futureDate = add(new Date(), { days: 120 });
        const year = format(futureDate, 'yyyy');
        const month = format(futureDate, 'M'); // Single digit month (1-12)
        const day = format(futureDate, 'd'); // Single digit day (1-31)

        // active title 10 activation puts this into BDD flow
        cy.get('select[name$="SeparationDateMonth"]').select(month);
        cy.get('select[name$="SeparationDateDay"]').select(day);
        cy.get('input[name$="SeparationDateYear"]').clear();
        cy.get('input[name$="SeparationDateYear"]').type(year);
      }
    });
  },

  'mental-health-form-0781/workflow': () => {
    cy.get('va-radio-option[value="optForOnlineForm0781"]')
      .find('input[type="radio"]')
      .check({ force: true });

    cy.findByText(/continue/i, { selector: 'button' }).click();
  },

  'supporting-evidence/orientation': () => {
    // The orientation page can be legacy or enhanced depending on the feature flag.
    // Web components may take a moment to hydrate; wait for either legacy marker text
    // or any accordion item to appear.
    cy.get('body', { timeout: 15000 }).should($body => {
      const enhancedItems = $body.find('va-accordion-item');
      const hasEnhancedAccordion = enhancedItems.length > 0;
      const hasLegacyMarker =
        /you can submit these types of evidence/i.test($body.text()) ||
        /Notice of evidence needed/i.test($body.text());

      expect(hasEnhancedAccordion || hasLegacyMarker).to.equal(true);
    });

    cy.get('body').then($body => {
      const hasEnhancedAccordion = $body.find('va-accordion-item').length > 0;

      if (hasEnhancedAccordion) {
        cy.get('va-accordion', { timeout: 15000 }).should('exist');
        cy.get('va-accordion-item').should('have.length.greaterThan', 0);
      } else {
        cy.contains(/you can submit these types of evidence/i).should('exist');
      }
    });
  },

  'review-veteran-details/separation-location': () => {
    cy.get('@testData').then(data => {
      cy.get('input[name="root_serviceInformation_separationLocation"]').type(
        data.serviceInformation.separationLocation.label,
      );
    });
  },

  'new-disabilities/ptsd-intro': () => {
    if (testOptions?.prefillData?.syncModern0781Flow) {
      throw new Error(`Unexpectedly showing old 0781 page`);
    }
  },

  'new-disabilities/add': () => {
    cy.get('@testData').then(data => {
      data.newDisabilities.forEach((disability, index) => {
        const autocomplete = `[id="root_newDisabilities_${index}_condition"]`;
        const input = '#inputField';
        const option = '[role="option"]';

        // click add another if more than 1
        if (index > 0) {
          cy.findByText(/add another condition/i).click();

          cy.get('va-button[text="Remove"]').should('be.visible');
        }

        // click on input and type search text
        cy.get(autocomplete)
          .shadow()
          .find(input)
          .type(disability.condition, { force: true });

        // select the option based on loop index and then check that the value matches
        if (index === 0) {
          cy.get(option)
            .first()
            .click();

          cy.get(autocomplete)
            .shadow()
            .find(input)
            .should('have.value', disability.condition);
        } else {
          cy.get(option)
            .eq(1)
            .invoke('text')
            .then(selectedOption => {
              cy.get(option)
                .eq(1)
                .click();

              cy.get(autocomplete)
                .shadow()
                .find(input)
                .should('have.value', selectedOption);
            });
        }
        // click save
        cy.get('va-button[text="Save"]').click();
      });
    });
  },

  'new-disabilities/follow-up': () => {
    cy.location('pathname').should(
      'eq',
      '/disability/file-disability-claim-form-21-526ez/new-disabilities/follow-up',
    );

    cy.findByText(/continue/i, { selector: 'button' }).click();
    cy.get('@testData').then(data => {
      data.newDisabilities.forEach((disability, index) => {
        // Loop through each new disability and verify the follow-up pages
        if (!data.standardClaim) {
          // BDD Claim
          cy.fillPage();
          cy.findByText(/continue/i, { selector: 'button' }).click();
        } else {
          // Standard Claim
          cy.log(`Processing disability ${index + 1}: ${disability.condition}`);
          // Wait for the correct follow-up page to load
          cy.url().should('match', /new-disabilities\/follow-up\/\d+/);
          cy.get(
            'legend[class="schemaform-block-title schemaform-title-underline"]',
          ).should('contain', capitalizeEachWord(disability.condition));
          // Check that we're on the correct follow-up page
          if (disability.cause === 'NEW') {
            // NEW conditions (asthma, PTSD) should show primary description page
            cy.get(`input[value="NEW"]`).click();

            // Fill in the primary description
            cy.get('textarea[id="root_primaryDescription"]')
              .should('be.visible')
              .clear();
            cy.get('textarea[id="root_primaryDescription"]').click();
            cy.get('textarea[id="root_primaryDescription"]').type(
              disability.primaryDescription,
            );
            cy.findByText(/continue/i, { selector: 'button' }).should(
              'be.visible',
            );
            cy.findByText(/continue/i, { selector: 'button' }).click();
          } else if (disability.cause === 'SECONDARY') {
            // SECONDARY conditions should show secondary follow-up page
            cy.get(`input[value="SECONDARY"]`).click();

            // Select the disability that caused this one
            cy.get(
              'select[id="root_view:secondaryFollowUp_causedByDisability"]',
            )
              .should('be.visible')
              .select(disability['view:secondaryFollowUp'].causedByDisability);

            // Fill in the description
            cy.get(
              'textarea[id="root_view:secondaryFollowUp_causedByDisabilityDescription"]',
            )
              .should('be.visible')
              .clear();
            cy.get(
              'textarea[id="root_view:secondaryFollowUp_causedByDisabilityDescription"]',
            ).type(
              disability['view:secondaryFollowUp']
                .causedByDisabilityDescription,
            );

            cy.findByText(/continue/i, { selector: 'button' }).click();
          } else if (disability.cause === 'WORSENED') {
            // WORSENED conditions should show worsened follow-up page
            cy.get(`input[value="WORSENED"]`).click();

            // Fill in worsened description
            cy.get(
              'input[name="root_view:worsenedFollowUp_worsenedDescription"]',
            )
              .should('be.visible')
              .clear();

            cy.get(
              'input[name="root_view:worsenedFollowUp_worsenedDescription"]',
            ).type(disability['view:worsenedFollowUp'].worsenedDescription);

            cy.get('textarea[id="root_view:worsenedFollowUp_worsenedEffects"]')
              .should('be.visible')
              .clear();

            cy.get(
              'textarea[id="root_view:worsenedFollowUp_worsenedEffects"]',
            ).type(disability['view:worsenedFollowUp'].worsenedEffects);

            cy.findByText(/continue/i, { selector: 'button' }).click();
          } else if (disability.cause === 'VA') {
            // VA conditions should show VA mistreatment follow-up page
            cy.get(`input[value="VA"]`).click();

            // Fill in VA mistreatment details
            cy.get(
              'textarea[id="root_view:vaFollowUp_vaMistreatmentDescription"]',
            )
              .should('be.visible')
              .clear();
            cy.get(
              'textarea[id="root_view:vaFollowUp_vaMistreatmentDescription"]',
            ).type(disability['view:vaFollowUp'].vaMistreatmentDescription);

            cy.get('input[id="root_view:vaFollowUp_vaMistreatmentLocation"]')
              .should('be.visible')
              .clear();
            cy.get(
              'input[id="root_view:vaFollowUp_vaMistreatmentLocation"]',
            ).type(disability['view:vaFollowUp'].vaMistreatmentLocation);

            cy.get('input[id="root_view:vaFollowUp_vaMistreatmentDate"]')
              .should('be.visible')
              .clear();
            cy.get('input[id="root_view:vaFollowUp_vaMistreatmentDate"]').type(
              disability['view:vaFollowUp'].vaMistreatmentDate,
            );

            cy.findByText(/continue/i, { selector: 'button' }).click();
          }
          // Verify we've moved to the next page or completed the flow
          if (index < data.newDisabilities.length - 1) {
            // Should be on the next disability's follow-up page
            cy.url().should('match', /new-disabilities\/follow-up\/\d+/);
          } else {
            // Should have moved past all follow-up pages
            cy.url().should('not.match', /new-disabilities\/follow-up/);
          }
        }
      });
    });
  },

  'supporting-evidence/evidence-types': () => {
    cy.get('@testData').then(data => {
      if (
        data?.['view:uploadPrivateRecordsQualifier']?.[
          'view:hasPrivateRecordsToUpload'
        ] === true
      ) {
        data?.privateMedicalRecordAttachments.forEach(attachment => {
          if (attachment.name.endsWith('.PDF')) {
            cy.get(
              '[type="radio"][id="root_view:hasEvidenceYesinput"][value="Y"]',
            ).check({ force: true });
            cy.get(
              'input[type="checkbox"][name="root_view:selectableEvidenceTypes_view:hasPrivateMedicalRecords"]',
            ).check({
              force: true,
            });
            cy.findByText(/continue/i, { selector: 'button' }).click();
          }
        });
      }
      cy.fillPage();
    });
  },

  'supporting-evidence/private-medical-records': () => {
    cy.get('@testData').then(data => {
      cy.fillPage();
      // old flow
      if (
        data?.disability526Enable2024Form4142 !== true &&
        data?.['view:hasEvidence'] === true &&
        data?.['view:selectableEvidenceTypes'][
          'view:hasPrivateMedicalRecords'
        ] === true &&
        data?.['view:uploadPrivateRecordsQualifier']?.[
          'view:hasPrivateRecordsToUpload'
        ] !== true
      ) {
        // authorization checkbox is visible
        cy.get('h3')
          .invoke('text')
          .then(textValue => {
            expect(textValue).to.include('Authorize us to get your records');
          });
        cy.get('.form-checkbox').should('exist');
        cy.get(
          'input[type="checkbox"][name="root_view:patientAcknowledgement_view:acknowledgement"]',
        ).check({ force: true });
      } else if (
        // new flow
        data?.disability526Enable2024Form4142 === true &&
        data?.['view:hasEvidence'] === true &&
        data?.['view:selectableEvidenceTypes'][
          'view:hasPrivateMedicalRecords'
        ] === true
      ) {
        cy.get('.form-checkbox').should('not.exist');
      }
      cy.findByText(/continue/i, { selector: 'button' }).click();
    });
  },

  'supporting-evidence/private-medical-records-authorize-release': () => {
    cy.get('@testData').then(data => {
      if (data.disability526Enable2024Form4142 !== true) {
        throw new Error(`Unexpectedly showing new 4142 page`);
      }
      if (data.patient4142Acknowledgement === true) {
        cy.get('h3')
          .invoke('text')
          .then(textValue => {
            expect(textValue).to.include(
              'Authorize the release of non-VA medical records to VA',
            );
          });
        cy.get('input[name="privacy-agreement"]').focus();
        cy.get('input[name="privacy-agreement"]').click({ force: true });
      }
    });
    cy.findByText(/continue/i, { selector: 'button' }).click();
  },

  'supporting-evidence/private-medical-records-release': () => {
    cy.get('@testData').then(data => {
      if (
        data?.disability526Enable2024Form4142 === true &&
        data?.['view:hasEvidence'] === true &&
        data?.['view:selectableEvidenceTypes'][
          'view:hasPrivateMedicalRecords'
        ] === true &&
        data?.['view:uploadPrivateRecordsQualifier']?.[
          'view:hasPrivateRecordsToUpload'
        ] !== true
      ) {
        data.newDisabilities.map(disability => {
          const condition = sippableId(disability.condition);
          return cy
            .get(
              `input[name="root_providerFacility_0_treatedDisabilityNames_${condition}`,
            )
            .should('be.visible');
        });
      }
      cy.fillPage();
    });
  },

  'supporting-evidence/private-medical-records-upload': () => {
    cy.get('@testData').then(data => {
      if (
        data?.['view:uploadPrivateRecordsQualifier']?.[
          'view:hasPrivateRecordsToUpload'
        ] === true
      ) {
        cy.get('input[type="file"]').selectFile(
          'src/applications/disability-benefits/all-claims/tests/fixtures/data/foo_protected.PDF',
          { force: true },
        );
        cy.findByText(/foo_protected.PDF/i).should('exist');

        cy.get('.schemaform-file-uploading').should('not.exist');

        cy.findByText(
          /This is an encrypted PDF document. In order for us to be able to view the document, we will need the password to decrypt it./,
        ).should('exist');
        cy.get('input[name="get_password_0"]').focus();
        cy.get('input[name="get_password_0"]').should('exist');
        cy.get('input[name="get_password_0"]').blur();

        cy.get('input[name="get_password_0"]').should('be.visible');
        cy.get('va-button[text="Add password"]').should('be.visible');

        // Enter password
        cy.get('input[name="get_password_0"]').clear();
        cy.get('input[name="get_password_0"]').type('dancing');

        cy.get('va-button[text="Add password"]').then($btn => {
          const webComponent = $btn[0];
          const shadowButton = webComponent.shadowRoot.querySelector('button');
          cy.get(shadowButton).should('be.visible');
          cy.get(shadowButton).focus();
          shadowButton.click({ force: true });
          cy.log('shadow button');
        });

        cy.wait('@uploadFile').then(({ _request, response }) => {
          expect(response.statusCode).to.eq(200);
          cy.log('File upload successful');
        });
        cy.get('strong')
          .contains('The PDF password has been added.')
          .should('be.visible');

        cy.get('select')
          .contains(
            'option',
            'Medical Treatment Record - Non-Government Facility',
          )
          .parent()
          .select('L049');

        cy.wait('@saveInProgressForm').then(({ _request, response }) => {
          expect(response.statusCode).to.eq(200);
          cy.log('File Type selection successful');
        });
      }
      cy.findByText(/continue/i, { selector: 'button' }).click();
    });
  },

  'disabilities/rated-disabilities': () => {
    cy.get('@testData').then(data => {
      data.ratedDisabilities.forEach((disability, index) => {
        if (disability['view:selected']) {
          cy.get(`input[name="root_ratedDisabilities_${index}"]`).click();
        }
      });
    });
  },

  'payment-information': () => {
    cy.get('@testData').then(data => {
      if (data['view:bankAccount']) {
        cy.get('form.rjsf').then($form => {
          const editButton = $form.find('.usa-button-primary.edit-button');
          if (editButton) editButton.click();
        });

        cy.fillPage();
        cy.findByText(/save/i, { selector: 'button' }).click();
      }
    });
  },

  'review-and-submit': ({ afterHook }) => {
    cy.get('@testData').then(data => {
      if (
        data?.disability526Enable2024Form4142 === true &&
        data?.['view:hasEvidence'] === true &&
        data?.['view:selectableEvidenceTypes'][
          'view:hasPrivateMedicalRecords'
        ] === true &&
        data?.['view:uploadPrivateRecordsQualifier']?.[
          'view:hasPrivateRecordsToUpload'
        ] !== true
      ) {
        cy.get('h3')
          .invoke('text')
          .then(textValue => {
            expect(textValue).to.include('Supporting evidence');
          });
        cy.contains('h3', 'Supporting evidence').click();
        cy.get('div[name="providerFacility"]')
          .contains('Name of private provider or hospital')
          .its('length')
          .should('eq', 1);
        const newProviderFacility = {
          providerFacilityName: 'New Provider Facility',
          providerFacilityAddress: {
            street: '123 New St',
            city: 'New City',
            state: 'NY',
            postalCode: '12345',
            country: 'USA',
          },
          treatedDisabilityNames: {
            'ankle replacement (ankle arthroplasty), bilateral': true,
            'heart attack (myocardial infarction)': true,
          },
          treatmentDateRange: {
            from: '01/02/2020',
            fromYear: '2020',
            fromMonth: '1',
            fromDay: '2',
            to: '12/07/2020',
            toYear: '2020',
            toMonth: '12',
            toDay: '7',
          },
        };
        cy.findByText(/add another provider or hospital/i).click();
        // verify that the treated disability name checkboxes are visible and clickable
        const ratedDisabilitiesCount = data?.ratedDisabilities.filter(
          disability => disability['view:selected'] === true,
        ).length;
        const expectedCount =
          data?.newDisabilities.length + ratedDisabilitiesCount;

        cy.get('input[name^="root_treatedDisabilityNames"]').should(
          'have.length',
          expectedCount,
        );
        cy.get(
          'input[name="root_treatedDisabilityNames1_anklereplacementanklearthroplastybilateral"]',
        )
          .should('exist')
          .and('be.visible')
          .and('be.enabled');

        cy.get('input[name="root_providerFacilityName1"]').type(
          newProviderFacility.providerFacilityName,
        );
        cy.get('input[name="root_providerFacilityAddress1_street1"]').type(
          newProviderFacility.providerFacilityAddress.street,
        );
        cy.get('input[name="root_providerFacilityAddress1_city1"]').type(
          newProviderFacility.providerFacilityAddress.city,
        );
        cy.get('select[name="root_providerFacilityAddress1_state1"]').select(
          newProviderFacility.providerFacilityAddress.state,
        );
        cy.get('input[name="root_providerFacilityAddress1_postalCode1"]').type(
          newProviderFacility.providerFacilityAddress.postalCode,
        );
        cy.get('select[name="root_providerFacilityAddress1_country1"]').select(
          newProviderFacility.providerFacilityAddress.country,
        );
        cy.get(
          'input[name="root_treatedDisabilityNames1_anklereplacementanklearthroplastybilateral"]',
        ).check();
        cy.get(
          'input[name="root_treatedDisabilityNames1_heartattackmyocardialinfarction"]',
        ).check();
        cy.get('select[name="root_treatmentDateRange1_from1Month"]').select(
          newProviderFacility.treatmentDateRange.fromMonth.toString(),
        );
        cy.get('input[name="root_treatmentDateRange1_from1Year"]').type(
          `${newProviderFacility.treatmentDateRange.fromYear}`,
        );
        cy.get('select[name="root_treatmentDateRange1_from1Day"]').select(
          `${newProviderFacility.treatmentDateRange.fromDay}`,
        );
        cy.get('select[name="root_treatmentDateRange1_to1Month"]').select(
          `${newProviderFacility.treatmentDateRange.toMonth}`,
        );
        cy.get('select[name="root_treatmentDateRange1_to1Day"]').select(
          `${newProviderFacility.treatmentDateRange.toDay}`,
        );
        cy.get('input[name="root_treatmentDateRange1_to1Year"]').type(
          `${newProviderFacility.treatmentDateRange.toYear}`,
        );
        cy.findByText('Update', { selector: 'button' })
          .should('exist')
          .click();
        cy.get('div[name="providerFacility-1"]')
          .should('be.visible')
          .within(() => {
            cy.findByText(newProviderFacility.providerFacilityName).should(
              'exist',
            );
            cy.findByText(
              newProviderFacility.providerFacilityAddress.country.toString(),
            ).should('exist');
            cy.findByText(
              newProviderFacility.providerFacilityAddress.street,
            ).should('exist');
            cy.findByText(
              newProviderFacility.providerFacilityAddress.city,
            ).should('exist');
            cy.findByText('New York').should('exist');
            cy.findByText(
              newProviderFacility.providerFacilityAddress.postalCode,
            ).should('exist');
            cy.findByText(
              /ankle replacement \(ankle arthroplasty\), bilateral/i,
            ).should('exist');
            cy.findByText(/heart attack \(myocardial infarction\)/i).should(
              'exist',
            );
            cy.findByText(newProviderFacility.treatmentDateRange.from).should(
              'exist',
            );
            cy.findByText(newProviderFacility.treatmentDateRange.to).should(
              'exist',
            );
            cy.get('va-button[text="Edit"]').should('be.visible');
            cy.get('va-button[text="Edit"]').click();
            cy.findByText('New Provider or hospital').should('exist');
            cy.get('button[aria-label="Remove Provider or hospital"]').click();
            cy.findByText('New Provider or hospital').should('not.exist');
          });
      }
    });
    afterHook(() => {
      reviewAndSubmitPageFlow(cy);
    });
  },

  confirmation: ({ afterHook }) => {
    cy.url().should('include', '/confirmation');
    cy.get('va-button[text="Print this page for your records"]', {
      timeout: 30000,
    }).should('exist');

    // Only verify detailed confirmation content if the confirmation review toggle is enabled
    if (testOptions?.showConfirmationReview) {
      cy.log('Confirmation review toggle enabled, verifying submitted info');

      cy.get(
        'va-accordion-item[header*="Information you submitted on this form"]',
      )
        .should('exist')
        .then($accordion => {
          if (!$accordion.attr('open')) {
            cy.wrap($accordion).click();
          }
        });

      // Wait for accordion content to be visible
      cy.get('.confirmation-chapter-section-collection').should('be.visible');

      cy.get('@testData').then(data => {
        cy.verifyVeteranDetails(data);
        cy.verifyConditions(data);
        cy.verifyToxicExposure(data);
        cy.verifySupportingEvidence(data);
        cy.verifyAdditionalInformation(data);
      });
    } else {
      cy.log(
        'Confirmation review toggle not enabled, skipping detailed verification',
      );
    }

    afterHook(() => {
      cy.expandAccordions();
      cy.injectAxe();
      cy.axeCheck('main', {
        rules: {
          'definition-list': { enabled: false },
          list: { enabled: false },
        },
      });
    });
  },
});
