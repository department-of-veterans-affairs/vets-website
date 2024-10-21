describe('Unified Sign-in Page', () => {
  context(`when 'sign_in_modal_v2: true' feature toggle is enabled`, () => {
    beforeEach(() => {
      cy.intercept('GET', '/data/cms/vamc-ehr.json', { statusCode: 200 });
      cy.intercept('GET', '/v0/feature_toggles?*', { statusCode: 200 });
    });

    it(`display correct sign-in content`, () => {
      cy.visit('/sign-in/?oauth=false');
      cy.get('body').should('be.visible');
      cy.injectAxeThenAxeCheck();
    });
  });
});
