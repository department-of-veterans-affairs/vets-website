import manifest from '../manifest.json';
import routes from '../routes';

describe('Terms of use application', () => {
  it('loads the homepage (/terms-of-use) and passes accessibility check', () => {
    cy.visit(`${manifest.rootUrl}${routes[0].path}`);
    cy.get('body').should('be.visible');
    cy.injectAxeThenAxeCheck();
  });
  it('loads the declined page (/terms-of-use/declined) and passes accessibility check', () => {
    cy.visit(`${manifest.rootUrl}${routes[1].path}`);
    cy.get('body').should('be.visible');
    cy.injectAxeThenAxeCheck();
  });
});
