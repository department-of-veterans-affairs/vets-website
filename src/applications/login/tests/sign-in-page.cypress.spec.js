describe('Unified Sign-in Page', () => {
  context(`when 'sign_in_modal_v2: true' feature toggle is enabled`, () => {
    beforeEach(() => {
      cy.intercept('GET', '/data/cms/vamc-ehr.json', { statusCode: 200 });
      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          features: [{ name: 'sign_in_modal_v2', value: true }],
        },
      });
    });

    it(`display correct sign-in content`, () => {
      cy.visit('/sign-in/?oauth=false');
      cy.get('body').should('be.visible');
      cy.get('#mhvH3').should('be.visible');
      cy.get('#dslogonH3').should('be.visible');
      cy.injectAxeThenAxeCheck();
    });
  });

  context(`when 'sign_in_modal_v2: false' feature toggle is disabled`, () => {
    beforeEach(() => {
      cy.intercept('GET', '/data/cms/vamc-ehr.json', { statusCode: 200 });
      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          features: [{ name: 'sign_in_modal_v2', value: false }],
        },
      });
    });

    it(`display correct sign-in content`, () => {
      cy.visit('/sign-in/?oauth=false');
      cy.get('body').should('be.visible');
      cy.get('.vads-c-action-link--blue').should('have.length', 2);
      cy.injectAxeThenAxeCheck();
    });
  });
});
