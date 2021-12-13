describe('COVID-19 Research Form', () => {
  describe('when entering valid information and submitting', () => {
    before(() => {
      cy.visit('coronavirus-research/volunteer/update/update-form');
      cy.injectAxe();
    });

    it.skip('should not load form page and should redirect to volunteer info page', () => {
      cy.url().should('include', 'coronavirus-research/');
      cy.axeCheck();
      // cy.get('h1').contains(
      //   'Update your information in our coronavirus research volunteer list',
      // );
      cy.axeCheck();
    });
  });
});
