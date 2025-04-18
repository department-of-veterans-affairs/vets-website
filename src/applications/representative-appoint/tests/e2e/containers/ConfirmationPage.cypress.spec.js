describe.skip('ConfirmationPrintSign', () => {
  beforeEach(() => {
    cy.visit(
      '/get-help-from-accredited-representative/appoint-rep/confirmation',
    );
    cy.injectAxe();
  });

  // eslint-disable-next-line @department-of-veterans-affairs/axe-check-required
  it('should render the page with all components', () => {
    cy.get('h2').contains('Download, print, and sign your form');
    cy.get('va-icon').should('exist');
    cy.get('va-link').contains('Download your form');
    cy.get('va-checkbox').should('exist');
    cy.get('va-button').contains('Continue');
    cy.get('h2').contains('Need help?');
  });

  it('should render the page with no accessibility violations', () => {
    cy.axeCheck();
  });

  it('should show an error message if the checkbox is not checked and Continue is clicked', () => {
    cy.get('va-button')
      .contains('Continue')
      .click();

    cy.axeCheck();

    cy.get('va-checkbox')
      .shadow()
      .find('input[type="checkbox"]')
      .should('not.be.checked');

    cy.get('.usa-error-message').should(
      'contain',
      "Please confirm that you've downloaded, printed, and signed your form.",
    );
  });

  it('should remove the error message when the checkbox is checked', () => {
    cy.get('va-button')
      .contains('Continue')
      .click();

    cy.axeCheck();

    cy.get('.usa-error-message').should(
      'contain',
      "Please confirm that you've downloaded, printed, and signed your form.",
    );

    cy.get('va-checkbox')
      .shadow()
      .find('input[type="checkbox"]')
      .click({ force: true });

    cy.axeCheck();

    cy.get('va-button')
      .contains('Continue')
      .click();

    cy.axeCheck();

    cy.get('.usa-error-message').should('not.exist');
  });

  it('should toggle the checkbox value when clicked', () => {
    cy.get('va-checkbox')
      .shadow()
      .find('input[type="checkbox"]')
      .should('not.be.checked');

    cy.get('va-checkbox')
      .shadow()
      .find('input[type="checkbox"]')
      .click({ force: true });

    cy.get('va-checkbox')
      .shadow()
      .find('input[type="checkbox"]')
      .should('be.checked');

    cy.axeCheck();

    cy.get('va-checkbox')
      .shadow()
      .find('input[type="checkbox"]')
      .click({ force: true });

    cy.get('va-checkbox')
      .shadow()
      .find('input[type="checkbox"]')
      .should('not.be.checked');

    cy.axeCheck();
  });

  it('should trigger the download of the form when the download link is clicked', () => {
    cy.get('va-link')
      .contains('Download your form')
      .click();

    cy.axeCheck();

    // Add assertions once the download function is implemented
  });
});
