import { e2eRoutes } from '../routes';

describe('Terms of use application', () => {
  it('loads the homepage (/terms-of-use) and passes accessibility check', () => {
    cy.visit(e2eRoutes.homepage);
    cy.get('body').should('be.visible');
    cy.injectAxeThenAxeCheck();
  });
  it('loads the declined page (/terms-of-use/declined) and passes accessibility check', () => {
    cy.visit(e2eRoutes.declined);
    cy.get('body').should('be.visible');
    cy.injectAxeThenAxeCheck();
  });
});
