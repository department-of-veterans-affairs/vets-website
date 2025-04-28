import { rootUrl } from '../../manifest.json';

describe('Page Not Found', () => {
  it('Visit an unsupported URL and get a page not found', () => {
    cy.visit(`${rootUrl}/path1`);
    cy.injectAxeThenAxeCheck();
    cy.get('[data-testid="mhv-page-not-found"]').should('exist');
    cy.get('[data-testid="mhv-mr-navigation"]').should('not.exist');

    cy.visit(`${rootUrl}/path1/path2`);
    cy.get('[data-testid="mhv-page-not-found"]').should('exist');
    cy.get('[data-testid="mhv-mr-navigation"]').should('not.exist');
  });
});
