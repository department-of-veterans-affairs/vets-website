import manifest from '../manifest.json';

describe('Terms and Conditions test', () => {
  it('Page loads and passes accessibility check', () => {
    cy.visit(manifest.rootUrl);
    cy.get('body').should('be.visible');
    cy.injectAxeThenAxeCheck();
  });
});
