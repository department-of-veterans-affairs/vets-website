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
import * as aiqHelpers from './helpers';

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

  /* eslint-disable va/axe-check-required */
  // AXE check in last test (toggle-section).
  it('works with AIQ (Yes selected) - C12901', () => {
    cy.visit(manifest.rootUrl);
    cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);
    cy.findAllByText(/apply.+health care/i, { selector: 'h1' })
      .first()
      .should('exist');

    // Advance to AIQ page
    aiqHelpers.advanceToAiqPage();

    // Check required-field error-message
    aiqHelpers.goToNextPage();
    cy.get('#root_sigiIsAmericanIndian-error-message').should('be.visible');

    // Select Yes
    cy.get('#root_sigiIsAmericanIndianYes[type="radio"]').check();

    // Finish, review, & submit
    aiqHelpers.advanceFromAiqToReviewPage();
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

  it('works with AIQ (No selected) - C13159', () => {
    cy.visit(manifest.rootUrl);
    cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);
    cy.findAllByText(/apply.+health care/i, { selector: 'h1' })
      .first()
      .should('exist');

    // Advance to AIQ page
    aiqHelpers.advanceToAiqPage();

    // Select No
    cy.get('#root_sigiIsAmericanIndianNo[type="radio"]').check();

    // Finish, review, & submit
    aiqHelpers.advanceFromAiqToReviewPage();
    cy.findByText(/veteran information/i, { selector: 'button' }).click();
    cy.findByText(/american indian/i, { selector: 'dt' })
      .next('dd')
      .find('span:first-child')
      .should('have.text', 'No');
    cy.get('[name="privacyAgreementAccepted"]')
      .scrollIntoView()
      .check();
    cy.findByText(/submit/i, { selector: 'button' }).click();
    cy.wait('@mockSubmit').then(interception => {
      // check submitted AIQ value.
      cy.wrap(JSON.parse(interception.request.body.form))
        .its('sigiIsAmericanIndian')
        .should('be.false');
    });
    cy.location('pathname').should('include', '/confirmation');
  });

  it('displays error message for required field - C13160', () => {
    cy.visit(manifest.rootUrl);
    cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);
    cy.findAllByText(/apply.+health care/i, { selector: 'h1' })
      .first()
      .should('exist');

    // Advance to AIQ page
    aiqHelpers.advanceToAiqPage();

    // Continue w/o selecting yes/no
    aiqHelpers.goToNextPage();
    cy.get('#root_sigiIsAmericanIndian-error-message').should('be.visible');
  });
  /* eslint-enable va/axe-check-required */

  it('expands/collapses toggle-section - C13161', () => {
    cy.visit(manifest.rootUrl);
    cy.wait(['@mockUser', '@mockFeatures', '@mockEnrollmentStatus']);
    cy.findAllByText(/apply.+health care/i, { selector: 'h1' })
      .first()
      .should('exist');

    // Advance to AIQ page
    aiqHelpers.advanceToAiqPage();
    cy.injectAxe();
    cy.axeCheck();

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
            const acId = `#${ariaCtrlsId}`;
            cy.get(acId)
              .children()
              .should('have.length.gt', 0);
            cy.injectAxe();
            cy.axeCheck();
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
            const acId = `#${ariaCtrlsId}`;
            cy.get(acId)
              .children()
              .should('have.length', 0);
          });
      });
  });
});
