/* eslint-disable camelcase */
import { setupInProgressReturnUrl } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import loggedInUser from '../fixtures/mocks/loggedInUser.json';
import mockStatus from '../fixtures/mocks/profile-status.json';
import mockVamc from '../fixtures/mocks/vamc-ehr.json';
import mockPrefill from '../fixtures/mocks/prefill.json';
import inProgressForms from '../fixtures/mocks/in-progress-forms.json';

import { cypressBeforeAllSetup } from './cypress.setup';

const FORM_ID = '21P-527EZ';
const TEST_URL =
  '/pension/apply-for-veteran-pension-form-21p-527ez/introduction';
const IN_PROGRESS_URL = `/v0/in_progress_forms/${FORM_ID}`;
const DISABILITY_RATING_URL = '/v0/rated_disabilities';

const isCI = Cypress.env('CI') || Cypress.env('CYPRESS_CI');

const cypressSetup = ({
  authenticated = true,
  returnUrl,
  prefill = {},
} = {}) => {
  const features = {
    data: {
      features: [
        {
          name: 'pension_form_enabled',
          value: true,
        },
      ],
    },
  };

  cy.intercept('GET', '/v0/feature_toggles*', features);
  cy.intercept('GET', '/data/cms/vamc-ehr.json', mockVamc);

  if (authenticated) {
    if (returnUrl) {
      setupInProgressReturnUrl({
        formConfig,
        returnUrl,
        prefill,
        user: loggedInUser,
      });
    } else {
      cy.intercept('GET', IN_PROGRESS_URL, mockPrefill);
      cy.login(loggedInUser);
    }
    cy.intercept('PUT', IN_PROGRESS_URL, inProgressForms);
  }

  cy.intercept('GET', '/v0/profile/status', mockStatus).as('loggedIn');
  cy.visit(TEST_URL);
};

describe.skip('Pensions — Disability Rating Alert', () => {
  before(() => {
    cypressBeforeAllSetup();
  });

  it('shows 100% disability rating info alert', () => {
    cy.intercept('GET', DISABILITY_RATING_URL, {
      data: {
        type: 'disability_ratings',
        attributes: { combinedDisabilityRating: 100 },
      },
    });

    cypressSetup();

    cy.get('va-alert[status="warning"]')
      .should('be.visible')
      .then($el => {
        cy.wrap($el)
          .find('h2')
          .should(
            'contain',
            'You’re unlikely to get a higher payment from a Veterans Pension',
          );
      });

    cy.injectAxe();
    cy.axeCheck();
  });

  it('renders no alert when rating is less than 100', () => {
    cy.intercept('GET', DISABILITY_RATING_URL, {
      data: {
        type: 'disability_ratings',
        attributes: { combinedDisabilityRating: 70 },
      },
    });

    cypressSetup();

    cy.get('va-alert').should('not.exist');

    cy.injectAxe();
    cy.axeCheck();
  });

  (isCI ? it.skip : it)(
    'shows fallback alert when rating API fails (e.g. 401)',
    () => {
      cy.intercept('GET', DISABILITY_RATING_URL, {
        statusCode: 401,
        body: {
          errors: [
            {
              title: 'Unauthorized',
              detail: 'You must be signed in to access this resource',
              status: '401',
            },
          ],
        },
      });

      cypressSetup();

      cy.get('va-alert')
        .should('be.visible')
        .then($el => {
          cy.wrap($el)
            .find('h2')
            .should(
              'contain',
              'A 100% disability rating pays more than a Veterans Pension',
            );
        });

      cy.injectAxe();
      cy.axeCheck();
    },
  );
});
