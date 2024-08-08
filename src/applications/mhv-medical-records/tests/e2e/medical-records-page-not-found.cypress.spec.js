import { notFoundHeading } from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import { rootUrl } from '../../manifest.json';

describe('Page Not Found', () => {
  it('Visit an unsupported URL and get a page not found', () => {
    cy.visit(`${rootUrl}/path1`);
    cy.injectAxeThenAxeCheck();
    cy.findByRole('heading', { name: notFoundHeading }).should.exist;
    cy.get('[data-testid="mhv-mr-navigation"]').should('not.exist');

    cy.visit(`${rootUrl}/path1/path2`);
    cy.findByRole('heading', { name: notFoundHeading }).should.exist;
    cy.get('[data-testid="mhv-mr-navigation"]').should('not.exist');
  });
});
