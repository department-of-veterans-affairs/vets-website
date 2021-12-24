/**
 * [TestRail-integrated] Spec for Medical Copays
 * @testrailinfo projectId 10
 * @testrailinfo suiteId 11
 * @testrailinfo groupId 3267
 * @testrailinfo runName HCA-e2e-AIQ
 */

import manifest from '../manifest.json';
import featureToggles from './mocks/feature-toggles-aiq.json';
import mockUserAiq from './fixtures/mocks/mockUserAiq';
import enrollmentStatus from './fixtures/mocks/mockEnrollmentStatus.json';
import prefillAiq from './fixtures/mocks/mockPrefillAiq.json';
import minTestData from './schema/minimal-test.json';
import moment from 'moment';

describe('HCA-AIQ', () => {
  const mockUserAttrs = mockUserAiq.data.attributes;
  const testData = minTestData.data;
  const goToNextPage = pagePath => {
    // Clicks Continue button, and optionally checks destination path.
    cy.findAllByText(/continue/i, { selector: 'button' })
      .first()
      .scrollIntoView()
      .click();
    if (pagePath) {
      cy.location('pathname').should('include', pagePath);
    }
  };
  const advanceToAiqPage = () => {
    cy.findAllByText(/start.+application/i, { selector: 'button' })
      .first()
      .click();
    cy.wait('@mockSip');
    cy.location('pathname').should(
      'include',
      '/veteran-information/personal-information',
    );
    goToNextPage('/veteran-information/birth-information');
    goToNextPage('/veteran-information/birth-sex');
    goToNextPage('/veteran-information/marital-status');
    cy.get('select#root_maritalStatus').select(testData.maritalStatus);
    goToNextPage('/veteran-information/demographic-information');
    goToNextPage('/veteran-information/american-indian');
  };
  const advanceToReviewPage = () => {
    goToNextPage('/veteran-information/veteran-address');
    cy.get('[type=radio]')
      .first()
      .scrollIntoView()
      .check('Y');
    goToNextPage('/veteran-information/contact-information');
    cy.wait('@mockSip');
    cy.get('[name*="emailConfirmation"]')
      .scrollIntoView()
      .type(mockUserAttrs.profile.email);
    goToNextPage('/military-service/service-information');
    goToNextPage('/military-service/additional-information');
    goToNextPage('/va-benefits/basic-information');
    cy.get('[name="root_vaCompensationType"]').check('none');
    goToNextPage('/va-benefits/pension-information');
    cy.get('[name="root_vaPensionType"]').check('No');
    goToNextPage('/household-information/financial-disclosure');
    cy.get('[name="root_discloseFinancialInformation"]').check('N');
    goToNextPage('/insurance-information/medicaid');
    cy.get('[name="root_isMedicaidEligible"]').check('N');
    goToNextPage('/insurance-information/medicare');
    cy.get('[name="root_isEnrolledMedicarePartA"]').check('N');
    goToNextPage('/insurance-information/general');
    cy.get('[name="root_isCoveredByHealthInsurance"]').check('N');
    goToNextPage('/insurance-information/va-facility');
    cy.get('[name="root_view:preferredFacility_view:facilityState"]').select(
      testData['view:preferredFacility']['view:facilityState'],
    );
    cy.wait('@mockSip');
    cy.get('[name="root_view:preferredFacility_vaMedicalFacility"]').select(
      testData['view:preferredFacility'].vaMedicalFacility,
    );
    goToNextPage('review-and-submit');
  };

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
    advanceToAiqPage();
    cy.injectAxe();
    cy.axeCheck();

    // Check required-field error-message
    goToNextPage();
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
    goToNextPage('/veteran-information/veteran-address');

    // Back & select Yes
    cy.findByText(/back/i, { selector: 'button' }).click();
    cy.location('pathname').should(
      'include',
      '/veteran-information/american-indian',
    );
    cy.get('#root_sigiIsAmericanIndianYes').check();

    // Finish, review, & submit
    advanceToReviewPage();
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
      cy.wrap(JSON.parse(interception.request.body.form))
        .its('sigiIsAmericanIndian')
        .should('be.true');
    });
    cy.location('pathname').should('include', '/confirmation');
  });
});
