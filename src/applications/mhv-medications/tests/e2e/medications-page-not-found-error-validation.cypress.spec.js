import { rootUrl } from '../../manifest.json';

describe('Medications unsupported URL', () => {
  it('Visit unsupported URL and get a page not found', () => {
    cy.visit(`${rootUrl}/dummy/dummy`);
    cy.injectAxeThenAxeCheck();
    cy.findByTestId('mhv-page-not-found');
  });
});
