/* eslint-disable @department-of-veterans-affairs/axe-check-required */
describe('NextStepsPage', () => {
  beforeEach(() => {
    cy.visit('/get-help-from-accredited-representative/appoint-rep/next-steps');
    cy.injectAxe();
  });

  it('should render the page with all components', () => {
    // Figure out the best way to mock the formData
    cy.get('h1').contains(
      'Fill out your form to appoint a VA accredited representative or VSO',
    );
    cy.get('h2').contains('Your next steps');
    cy.get('p').contains(
      'Both you and the accredited attorney will need to sign your form.',
    );
    cy.get('va-link').contains('Learn how to submit your form');
    cy.get('h2').contains('After you submit your printed form');
    cy.get('p').contains('We usually process your form within 1 week.');
    cy.get('h2').contains('Need help?');
    cy.get('va-telephone[contact="8006982411"]').should('exist');
    cy.get('va-telephone[contact="711"]').should('exist');
  });

  it('should render the AddressBlock with correct data', () => {
    // Figure out the best way to mock the formData
    cy.get('.va-address-block').within(() => {
      cy.contains('Steven McBob');
      cy.contains('Best VSO');
      cy.contains('123 Main Street');
      cy.contains('Anytown, VT 05495');
    });
  });

  it('should render the page with no accessibility violations', () => {
    cy.axeCheck();
  });

  it('should display the correct representative type based on formData', () => {
    cy.get('p').contains(
      'Both you and the accredited attorney will need to sign your form.',
    );
  });

  it('should contain a link to learn how to submit the form', () => {
    cy.get('va-link')
      .contains('Learn how to submit your form')
      .should('have.attr', 'href', '');
  });

  it('should show the help section with correct phone numbers', () => {
    cy.get('va-telephone[contact="8006982411"]').contains('800-698-2411');
    cy.get('va-telephone[contact="711"]').contains('711');
  });
});
