import moment from 'moment';

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
  SHOW_TOXIC_EXPOSURE,
} from '../constants';
import { toxicExposurePages } from '../pages/toxicExposure/toxicExposurePages';

const todayPlus120 = moment()
  .add(120, 'days')
  .format('YYYY-M-D')
  .split('-');

export const mockItf = {
  data: {
    id: '',
    type: 'evss_intent_to_file_intent_to_files_responses',
    attributes: {
      intentToFile: [
        {
          id: '1',
          creationDate: '2014-07-28T19:53:45.810+00:00',
          expirationDate: moment()
            .add(1, 'd')
            .format(),
          participantId: 1,
          source: 'EBN',
          status: 'active',
          type: 'compensation',
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
};

/**
 * Get the toggle value within a given list of toggles and for a given a name
 * @param {object} toggles - feature toggles object, based on api response
 * @param {string} name - unique name for the toggle
 * @returns {boolean} true if the toggle is enabled, false otherwise
 */
function getToggleValue(toggles, name) {
  return toggles.data.features.find(item => item.name === name)?.value;
}

/**
 * Setup for the e2e test, including any cleanup and mocking api responses
 * @param {object} cy
 * @param {object} toggles - feature toggles object, based on api response
 */
export const setup = (cy, toggles = mockFeatureToggles) => {
  window.sessionStorage.setItem(SHOW_8940_4192, 'true');
  window.sessionStorage.removeItem(WIZARD_STATUS);
  window.sessionStorage.removeItem(FORM_STATUS_BDD);
  window.sessionStorage.removeItem(SHOW_TOXIC_EXPOSURE);

  cy.intercept('GET', '/v0/feature_toggles*', toggles);

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

    cy.intercept('GET', `${MOCK_SIPS_API}*`, {
      formData: {
        ...mockPrefill.formData,
        disabilities: sanitizedRatedDisabilities,
        servicePeriods: data.serviceInformation.servicePeriods,
        reservesNationalGuardService:
          data.serviceInformation.reservesNationalGuardService,
      },
      metadata: mockPrefill.metadata,
    });
  });
};

/**
 * Build a list of unreleased pages using the given toggles
 *
 * @param {object} toggles - feature toggles object, based on api response
 * @returns {string[]} - list of paths for unreleased pages
 */
function getUnreleasedPages(toggles) {
  // if toxic exposure toggle is disabled, add those pages to the unreleased pages list
  if (getToggleValue(toggles, 'disability_526_toxic_exposure') !== true) {
    return Object.keys(toxicExposurePages).map(page => {
      return toxicExposurePages[page].path;
    });
  }

  return [];
}

/**
 * For each unreleased page, create the page hook to throw an error if the page loads
 * @param {object} toggles - feature toggles object, based on api response
 * @returns {object} object with page hook for each unreleased page
 */
function makeUnreleasedPageHooks(toggles) {
  const pages = getUnreleasedPages(toggles);

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

export const pageHooks = (cy, toggles = mockFeatureToggles) => ({
  start: () => {
    // skip wizard
    cy.findByText(/apply now/i).click();
  },

  introduction: () => {
    cy.get('@testData').then(data => {
      if (data['view:isBddData']) {
        window.sessionStorage.setItem(
          SAVED_SEPARATION_DATE,
          todayPlus120.join('-'),
        );
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

  'review-veteran-details/military-service-history': () => {
    cy.get('@testData').then(data => {
      cy.fillPage();
      if (data['view:isBddData']) {
        cy.get('select[name$="_dateRange_toMonth"]').select(todayPlus120[1]);
        cy.get('select[name$="_dateRange_toDay"]').select(todayPlus120[2]);
        cy.get('input[name$="_dateRange_toYear"]')
          .clear()
          .type(todayPlus120[0]);
      }
    });
  },

  'review-veteran-details/military-service-history/federal-orders': () => {
    cy.get('@testData').then(data => {
      cy.fillPage();
      if (
        data.serviceInformation.reservesNationalGuardService[
          'view:isTitle10Activated'
        ]
      ) {
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
  ...makeUnreleasedPageHooks(toggles),
});
