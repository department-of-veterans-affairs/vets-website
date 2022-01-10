/**
 * [TestRail-integrated] Spec for Medical Copays
 * @testrailinfo projectId 10
 * @testrailinfo suiteId 11
 * @testrailinfo groupId 3267
 * @testrailinfo runName HCA-e2e-AIQ
 */

import moment from 'moment';

import manifest from '../../manifest.json';
import featureToggles from './fixtures/feature-toggles-aiq.json';
import mockUserAiq from './fixtures/mockUserAiq';
import enrollmentStatus from './fixtures/mockEnrollmentStatus.json';
import prefillAiq from './fixtures/mockPrefillAiq.json';
import * as aiqHelpers from './helpers-aiq';

describe('HCA-AIQ', () => {
  before(function() {
    if (Cypress.env('CI')) this.skip();
  });

  beforeEach(() => {
    cy.login(mockUserAiq);
    cy.intercept('GET', '/v0/feature_toggles*', featureToggles).as(
      'mockFeatures',
    );
    cy.intercept('GET', '/v0/health_care_applications/enrollment_status*', {
      statusCode: 404,
      body: enrollmentStatus,
    }).as('mockEnrollmentStatus');
    cy.intercept('/v0/in_progress_forms/1010ez', {
      statusCode: 200,
      body: prefillAiq,
    }).as('mockSip');
    cy.intercept('POST', '/v0/health_care_applications', {
      statusCode: 200,
      body: {
        formSubmissionId: '123fake-submission-id-567',
        timestamp: moment().format('YYYY-MM-DD'),
      },
    }).as('mockSubmit');
  });

  it('works with AIQ page - C12901', () => {
    cy.visit(manifest.rootUrl);
    cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);
    cy.findAllByText(/apply.+health care/i, { selector: 'h1' })
      .first()
      .should('exist');

    // Advance to AIQ page
    aiqHelpers.advanceToAiqPage();
    cy.injectAxe();
    cy.axeCheck();

    // Check required-field error-message
    aiqHelpers.goToNextPage();
    cy.get('#root_sigiIsAmericanIndian-error-message').should('be.visible');

    // Select No
    cy.get('#root_sigiIsAmericanIndianNo[type="radio"]').check();
    cy.get('#root_sigiIsAmericanIndian-error-message').should('not.exist');

    // Check more-info toggle
    // expand
    cy.findByText(/american indian or alaska native/i, {
      selector: '.additional-info-title',
    })
      .scrollIntoView()
      .click()
      .then(ele => {
        cy.wrap(ele)
          .parent()
          .invoke('attr', 'aria-controls')
          .then(ariaCtrlsId => {
            // eslint-disable-next-line prefer-template
            const acId = '#' + ariaCtrlsId;
            cy.get(acId)
              .children()
              .should('have.length.gt', 0);
          });
      });
    // collapse
    cy.findByText(/american indian or alaska native/i, {
      selector: '.additional-info-title',
    })
      .scrollIntoView()
      .click()
      .then(ele => {
        cy.wrap(ele)
          .parent()
          .invoke('attr', 'aria-controls')
          .then(ariaCtrlsId => {
            // eslint-disable-next-line prefer-template
            const acId = '#' + ariaCtrlsId;
            cy.get(acId)
              .children()
              .should('have.length', 0);
          });
      });

    // Continue to next page
    aiqHelpers.goToNextPage('/veteran-information/veteran-address');

    // Back & select Yes
    cy.findByText(/back/i, { selector: 'button' }).click();
    cy.location('pathname').should(
      'include',
      '/veteran-information/american-indian',
    );
    cy.get('#root_sigiIsAmericanIndianYes').check();

    // Finish, review, & submit
    aiqHelpers.advanceToReviewPage();
    cy.findByText(/veteran information/i, { selector: 'button' }).click();
    cy.findByText(/american indian/i, { selector: 'dt' })
      .next('dd')
      .find('span:first-child')
      .should('have.text', 'Yes');
    cy.get('[name="privacyAgreementAccepted"]')
      .scrollIntoView()
      .check();
    cy.findByText(/submit/i, { selector: 'button' }).click();
    cy.wait('@mockSubmit').then(interception => {
      // check submitted AIQ value.
      cy.wrap(JSON.parse(interception.request.body.form))
        .its('sigiIsAmericanIndian')
        .should('be.true');
    });
    cy.location('pathname').should('include', '/confirmation');
  });
});
