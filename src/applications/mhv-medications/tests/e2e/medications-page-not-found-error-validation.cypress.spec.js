import { pageNotFoundHeading } from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import { rootUrl } from '../../manifest.json';

describe('Medications unsupported URL', () => {
  it('Visit unsupported URL and get a page not found', () => {
    cy.visit(`${rootUrl}/dummy/dummy`);
    cy.injectAxeThenAxeCheck();
    cy.findByRole('heading', { name: pageNotFoundHeading }).should.exist;
  });
});
