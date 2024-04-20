describe('Address Validations', () => {
  beforeEach(() => {
    cy.intercept('GET', '/vye/v1').as('getData');
    cy.visit('/education/verify-your-enrollment/');
    cy.wait('@getData');
  });
  it('should not show suggested address if address is correct', () => {
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
    cy.get(
      '[aria-label="save your Mailing address for GI Bill benefits"]',
    ).click();
  });
  it('should show suggested address when address is partially correct', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      '[href="/education/verify-your-enrollment/benefits-profile/"]',
    ).click();
    cy.get('[id="VYE-mailing-address-button"]').click();
    cy.get('input[id="root_fullName"]').type('Jhon Doe');
    cy.get('[id="root_countryCodeIso3"]').select('United States');
    cy.get('input[id="root_addressLine1"]').type('322 26th ave');
    cy.get('input[id="root_city"]').type('San Francisco');
    cy.get('[id="root_stateCode"]').select('California');
    cy.get('input[id="root_zipCode"]').type('94121');
    cy.get(
      '[aria-label="save your Mailing address for GI Bill benefits"]',
    ).click();
  });
});
