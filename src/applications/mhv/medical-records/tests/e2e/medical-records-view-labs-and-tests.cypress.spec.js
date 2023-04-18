describe('Medical Records View Labs and Tests', () => {
  it('Visits Medical Records View Labs and Tests', () => {
    cy.visit('my-health/medical-records');
    // cy.get('[data-testid="labs-and-tests-sidebar"]').click();
    cy.injectAxe();
    cy.axeCheck();
  });
});
