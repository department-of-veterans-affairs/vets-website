// Testing Start enrollment verification

describe('Enrollment Verification Page Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', '/vye/v1').as('getData');
    cy.visit('/education/verify-your-enrollment/');
    cy.wait('@getData');
  });

  it('should display the enrollment verification breadcrumbs', () => {
    cy.injectAxeThenAxeCheck();
    cy.get('[id="vye-periods-to-verify-container"]').should('exist');
  });
  it('should show VA Form 22-8979 STUDENT VERIFICATION OF ENROLLMENT', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      '.vye-mimic-va-button.vads-u-font-family--sans.vads-u-margin-top--0',
    ).click();
    cy.get('.va-introtext').should(
      'contain',
      'VA Form 22-8979 STUDENT VERIFICATION OF ENROLLMENT',
    );
    cy.url().should('include', '/verification-review');
    cy.get('.vye-highlighted-content-container').should('exist');
  });
  it('should show the submit button disabled at first', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      '.vye-mimic-va-button.vads-u-font-family--sans.vads-u-margin-top--0',
    ).click();
    cy.get('[text="Submit"]').should('be.disabled');
  });
  it('should show the submit button not disabled when radio button is checked', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      '.vye-mimic-va-button.vads-u-font-family--sans.vads-u-margin-top--0',
    ).click();
    cy.get('[for="vye-radio-button-yesinput"]').click();
    cy.get('[text="Submit"]').should('not.be.disabled');
  });
  it('should go back to previous screen when Go Back button is clicked', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      '.vye-mimic-va-button.vads-u-font-family--sans.vads-u-margin-top--0',
    ).click();
    cy.get('[class="usa-button usa-button--outline"]').click();
    cy.url().should('include', '/verify-your-enrollment');
    cy.get('[id="montgomery-gi-bill-enrollment-statement"]').should(
      'contain',
      'Montgomery GI Bill® enrollment verification',
    );
  });
  it('should show success message when submit button is clicked', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      '[class="vads-u-margin-y--0 text-color vads-u-font-family--sans"]',
    ).should('contain', 'This month has not yet been verified.');
    cy.get(
      '.vye-mimic-va-button.vads-u-font-family--sans.vads-u-margin-top--0',
    ).click();
    cy.get('[for="vye-radio-button-yesinput"]').click();
    cy.get('[text="Submit"]').click();
    cy.get(
      '[class=" vads-u-font-size--h2 vads-u-font-weight--bold vye-h2-style-as-h3 "]',
    ).should('contain', 'You have successfully verified your enrollment');
    cy.get('[class="vads-u-font-size--h4"]').should('contain', 'Verified');
  });
});
