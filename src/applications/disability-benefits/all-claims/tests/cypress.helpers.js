import { add, format, formatISO } from 'date-fns';

import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockPrefill from './fixtures/mocks/prefill.json';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockLocations from './fixtures/mocks/separation-locations.json';
import mockPayment from './fixtures/mocks/payment-information.json';
import mockSubmit from './fixtures/mocks/application-submit.json';
import mockUpload from './fixtures/mocks/document-upload.json';
import mockServiceBranches from './fixtures/mocks/service-branches.json';

import {
  MOCK_SIPS_API,
  WIZARD_STATUS,
  FORM_STATUS_BDD,
  SHOW_8940_4192,
  SAVED_SEPARATION_DATE,
} from '../constants';
import { toxicExposurePages } from '../pages/toxicExposure/toxicExposurePages';

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

    cy.intercept('GET', `${MOCK_SIPS_API}*`, {
      formData,
      metadata: mockPrefill.metadata,
    });
  });
};

/**
 * Build a list of unreleased pages using the given toggles
 *
 * @param {object} testOptions - object with prefill data. can optionally add toggles in future as needed
 * @returns {string[]} - list of paths for unreleased pages
 */
function getUnreleasedPages(testOptions) {
  // if toxic exposure indicator not enabled in prefill data, add those pages to the unreleased pages list
  if (
    testOptions?.prefillData?.startedFormVersion !== '2019' &&
    testOptions?.prefillData?.startedFormVersion !== '2022'
  ) {
    return Object.keys(toxicExposurePages).map(page => {
      return toxicExposurePages[page].path;
    });
  }

  return [];
}

/**
 * For each unreleased page, create the page hook to throw an error if the page loads
 * @param {object} testOptions - object with prefill data. can optionally add toggles in future as needed
 * @returns {object} object with page hook for each unreleased page
 */
function makeUnreleasedPageHooks(testOptions) {
  const pages = getUnreleasedPages(testOptions);

  return Object.assign(
    {},
    ...pages.map(path => {
      return {
        [path]: () => {
          throw new Error(`Unexpectedly showing unreleased page [${path}]`);
        },
      };
    }),
  );
}

export const reviewAndSubmitPageFlow = (
  signerName,
  submitButtonText = 'Submit application',
) => {
  let veteranSignature = signerName;

  if (typeof veteranSignature === 'object') {
    veteranSignature = signerName.middle
      ? `${signerName.first} ${signerName.middle} ${signerName.last}`
      : `${signerName.first} ${signerName.last}`;
  }

  cy.fillVaTextInput('veteran-signature', veteranSignature);
  cy.selectVaCheckbox('veteran-certify', true);
  cy.findByText(submitButtonText, {
    selector: 'button',
  }).click();
};

export const pageHooks = (cy, testOptions = {}) => ({
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

  'review-veteran-details/separation-location': () => {
    cy.get('@testData').then(data => {
      cy.get('input[name="root_serviceInformation_separationLocation"]').type(
        data.serviceInformation.separationLocation.label,
      );
    });
  },

  'new-disabilities/add': () => {
    cy.get('@testData').then(data => {
      data.newDisabilities.forEach((disability, index) => {
        const comboBox = `[id="root_newDisabilities_${index}_condition"]`;
        const input = '#inputField';
        const option = '[role="option"]';

        // click add another if more than 1
        if (index > 0) {
          cy.findByText(/add another condition/i).click();

          cy.findByText(/remove/i, { selector: 'button' }).should('be.visible');
        }

        // click on input and type search text
        cy.get(comboBox)
          .shadow()
          .find(input)
          .type(disability.condition, { force: true });

        // select the option based on loop index and then check that the value matches
        if (index === 0) {
          cy.get(option)
            .first()
            .click();

          cy.get(comboBox)
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

              cy.get(comboBox)
                .shadow()
                .find(input)
                .should('have.value', selectedOption);
            });
        }

        // click save
        cy.findByText(/save/i, { selector: 'button' }).click();
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
  // https://github.com/department-of-veterans-affairs/va.gov-team/issues/96383
  // on local env's, environment.getRawBuildtype() for cypress returns prod but the local instance
  // running the app returns local. leaving this snippet for now in case anyone wants to run e2e
  // locally. this will be uncommented when we launch. note for the e2e test to run properly, the
  // "view:userFullName" object must also be added to the json fixture. see
  // tests/fixtures/data/minimal-test.json for an example
  // 'review-and-submit': ({ afterHook }) => {
  //   afterHook(() => {
  //     cy.get('@testData').then(data => {
  //       // if (environment.isLocalhost()) {
  //       const fullName = data['view:userFullName'];

  //       reviewAndSubmitPageFlow(fullName, 'Submit application');
  //       // }
  //     });
  //   });
  // },
  ...makeUnreleasedPageHooks(testOptions),
});
