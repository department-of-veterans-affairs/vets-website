import { getAppUrl } from 'platform/utilities/registry-helpers';

import mockUser from './user.json';
import mockDependents from './fixtures/mocks/mock-dependents.json';
import maximalTestData from './fixtures/data/maximal-test.json';
import manifest from '../../manifest.json';

const FORM_ID = '21-0538';
const STOP_PAGE = getAppUrl('686C-674-v2');

const cypressSetup = (user = mockUser) => {
  Cypress.config('waitForAnimations', true);
  Cypress.config('scrollBehavior', 'nearest');

  cy.intercept('GET', '/v0/dependents_applications/show', mockDependents);
  cy.intercept('GET', '/v0/feature_toggles?*', {
    data: {
      type: 'feature_toggles',
      features: [{ name: 'vaDependentsVerification', value: true }],
    },
  });
  cy.intercept('GET', '/v0/user', user);

  cy.intercept('GET', `/v0/in_progress_forms/${FORM_ID}`, {
    body: {
      formData: maximalTestData,
      metadata: {},
    },
  });

  cy.intercept('POST', '/dependents_verification/v0/claims', {
    statusCode: 200,
    body: {
      data: {
        attributes: {
          formSubmissionId: '123fake-submission-id-567',
          timestamp: '2023-11-01',
        },
      },
    },
  });

  cy.login(user);
};

describe.skip('Dependents Verification 0538', () => {
  it('should navigate through the form to the confirmation page', () => {
    cypressSetup();

    cy.visit(manifest.rootUrl);
    cy.injectAxeThenAxeCheck();

    cy.url().should('include', '/introduction');
    cy.clickStartForm();

    cy.url().should('include', '/veteran-information');
    cy.injectAxeThenAxeCheck();
    cy.clickFormContinue();

    cy.url().should('include', '/veteran-contact-information');
    cy.injectAxeThenAxeCheck();
    cy.get('va-card').should('contain.text', 'Mailing address');
    cy.clickFormContinue();

    cy.url().should('include', '/dependents');
    cy.injectAxeThenAxeCheck();
    cy.get('va-card').should('contain.text', 'SUE BROOKS');
    // No updates needed
    cy.get('va-radio-option[value="N"]').click();
    cy.clickFormContinue();

    cy.url().should('include', '/review-and-submit');
    cy.injectAxeThenAxeCheck();
    cy.clickFormContinue();

    cy.url().should('include', '/confirmation');
    cy.injectAxeThenAxeCheck();
  });

  it('should navigate through the form to the exit page and then to 686c-674 intro page', () => {
    cypressSetup();

    cy.visit(manifest.rootUrl);
    cy.injectAxeThenAxeCheck();

    cy.url().should('include', '/introduction');
    cy.clickStartForm();

    cy.url().should('include', '/veteran-information');
    cy.injectAxeThenAxeCheck();
    cy.clickFormContinue();

    cy.url().should('include', '/veteran-contact-information');
    cy.injectAxeThenAxeCheck();
    cy.get('va-card').should('contain.text', 'Mailing address');
    cy.clickFormContinue();

    cy.url().should('include', '/dependents');
    cy.injectAxeThenAxeCheck();
    cy.get('va-card').should('contain.text', 'SUE BROOKS');
    // Updates needed, go to exit page then to 686c-674 intro page
    cy.get('va-radio-option[value="Y"]').click();
    cy.clickFormContinue();

    cy.url().should('include', '/exit-form');
    cy.injectAxeThenAxeCheck();
    cy.get('va-button[continue]').click();

    cy.location('pathname').should('eq', `${STOP_PAGE}/introduction`);
  });
});
