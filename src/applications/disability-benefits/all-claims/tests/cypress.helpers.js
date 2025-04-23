import { add, format, formatISO } from 'date-fns';

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
  MOCK_SIPS_API,
  WIZARD_STATUS,
  FORM_STATUS_BDD,
  SHOW_8940_4192,
  SAVED_SEPARATION_DATE,
} from '../constants';

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
          expirationDate: formatISO(add(new Date(), offset)),
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
          expirationDate: '2015-08-28T19:47:52.789+00:00',
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

/**
 * Setup for the e2e test, including any cleanup and mocking api responses
 * @param {object} cy
 * @param {object} testOptions - object with optional prefill data or toggles
 */
export const setup = (cy, testOptions = {}) => {
  window.sessionStorage.setItem(SHOW_8940_4192, 'true');
  window.sessionStorage.removeItem(WIZARD_STATUS);
  window.sessionStorage.removeItem(FORM_STATUS_BDD);

  cy.intercept(
    'GET',
    '/v0/feature_toggles*',
    testOptions?.toggles || mockFeatureToggles,
  );

  // `mockItf` is not a fixture; it can't be loaded as a fixture
  // because fixtures don't evaluate JS.
  cy.intercept('GET', '/v0/intent_to_file', mockItf);

  cy.intercept('PUT', `${MOCK_SIPS_API}*`, mockInProgress);

  cy.intercept(
    'GET',
    '/v0/disability_compensation_form/separation_locations',
    mockLocations,
  );

  cy.intercept('GET', '/v0/ppiu/payment_information', mockPayment);

  cy.intercept('POST', '/v0/upload_supporting_evidence', mockUpload);

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

    if (testOptions?.prefillData?.startedFormVersion) {
      formData.startedFormVersion = testOptions.prefillData.startedFormVersion;
    }
    if (testOptions?.prefillData?.syncModern0781Flow) {
      formData.syncModern0781Flow = testOptions.prefillData.syncModern0781Flow;
    }

    cy.intercept('GET', `${MOCK_SIPS_API}*`, {
      formData,
      metadata: mockPrefill.metadata,
    });
  });
};

export const reviewAndSubmitPageFlow = (
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
        const todayPlus120 = format(
          add(new Date(), { days: 120 }),
          'yyyy-M-d',
        ).split('-');
        // active title 10 activation puts this into BDD flow
        cy.get('select[name$="SeparationDateMonth"]').select(todayPlus120[1]);
        cy.get('select[name$="SeparationDateDay"]').select(todayPlus120[2]);
        cy.get('input[name$="SeparationDateYear"]')
          .clear()
          .type(todayPlus120[0]);
      }
    });
  },

  'mental-health-form-0781/workflow': () => {
    cy.get('va-radio-option[value="optForOnlineForm0781"]')
      .find('input[type="radio"]')
      .check({ force: true });

    cy.findByText(/continue/i, { selector: 'button' }).click();
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
    afterHook(() => {
      cy.get('@testData').then(() => {
        reviewAndSubmitPageFlow();
      });
    });
  },
});
