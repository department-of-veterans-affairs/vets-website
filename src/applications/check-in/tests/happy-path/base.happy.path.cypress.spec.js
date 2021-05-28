describe('Check In Experience -- ', () => {
  it('Does the button check us in', () => {
    cy.visit('/check-in/welcome');
    cy.get('h1').contains('Appointment details');
    cy.get('.usa-button').click();
    cy.get('h1').contains("You're now checked in");
  });
});
