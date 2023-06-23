describe('Medical Records View Immunizations', () => {
  it('Visits Medical Records View Immunization List', () => {
    cy.visit('my-health/medical-records/health-history/vaccines');
    cy.injectAxe();
    cy.axeCheck();
  });
});
