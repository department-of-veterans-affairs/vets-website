// Testing Start enrollment verification

describe('Enrollment Verification Page Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', '/vye/v1', { statusCode: 200 });
    cy.intercept('GET', '/v0/feature_toggles?*', { statusCode: 200 });
    cy.intercept('GET', '/data/cms/vamc-ehr.json', { statusCode: 200 });
    cy.visit('/education/verify-your-enrollment/', {
      onBeforeLoad: win => {
        /* eslint no-param-reassign: "error" */
        win.isProduction = true;
      },
    });
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
    cy.get(
      '[class="vads-u-font-size--h4 vads-u-display--flex vads-u-align-items--center"]',
    ).should('contain', 'Verified');
  });
  it("should go to  'Your benefits profile when' when 'Manage your benefits profile' link is clicked ", () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      'a[href="/education/verify-your-enrollment/benefits-profile/"]',
    ).click();
    cy.get('div[id="benefits-gi-bill-profile-statement"]').should(
      'contain',
      'Your benefits profile',
    );
  });
  it("should go back to 'enrollment verification' when 'Montgomery GI Bill Enrollment Verification' link is clicked ", () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      'a[href="/education/verify-your-enrollment/benefits-profile/"]',
    ).click();
    cy.get('a[href="/education/verify-your-enrollment/"]')
      .first()
      .click();
    cy.url().should('not.include', '/benefits-profile');
  });
  it("should go back to 'Manage your VA debt' when 'Manage your VA debt' link is clicked ", () => {
    cy.injectAxeThenAxeCheck();
    cy.get('a[href="https://www.va.gov/manage-va-debt/"]').click();
    cy.url().should('include', '/manage-va-debt');
    cy.get('h1').should(
      'contain',
      'Manage your VA debt for benefit overpayments and copay bills',
    );
  });
  it("should  have focus around 'Showing x-y of z monthly enrollments listed by most recent' when pagination button is clicked", () => {
    cy.injectAxeThenAxeCheck();
    cy.get('a[aria-label="page 1, first page"]').click();
    cy.get('[id="vye-pagination-page-status-text"]').should('be.focused');
  });
});
