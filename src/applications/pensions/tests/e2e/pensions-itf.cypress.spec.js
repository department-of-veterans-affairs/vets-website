import { setupInProgressReturnUrl } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import loggedInUser from '../fixtures/mocks/loggedInUser.json';
import mockStatus from '../fixtures/mocks/profile-status.json';
import mockVamc from '../fixtures/mocks/vamc-ehr.json';
import mockPrefill from '../fixtures/mocks/prefill.json';
import inProgressForms from '../fixtures/mocks/in-progress-forms.json';

import { cypressBeforeAllSetup } from './cypress.setup';
import { mockItf, errorItf, postItf } from './helpers/itfHelpers';

const FORM_ID = '21P-527EZ';
const TEST_URL =
  '/pension/apply-for-veteran-pension-form-21p-527ez/introduction';
const IN_PROGRESS_URL = `/v0/in_progress_forms/${FORM_ID}`;

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
      // Set up in progress form to go to returnUrl on continuing a form
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

describe('Pensions ITF', () => {
  before(() => {
    cypressBeforeAllSetup();
  });

  it('should show ITF found alert', () => {
    cy.intercept('GET', '/v0/intent_to_file/pension', mockItf());

    cypressSetup(cy);
    cy.clickStartForm();

    cy.get('va-alert[status="success"]')
      .should('be.visible')
      .then($el => {
        cy.wrap($el)
          .find('h2')
          .should('contain', 'We have your intent to file');
      });
    cy.injectAxe();
    cy.axeCheck();
  });

  it('should show ITF created alert with too old active ITF', () => {
    cy.intercept('GET', '/v0/intent_to_file/pension', mockItf({ years: -2 }));
    cy.intercept('POST', '/v0/intent_to_file/pension', postItf());

    cypressSetup(cy);
    cy.clickStartForm();

    cy.get('va-alert[status="success"]')
      .should('be.visible')
      .then($el => {
        cy.wrap($el)
          .find('h2')
          .should('contain', 'We recorded your intent to file');

        cy.injectAxe();
        cy.axeCheck();
      });
  });

  it('should show ITF created alert if current ITF has already been used', () => {
    cy.intercept(
      'GET',
      '/v0/intent_to_file/pension',
      mockItf({ months: -6 }, 'claim_recieved'),
    );
    cy.intercept('POST', '/v0/intent_to_file/pension', postItf());

    cypressSetup(cy);
    cy.clickStartForm();

    cy.get('va-alert[status="success"]')
      .should('be.visible')
      .then($el => {
        cy.wrap($el)
          .find('h2')
          .should('contain', 'We recorded your intent to file');
        cy.injectAxe();
        cy.axeCheck();
      });
  });

  it('should show we can’t confirm error alert after creation error', () => {
    cy.intercept('GET', '/v0/intent_to_file/pension', mockItf({ years: -2 }));
    cy.intercept('POST', '/v0/intent_to_file/pension', errorItf());

    cypressSetup(cy);
    cy.clickStartForm();

    cy.get('va-alert[status="warning"]')
      .should('be.visible')
      .then($el => {
        cy.wrap($el)
          .find('h2')
          .should('contain', 'You can call to confirm your intent to file');

        cy.injectAxe();
        cy.axeCheck();
      });
  });

  it('should show we can’t confirm error alert after fetch & creation error', () => {
    cy.intercept('GET', '/v0/intent_to_file/pension', errorItf());
    cy.intercept('POST', '/v0/intent_to_file/pension', errorItf());

    cypressSetup(cy);
    cy.clickStartForm();

    cy.get('va-alert[status="warning"]')
      .should('be.visible')
      .then($el => {
        cy.wrap($el)
          .find('h2')
          .should('contain', 'You can call to confirm your intent to file');
        cy.injectAxe();
        cy.axeCheck();
      });
  });
});
