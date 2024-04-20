describe('Enrollment Verification Page Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', '/vye/v1').as('getData');
    cy.visit('/education/verify-your-enrollment/');
    cy.wait('@getData');
  });
  it('should show Dirct deposit infromation', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      '[href="/education/verify-your-enrollment/benefits-profile/"]',
    ).click();
    cy.get(
      '[class="vads-u-font-size--h2 vads-u-font-family--serif vads-u-font-weight--bold"]',
    ).should('contain', 'Direct deposit information');
  });
  it('should open bank info form when Add or update account buttton is clicked', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      '[href="/education/verify-your-enrollment/benefits-profile/"]',
    ).click();
    cy.get('[id="VYE-add-new-account-button"]').click();
    cy.get(
      '[alt="On a personal check, find your bank’s 9-digit routing number listed along the bottom-left edge, and your account number listed beside that."]',
    ).should('exist');
    cy.get('[for="root_GI-Bill-Chapters-AccountTypeCheckinginput"]').should(
      'contain',
      'Checking',
    );
  });
  it('should close the form when Cancel button is clicked ', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      '[href="/education/verify-your-enrollment/benefits-profile/"]',
    ).click();
    cy.get('[id="VYE-add-new-account-button"]').click();
    cy.get(
      '[aria-label="cancel updating your bank information for GI Bill® benefits"]',
    ).click();
    cy.get('[for="root_GI-Bill-Chapters-AccountTypeCheckinginput"]').should(
      'not.exist',
    );
  });
  it('should show show errors when save button is clicked and some or all of the required fields empty ', () => {
    cy.injectAxeThenAxeCheck();
    cy.get(
      '[href="/education/verify-your-enrollment/benefits-profile/"]',
    ).click();
    cy.get('[id="VYE-add-new-account-button"]').click();
    cy.get('input[id="root_GI-Bill-Chapters-phone"]').type('4082037901');
    cy.get(
      'label[for="root_GI-Bill-Chapters-AccountTypeCheckinginput"]',
    ).click();
    cy.get(
      '[aria-label="save your bank information for GI Bill® benefits"]',
    ).click();
    cy.get('[id="root_GI-Bill-Chapters-fullName-error-message"]').should(
      'contain',
      "Please enter the Veteran's Full Name",
    );
    cy.get('[id="root_GI-Bill-Chapters-email-error-message"]').should(
      'contain',
      'Please enter an email address',
    );
    cy.get('[id="root_GI-Bill-Chapters-BankName-error-message"]').should(
      'contain',
      'Please enter the name of your Financial Institution',
    );
  });
});
