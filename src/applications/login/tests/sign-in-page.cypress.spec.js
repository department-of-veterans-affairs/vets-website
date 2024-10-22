describe('Unified Sign-in Page', () => {
  context(`when 'sign_in_modal_v2: true' feature toggle is enabled`, () => {
    beforeEach(() => {
      cy.intercept('GET', '/data/cms/vamc-ehr.json', { statusCode: 200 });
    });

    it(`display correct sign-in content`, () => {
      cy.visit('/sign-in/?oauth=false');
      cy.get('body').should('be.visible');
      cy.get('#mhvH3').should('be.visible');
      cy.get('#dslogonH3').should('be.visible');
      cy.injectAxeThenAxeCheck();
    });
  });
});
