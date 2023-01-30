/// <reference types='cypress' />
import { mockEnrollmentResponse } from '../fixtures/mockEnrollmentResponse';
import { mockEnrollmentResponseTwoMonthNotVerified } from '../fixtures/mockEnrollmentResponseTwoMonthNotVerified';
import { mockEnrollmentVerification } from '../fixtures/mockEnrollmentVerification';

describe('Enrollment verification e2e - user unauthenticated', () => {
  it('All texts are present for the - claimant ev is up to date', () => {
    cy.intercept('GET', '/meb_api/v0/enrollment', mockEnrollmentResponse).as(
      'mockEnrollmentResponse',
    );
    cy.login();
    cy.visit('http://localhost:3001/education/verify-school-enrollment/');

    cy.injectAxeThenAxeCheck();
    cy.url().should('include', '/education/verify-school-enrollment/');

    cy.get(
      'a[href*="/education/verify-school-enrollment/enrollment-verifications/"]',
    ).should('be.visible');
    cy.get(
      'a[href*="/education/verify-school-enrollment/enrollment-verifications/"]',
    ).should('have.text', 'Verify your enrollments for Post-9/11 GI Bill');
    cy.findByText(
      'If you have education benefits, verify your enrollments each month to continue getting paid.',
    ).should('be.visible');
    cy.findByText('Who will need to verify their enrollment?').should(
      'be.visible',
    );
    cy.findByText('For Montgomery GI Bill benefits:').should('be.visible');
  });

  it('All texts are present for the - claimant ev is up to date', () => {
    cy.intercept('GET', '/meb_api/v0/enrollment', mockEnrollmentResponse).as(
      'mockEnrollmentResponse',
    );
    cy.login();
    cy.visit('http://localhost:3001/education/verify-school-enrollment/');
    cy.get(
      'a[href*="/education/verify-school-enrollment/enrollment-verifications/"]',
    ).click();
    cy.injectAxeThenAxeCheck();
    cy.url().should(
      'include',
      '/education/verify-school-enrollment/enrollment-verifications/',
    );
    cy.get(
      'a[href="/education/verify-school-enrollment/enrollment-verifications/verify/"]:nth-child(1) ',
    ).should('have.length', 0);
  });

  it('All texts are present for the - claimant two months not updated', () => {
    cy.intercept(
      'GET',
      '/meb_api/v0/enrollment',
      mockEnrollmentResponseTwoMonthNotVerified,
    ).as('mockEnrollmentResponseTwoMonthNotVerified');
    cy.login();
    cy.visit('http://localhost:3001/education/verify-school-enrollment/');
    cy.get(
      'a[href*="/education/verify-school-enrollment/enrollment-verifications/"]',
    ).click();
    cy.injectAxeThenAxeCheck();
    cy.url().should(
      'include',
      '/education/verify-school-enrollment/enrollment-verifications/',
    );
    cy.get(
      'a[href="/education/verify-school-enrollment/enrollment-verifications/verify/"]',
    )
      .as('verification links')
      .should('have.length', 3);

    cy.get(
      'a[href="/education/verify-school-enrollment/enrollment-verifications/verify/"]',
    )
      .contains('Verify all enrollments')
      .as('verification links')
      .click();

    for (let i = 1; i < 3; i++) {
      cy.get(
        'va-radio-option[value="VERIFICATION_STATUS_CORRECT"][label="Yes, this information is correct"]',
      ).click();
      cy.get(
        'va-radio-option[value="VERIFICATION_STATUS_CORRECT"][label="Yes, this information is correct"]',
      ).should('have.attr', 'checked');
      cy.get('button[type="button"][id*="continueButton"]')
        .contains('Continue')
        .click();
    }

    cy.get('button[type="button"')
      .contains('Submit verification')
      .click();

    cy.intercept(
      'POST',
      '/meb_api/v0/submit_enrollment_verification',
      mockEnrollmentVerification,
    ).as('mockEnrollmentVerification');
  });
});
