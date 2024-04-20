describe('Enrollment Verification Page Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', '/vye/v1').as('getData');
    cy.visit('/education/verify-your-enrollment/');
    cy.wait('@getData');
  });
  it('should navigate to benefits-profile when Manage your benefits profile link is clicked', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      '[href="/education/verify-your-enrollment/benefits-profile/"]',
    ).should('exist');
    cy.get(
      '[href="/education/verify-your-enrollment/benefits-profile/"]',
    ).click();
    cy.url().should('include', '/benefits-profile');
    cy.get('[class="vads-u-margin-top--0 vads-u-font-weight--bold"]').should(
      'contain',
      'Mailing address',
    );
  });
  it('Should expand the form when Edit button is clicked', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      '[href="/education/verify-your-enrollment/benefits-profile/"]',
    ).click();
    cy.get('[id="VYE-mailing-address-button"]').click();
    cy.get('[class="vads-u-font-weight--bold"]').should(
      'contain',
      'Change mailing address',
    );
    cy.get('[id="root_fullName-label"]').should(
      'contain',
      "Veteran's Full Name",
    );
  });
  it('Should shows error if one if requried field is missing', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      '[href="/education/verify-your-enrollment/benefits-profile/"]',
    ).click();
    cy.get('[id="VYE-mailing-address-button"]').click();
    cy.get(
      '[aria-label="save your Mailing address for GI Bill benefits"]',
    ).click();
    cy.get('[id="root_city-error-message"]').should(
      'contain',
      'City is required',
    );
    cy.get('[id="root_stateCode-error-message"]').should(
      'contain',
      'State is required',
    );
  });
  it('Should submit form when all required fileds not empty', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      '[href="/education/verify-your-enrollment/benefits-profile/"]',
    ).click();
    cy.get('[id="VYE-mailing-address-button"]').click();
    cy.get(
      '[aria-label="save your Mailing address for GI Bill benefits"]',
    ).click();
    cy.get('[id="root_city-error-message"]').should(
      'contain',
      'City is required',
    );
    cy.get('[id="root_stateCode-error-message"]').should(
      'contain',
      'State is required',
    );
  });
  it('should send address after save button is clicked', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      '[href="/education/verify-your-enrollment/benefits-profile/"]',
    ).click();
    cy.get('[id="VYE-mailing-address-button"]').click();
    cy.get('input[id="root_fullName"]').type('Jhon Doe');
    cy.get('[id="root_countryCodeIso3"]').select('United States');
    cy.get('input[id="root_addressLine1"]').type('322 26th ave apt 1');
    cy.get('input[id="root_city"]').type('San Francisco');
    cy.get('[id="root_stateCode"]').select('California');
    cy.get('input[id="root_zipCode"]').type('94121');
  });
  it('should close address form when cancle button is clicked', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      '[href="/education/verify-your-enrollment/benefits-profile/"]',
    ).click();
    cy.get('[id="VYE-mailing-address-button"]').click();
    cy.get(
      '[label="cancel updating your bank information for GI Bill benefits"]',
    ).click();
    cy.get('[class="vads-u-margin-top--0 vads-u-font-weight--bold"]').should(
      'contain',
      'Mailing address',
    );
  });
});
